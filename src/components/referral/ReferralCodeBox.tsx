"use client";

import { useState } from "react";
import { PRICING } from "@/lib/pricing";

export default function ReferralCodeBox({ code }: { code: string }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const link = `https://gettambola.in/register?theme=55555555-5555-5555-5555-555555555555&ref=${code}`;
  
  const shareMessage = `Hey! 🎉 I've been using GetTambola to run my own Tambola game website.\nUse my referral code *${code}* to get ₹${PRICING.referralDiscount} off your first month!\n\nSign up here 👇\n${link}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  function handleCopy(text: string, type: "code" | "link") {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  return (
    <div className="bg-[#063940] rounded-xl shadow-lg border-2 border-accent overflow-hidden text-white">
      <div className="bg-black/20 px-6 py-4 border-b border-white/10 flex items-center justify-center gap-2">
        <span className="text-xl">🎁</span>
        <h2 className="font-bold tracking-wide uppercase">Refer & Get Free Games</h2>
      </div>
      
      <div className="p-4 sm:p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Your Referral Code
          </label>
          <div className="flex bg-black/40 rounded-lg overflow-hidden border border-white/10 focus-within:border-accent transition-colors">
            <input 
              type="text" 
              readOnly 
              value={code} 
              className="w-full min-w-0 bg-transparent px-3 py-3 font-mono font-bold text-base sm:text-lg outline-none"
            />
            <button 
              onClick={() => handleCopy(code, "code")}
              className="px-3 sm:px-4 bg-white/5 hover:bg-white/10 transition-colors font-medium border-l border-white/10 flex items-center justify-center min-w-[70px] sm:min-w-[80px] text-sm shrink-0"
            >
              {copiedCode ? <span className="text-green-400">Copied!</span> : "Copy"}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Your Referral Link
          </label>
          <div className="flex bg-black/40 rounded-lg overflow-hidden border border-white/10 focus-within:border-accent transition-colors">
            <input 
              type="text" 
              readOnly 
              value={link} 
              className="w-full min-w-0 bg-transparent px-3 py-3 font-medium text-xs sm:text-sm outline-none text-gray-300 truncate"
            />
            <button 
              onClick={() => handleCopy(link, "link")}
              className="px-3 sm:px-4 bg-white/5 hover:bg-white/10 transition-colors font-medium border-l border-white/10 flex items-center justify-center min-w-[70px] sm:min-w-[80px] text-sm shrink-0"
            >
              {copiedLink ? <span className="text-green-400">Copied!</span> : "Copy"}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold py-3 px-4 rounded-lg transition-colors text-sm sm:text-base"
          >
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Share on WhatsApp
          </a>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-red-200">
            ⭐ New customers get ₹{PRICING.referralDiscount} off their first month with your code!
          </p>
        </div>
      </div>
    </div>
  );
}
