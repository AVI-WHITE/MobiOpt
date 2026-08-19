import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Journey, LocationItem } from '../../types';
import { Compass, ZoomIn, ZoomOut, Zap, Eye, ShieldAlert, Sparkles } from 'lucide-react';

interface MapViewProps {
  selectedJourney: Journey | null;
  allJourneys: Journey[];
  origin: LocationItem;
  destination: LocationItem;
  isSimulatingDelay?: boolean;
  liveTrackingActive?: boolean;
  liveProgressPercent?: number;
}

const MODE_COLORS: Record<string, string> = {
  walk: '#EAB308',         // Amber
  bicycle: '#10B981',      // Emerald
  auto: '#F97316',         // Delhi Orange Auto
  cab: '#EA580C',          // Deep Orange / Cab
  bus: '#2563EB',          // DTC Blue Electric Bus
  metro: '#F59E0B',        // DMRC Yellow Line
  e_rickshaw: '#14B8A6',   // Teal E-Rickshaw
  train: '#4338CA',        // Indigo
  shared_cab: '#DB2777',   // Pink
  park_and_ride: '#7C3AED',// Purple
  delay: '#EF4444',        // Red for track delay
};

const MODE_EMOJIS: Record<string, string> = {
  walk: '🚶',
  bicycle: '🚲',
  auto: '🛺',
  cab: '🚖',
  bus: '🚌',
  metro: '🚇',
  e_rickshaw: '⚡',
  train: '🚆',
  shared_cab: '🚗',
  park_and_ride: '🅿️',
};

const MODE_LABELS: Record<string, string> = {
  walk: 'Walk',
  bicycle: 'Cycle',
  auto: 'Auto',
  cab: 'Cab',
  bus: 'Bus',
  metro: 'Metro',
  e_rickshaw: 'E-Rick',
  train: 'Train',
  shared_cab: 'Shared',
  park_and_ride: 'P&R',
};

