import React, { useState } from 'react';
import { Journey, SubTicket } from '../../types';
import { calculatePassengerCost } from '../../services/optimizerEngine';
import { 
  X, 
  CheckCircle2, 
  Ticket, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles,
  Smartphone,
  Layers,
  Luggage,
  Train,
  Car,
  Bus,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  journey: Journey;
  passengers: number;
  onClose: () => void;
  onStartTracking: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  journey,
  passengers,
  onClose,
  onStartTracking,
}) => {
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [includePorter, setIncludePorter] = useState<boolean>(false);
  const { total: totalCost, perPerson } = calculatePassengerCost(journey, passengers);

  const porterFee = includePorter ? 80 : 0;
  const finalTotal = totalCost + porterFee;

  const handleConfirmBooking = () => {
    setIsBooked(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-600 text-white">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold flex items-center gap-2">
                <span>{isBooked ? 'Unified Multimodal Digital Tickets' : 'Dynamic Multimodal Sub-Passes'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  {journey.subTickets.length} Segment Passes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {journey.title} • {passengers} {passengers === 1 ? 'Passenger' : 'Passengers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {!isBooked ? (
            <>
              {/* Fare & Sub-Pass Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-600">Total Multimodal Fare</span>
                  <span className="text-xl font-black text-slate-900">₹{finalTotal}</span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{journey.subTickets.length} Discrete Transport Tickets</span>
                  <span>₹{Math.round(finalTotal / passengers)} per person</span>
                </div>
              </div>

              {/* Sub-Passes Itemization Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Included Sub-Tickets & Digital Passes for this Journey:
                </label>
                <div className="space-y-2">
                  {journey.subTickets.map((tkt, idx) => (
                    <div key={tkt.id || idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-3 shadow-subtle">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-900 text-xs">{tkt.title}</div>
                          <div className="text-[11px] text-slate-600">{tkt.operator}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{tkt.luggageAllowance || tkt.instructions}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-900 text-xs">
                          ₹{tkt.fareINR * (tkt.mode === 'metro' || tkt.mode === 'bus' ? passengers : 1)}
                        </div>
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Digital Token
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-World Add-on: NDLS Luggage Porter Service */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                    <Luggage className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">NDLS Platform Luggage Porter Voucher</span>
                    <span className="text-[11px] text-slate-600">Assistance with heavy bags from taxi drop to train coach (+₹80)</span>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePorter}
                    onChange={(e) => setIncludePorter(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
                  />
                  <span className="font-bold text-brand-700 text-xs">{includePorter ? 'Added' : 'Add'}</span>
                </label>
              </div>

              {/* Compliance / Integration notice */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <span>
                  <b>One-Click Unified Orchestration:</b> MobiOpt packages DMRC QR tokens, DTC e-bus passes, and ride-hail driver dispatch into discrete validated sub-tickets.
                </span>
              </div>
            </>
          ) : (
            /* Sub-Tickets Generated State */
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm mb-1.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-slate-900">All Sub-Tickets Successfully Issued!</h3>
                <p className="text-xs text-slate-500">Trip Reference: <b className="font-mono text-brand-600">MO-DEL-9842</b></p>
              </div>

              {/* Individual Sub-Ticket Cards */}
              <div className="space-y-3">
                {journey.subTickets.map((tkt, idx) => (
                  <div key={tkt.id || idx} className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-extrabold text-xs text-slate-900">{tkt.title}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ● Ready for Use
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Operator</span>
                        <span className="font-bold text-slate-800">{tkt.operator}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle / Concourse</span>
                        <span className="font-bold text-brand-700">{tkt.vehicleOrGate || 'Platform Concierge'}</span>
                      </div>
                    </div>

                    {/* QR Code Token or OTP Display */}
                    {tkt.qrCodeData ? (
                      <div className="bg-white border border-dashed border-indigo-300 rounded-xl p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-slate-900 rounded p-1 flex items-center justify-center text-white">
                            <QrCode className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-[11px] text-slate-900">{tkt.qrCodeData}</div>
                            <div className="text-[9px] text-slate-500">Scan at AFC Turnstile</div>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-900">₹{tkt.fareINR * passengers}</span>
                      </div>
                    ) : tkt.otp ? (
                      <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500">Driver Start OTP:</span>
                          <span className="font-mono font-extrabold text-base text-brand-600 ml-1.5">{tkt.otp}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">₹{tkt.fareINR}</span>
                      </div>
                    ) : null}
                  </div>
                ))}

                {/* Porter Voucher if added */}
                {includePorter && (
                  <div className="bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-3 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Luggage className="w-5 h-5 text-indigo-600" />
                      <div>
                        <div className="font-bold text-indigo-950">NDLS Platform 1 Porter Service Voucher</div>
                        <div className="text-[10px] text-indigo-700">Token ID: NR-COOLIE-492 • Up to 3 large suitcases</div>
                      </div>
                    </div>
                    <span className="font-black text-xs text-indigo-900">₹80</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {!isBooked ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBooking}
                className="flex-1 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirm & Issue {journey.subTickets.length} Tickets</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartTracking();
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Launch Live GPS Trip Navigation</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
