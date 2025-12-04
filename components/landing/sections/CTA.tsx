import Link from "next/link";
import { ShieldCheck, Headphones, Activity } from "lucide-react";
import { ArrowIcon } from "../shared/ArrowIcon";

export function CTA() {
  return (
    <section className="bg-white box-border flex flex-col items-center justify-center px-[120px] py-[112px] relative w-full">
      <div className="flex flex-col gap-8 items-center justify-center relative shrink-0 w-full">
        <div className="box-border flex gap-[10px] items-center justify-center px-[71px] py-0 relative shrink-0 w-full">
          <div className="font-['Inter',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[color:var(--black,#000000)] text-center tracking-[-0.96px] whitespace-nowrap">
            <p className="leading-[normal] mb-0 text-[48px]">Stop wasting time </p>
            <p className="leading-[normal] text-[48px]">
              <span>on </span>
              <span className="font-['Inter',sans-serif] font-normal italic text-green-600 tracking-[-0.96px]">manual</span>
              <span> As-Builts.</span>
            </p>
          </div>
        </div>
        <div className="flex gap-[10px] items-center justify-center opacity-90 relative shrink-0 w-full">
          <div className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[18px] text-center text-slate-600 w-[726px] whitespace-pre-wrap">
            <p className="mb-0">Join thousands of construction professionals who trust </p>
            <p>SiteBuilt to streamline their projects</p>
          </div>
        </div>
        <div className="box-border flex gap-4 items-start justify-center pl-0 pr-[0.021px] py-0 relative shrink-0 w-[522px]">
          <Link
            href="/signup"
            className="group bg-blue-600 flex-[1_0_0] h-[60px] min-h-px min-w-px relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
          >
            <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative w-full">
              <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white">
                Start free trial
              </span>
              <ArrowIcon className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all" size={18} />
            </div>
          </Link>
          <Link
            href="/contact"
            className="group border border-blue-600 border-solid flex-[1_0_0] h-[60px] min-h-px min-w-px relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
          >
            <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative w-full">
              <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-blue-600 group-hover:text-blue-700 transition-colors">
                Contact Sales
              </span>
              <ArrowIcon className="relative shrink-0 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" size={18} />
            </div>
          </Link>
        </div>
        <div className="flex gap-8 h-5 items-center justify-center opacity-75 relative shrink-0 w-full">
          <div className="h-5 relative shrink-0 w-[118.208px]">
            <div className="h-5 relative w-[118.208px] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <p className="font-['Arial',sans-serif] leading-[20px] not-italic text-[14px] text-center text-slate-600">
                SOC 2 Certified
              </p>
            </div>
          </div>
          <div className="h-5 relative shrink-0 w-[105.583px]">
            <div className="h-5 relative w-[105.583px] flex items-center gap-1">
              <Headphones className="w-4 h-4 text-slate-600" />
              <p className="font-['Arial',sans-serif] leading-[20px] not-italic text-[14px] text-center text-slate-600">
                24/7 Support
              </p>
            </div>
          </div>
          <div className="h-5 relative shrink-0 w-[110.333px]">
            <div className="h-5 relative w-[110.333px] flex items-center gap-1">
              <Activity className="w-4 h-4 text-slate-600" />
              <p className="font-['Arial',sans-serif] leading-[20px] not-italic text-[14px] text-center text-slate-600">
                99.9% Uptime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