export const MapView: React.FC<MapViewProps> = ({
  selectedJourney,
  allJourneys,
  origin,
  destination,
  isSimulatingDelay,
  liveTrackingActive,
  liveProgressPercent = 0,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayersRef = useRef<L.LayerGroup | null>(null);
  const markerLayersRef = useRef<L.LayerGroup | null>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);

  const [showTrafficOverlay, setShowTrafficOverlay] = useState<boolean>(true);
  const [showAllGhostRoutes, setShowAllGhostRoutes] = useState<boolean>(true);

  // Initialize Map Centered on Central/South Delhi Corridor
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [28.5850, 77.2100], // Delhi NCR (IIT to NDLS Corridor)
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // CartoDB Voyager Clean Vector Tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    routeLayersRef.current = L.layerGroup().addTo(map);
    markerLayersRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when Selected Journey / Journeys / Origin / Destination change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !routeLayersRef.current || !markerLayersRef.current) return;

    routeLayersRef.current.clearLayers();
    markerLayersRef.current.clearLayers();

    const bounds = L.latLngBounds([origin.coordinates, destination.coordinates]);

    // 1. Draw subtle ghost routes for unselected alternatives (NO transfer nodes, just clean lines)
    if (showAllGhostRoutes && allJourneys.length > 0) {
      allJourneys.forEach((journey) => {
        if (journey.id === selectedJourney?.id) return;

        journey.segments.forEach((segment) => {
          const color = MODE_COLORS[segment.mode] || '#94A3B8';
          const isDashed = segment.mode === 'walk' || segment.mode === 'bicycle';

          const polyline = L.polyline(segment.pathCoords, {
            color: color,
            weight: 3.5,
            opacity: 0.25,
            dashArray: isDashed ? '4, 8' : undefined,
            lineCap: 'round',
            lineJoin: 'round',
          });

          routeLayersRef.current?.addLayer(polyline);
        });
      });
    }

    // 2. Draw active selected / inspected journey with bold sub-routes and mode-specific breakpoint markers
    if (selectedJourney) {
      selectedJourney.segments.forEach((segment, idx) => {
        let color = MODE_COLORS[segment.mode] || '#4F46E5';
        const isDashed = segment.mode === 'walk';

        // Check if affected by Delhi Yellow Line delay simulation
        if (isSimulatingDelay && segment.mode === 'metro' && !selectedJourney.isAlternative) {
          color = '#EF4444'; // Red disruption
        }

        // Outline polyline
        const outlinePolyline = L.polyline(segment.pathCoords, {
          color: '#FFFFFF',
          weight: 8,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routeLayersRef.current?.addLayer(outlinePolyline);

        // Main colored segment polyline
        const polyline = L.polyline(segment.pathCoords, {
          color: color,
          weight: 5.5,
          opacity: 1.0,
          dashArray: isDashed ? '6, 8' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
        });
        routeLayersRef.current?.addLayer(polyline);
        segment.pathCoords.forEach(c => bounds.extend(c));

        // ── Rich Transport Breakpoint Markers ──
        // Show a styled chip marker at the START of every segment (idx > 0 = transfer point)
        // Also show a small mode chip at the very start of seg[0] to label the first mode
        const isTransfer = idx > 0;
        const markerCoord = isTransfer ? segment.fromCoords : segment.pathCoords[0];
        const segColor = MODE_COLORS[segment.mode] || '#4F46E5';
        const emoji = MODE_EMOJIS[segment.mode] || '🚍';
        const modeLabel = MODE_LABELS[segment.mode] || segment.mode;
        const lineTag = segment.lineCode ? ` (${segment.lineCode})` : '';

        if (isTransfer) {
          // Large transfer breakpoint chip
          const transferHtml = `
            <div style="
              display:flex; align-items:center; gap:5px;
              background:${segColor}; color:#fff;
              padding:4px 9px 4px 5px;
              border-radius:999px;
              font-size:11px; font-weight:700;
              box-shadow:0 2px 8px rgba(0,0,0,0.28);
              border:2.5px solid #fff;
              white-space:nowrap;
              line-height:1;
            ">
              <span style="font-size:14px;">${emoji}</span>
              <span>${modeLabel}${lineTag}</span>
            </div>
            <div style="
              width:2px; height:8px;
              background:${segColor};
              margin:0 auto;
            "></div>
            <div style="
              width:12px; height:12px;
              border-radius:50%;
              background:#fff;
              border:3px solid ${segColor};
              box-shadow:0 1px 4px rgba(0,0,0,0.22);
              margin:0 auto;
            "></div>
          `;
          const transferIcon = L.divIcon({
            html: transferHtml,
            className: '',
            iconSize: [120, 46],
            iconAnchor: [0, 46],
          });
          const transferMarker = L.marker(markerCoord, { icon: transferIcon });
          transferMarker.bindPopup(`
            <div style="font-family:sans-serif; min-width:200px; padding:8px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span style="font-size:22px;">${emoji}</span>
                <div>
                  <div style="font-weight:800; font-size:13px; color:#1e293b;">${modeLabel}${lineTag} — Transfer</div>
                  <div style="font-size:11px; color:#64748b;">${segment.operator}</div>
                </div>
              </div>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:6px 0;"/>
              <div style="font-size:11px; color:#334155; line-height:1.7;">
                <div>📍 <b>Board at:</b> ${segment.from}</div>
                <div>🏁 <b>Alight at:</b> ${segment.to}</div>
                <div>⏱ <b>Duration:</b> ${segment.durationMinutes} min</div>
                <div>💰 <b>Fare:</b> ₹${segment.costINR}</div>
                <div>⏳ <b>Wait:</b> ${segment.etaRange.waitRange}</div>
                ${segment.platformOrGate ? `<div>🚪 <b>Platform/Gate:</b> ${segment.platformOrGate}</div>` : ''}
              </div>
            </div>
          `);
          markerLayersRef.current?.addLayer(transferMarker);
        } else {
          // Small start-of-route mode label chip
          const startHtml = `
            <div style="
              display:flex; align-items:center; gap:4px;
              background:${segColor}; color:#fff;
              padding:3px 8px 3px 4px;
              border-radius:999px;
              font-size:10px; font-weight:700;
              box-shadow:0 1px 6px rgba(0,0,0,0.2);
              border:2px solid #fff;
              white-space:nowrap;
              opacity:0.92;
            ">
              <span style="font-size:12px;">${emoji}</span>
              <span>${modeLabel}</span>
            </div>
          `;
          const startIcon = L.divIcon({
            html: startHtml,
            className: '',
            iconSize: [80, 24],
            iconAnchor: [40, 24],
          });
          markerLayersRef.current?.addLayer(L.marker(markerCoord, { icon: startIcon }));
        }
      });
    }

    // 3. Add Live Traffic Congestion Overlay along Sri Aurobindo Marg / Ring Road
    if (showTrafficOverlay) {
      const trafficPoints: [number, number][] = [
        [28.5450, 77.1926],
        [28.5600, 77.2050],
        [28.5720, 77.2085],
        [28.5900, 77.2100],
      ];
      const trafficLine = L.polyline(trafficPoints, {
        color: isSimulatingDelay ? '#EF4444' : '#F59E0B',
        weight: 3.5,
        opacity: 0.7,
        dashArray: '4, 6',
      });
      routeLayersRef.current.addLayer(trafficLine);
    }

    // 4. Origin Marker (IIT Delhi)
    const originHtml = `
      <div class="flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full shadow-xl border-2 border-brand-400 text-xs font-bold whitespace-nowrap animate-bounce-soft">
        <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
        <span>START (IIT Delhi)</span>
      </div>
    `;
    const originIcon = L.divIcon({
      html: originHtml,
      className: '',
      iconSize: [120, 28],
      iconAnchor: [60, 28],
    });
    const startMarker = L.marker(origin.coordinates, { icon: originIcon });
    startMarker.bindPopup(`
      <div class="p-2 text-xs">
        <b class="text-slate-900 text-sm">${origin.name}</b><br/>
        <span class="text-slate-600">${origin.address}</span>
      </div>
    `);
    markerLayersRef.current.addLayer(startMarker);

    // 5. Destination Marker (New Delhi Railway Station)
    const destHtml = `
      <div class="flex items-center gap-1.5 bg-brand-700 text-white px-2.5 py-1 rounded-full shadow-xl border-2 border-white text-xs font-bold whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping"></span>
        <span>DESTINATION (NDLS)</span>
      </div>
    `;
    const destIcon = L.divIcon({
      html: destHtml,
      className: '',
      iconSize: [140, 28],
      iconAnchor: [70, 28],
    });
    const endMarker = L.marker(destination.coordinates, { icon: destIcon });
    endMarker.bindPopup(`
      <div class="p-2 text-xs">
        <b class="text-slate-900 text-sm">${destination.name}</b><br/>
        <span class="text-slate-600">${destination.address}</span>
      </div>
    `);
    markerLayersRef.current.addLayer(endMarker);

    // 6. Live in-transit vehicle position marker
    if (liveTrackingActive && selectedJourney) {
      const allCoords = selectedJourney.segments.flatMap(s => s.pathCoords);
      if (allCoords.length > 0) {
        const targetIndex = Math.min(
          allCoords.length - 1,
          Math.floor((liveProgressPercent / 100) * (allCoords.length - 1))
        );
        const currentCoord = allCoords[targetIndex];

        const liveVehicleHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-8 h-8 rounded-full bg-brand-500 opacity-40 animate-ping"></div>
            <div class="w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-2xl border-2 border-white text-xs">
              📍
            </div>
          </div>
        `;
        const liveIcon = L.divIcon({
          html: liveVehicleHtml,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        if (vehicleMarkerRef.current) {
          vehicleMarkerRef.current.setLatLng(currentCoord);
        } else {
          vehicleMarkerRef.current = L.marker(currentCoord, { icon: liveIcon }).addTo(markerLayersRef.current);
        }
      }
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  }, [
    selectedJourney,
    allJourneys,
    origin,
    destination,
    showTrafficOverlay,
    showAllGhostRoutes,
    isSimulatingDelay,
    liveTrackingActive,
    liveProgressPercent,
  ]);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetBounds = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([origin.coordinates, destination.coordinates]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], animate: true });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-slate-100 rounded-2xl overflow-hidden shadow-subtle border border-slate-200/80">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />

      {/* Top Left Floating Legend */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200/80 text-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-800">Delhi Multimodal Network</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Yellow Line</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span>DTC AC Bus</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span>Auto</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span>Magenta</span>
          </div>
        </div>

        {isSimulatingDelay && (
          <div className="bg-rose-50/95 border border-rose-300 text-rose-800 px-3 py-1.5 rounded-xl shadow-md text-xs flex items-center gap-2 animate-bounce-soft">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">Live Alert: DMRC Signal Maintenance (+20m at Green Park)</span>
          </div>
        )}
      </div>

      {/* Top Right Map View Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/80 pointer-events-auto text-xs">
        <button
          onClick={() => setShowTrafficOverlay(!showTrafficOverlay)}
          title="Toggle Traffic Overlay"
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            showTrafficOverlay ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Traffic</span>
        </button>

        <button
          onClick={() => setShowAllGhostRoutes(!showAllGhostRoutes)}
          title="Toggle Multimodal Alternative Routes"
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            showAllGhostRoutes ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-brand-600" />
          <span>All Routes ({allJourneys.length})</span>
        </button>
      </div>

      {/* Bottom Right Floating Zoom & Fit Controls */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200/80 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 my-0.5"></div>
        <button
          onClick={handleResetBounds}
          title="Reset to Delhi NCR Bounds"
          className="p-2 hover:bg-brand-50 text-brand-600 rounded-lg transition"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left: Route Breakpoints Panel */}
      {selectedJourney && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/97 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 text-xs pointer-events-auto max-w-[280px]">
          {/* Header */}
          <div className="flex items-center justify-between px-3.5 pt-3 pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Route Breakpoints
            </span>
            <span className="font-extrabold text-brand-600">
              {selectedJourney.totalDurationMinutes}m · ₹{selectedJourney.totalCostINR}
            </span>
          </div>

          {/* Segment Hops */}
          <div className="px-3 py-2 space-y-1.5 max-h-[220px] overflow-y-auto">
            {selectedJourney.segments.map((seg, idx) => {
              const color = MODE_COLORS[seg.mode] || '#4F46E5';
              const emoji = MODE_EMOJIS[seg.mode] || '🚍';
              const label = MODE_LABELS[seg.mode] || seg.mode;
              const isDelayed = isSimulatingDelay && seg.mode === 'metro' && !selectedJourney.isAlternative;
              const chipColor = isDelayed ? '#EF4444' : color;
              return (
                <div key={seg.id} className="flex items-start gap-2">
                  {/* Step connector */}
                  <div className="flex flex-col items-center shrink-0 mt-0.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow"
                      style={{ background: chipColor }}
                    >
                      {idx + 1}
                    </div>
                    {idx < selectedJourney.segments.length - 1 && (
                      <div className="w-px flex-1 min-h-[12px]" style={{ background: chipColor, opacity: 0.35 }} />
                    )}
                  </div>
                  {/* Segment info */}
                  <div className="flex-1 pb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-white text-[10px]"
                        style={{ background: chipColor }}
                      >
                        <span>{emoji}</span>
                        <span>{label}{seg.lineCode ? ` · ${seg.lineCode}` : ''}</span>
                      </span>
                      {isDelayed && (
                        <span className="text-[10px] text-rose-600 font-bold">⚠ Delay</span>
                      )}
                    </div>
                    <div className="text-slate-700 font-semibold mt-0.5 leading-tight truncate">{seg.from} → {seg.to}</div>
                    <div className="text-slate-400 text-[10px]">{seg.durationMinutes}m · ₹{seg.costINR} · Wait {seg.etaRange.waitRange}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
