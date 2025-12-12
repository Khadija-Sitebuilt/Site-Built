import Link from "next/link";
import { ShieldCheck, Headphones, Activity } from "lucide-react";
import { ArrowIcon } from "../shared/ArrowIcon";

export function CTA() {
  return (
    <section className="bg-white box-border flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] relative w-full">
      <div className="flex flex-col gap-6 md:gap-8 items-center justify-center relative shrink-0 w-full max-w-[1280px]">
        <div className="box-border flex gap-[10px] items-center justify-center px-4 sm:px-0 py-0 relative shrink-0 w-full">
          <div className="font-['Inter',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-[color:var(--black,#000000)] text-center tracking-[-0.96px]">
            <p className="leading-[normal] mb-0 text-3xl sm:text-4xl lg:text-5xl">Stop wasting time </p>
            <p className="leading-[normal] text-3xl sm:text-4xl lg:text-5xl">
              <span>on </span>
              <span className="font-['Inter',sans-serif] font-normal italic text-green-600 tracking-[-0.96px]">manual</span>
              <span> As-Builts.</span>
            </p>
          </div>
        </div>
        <div className="flex gap-[10px] items-center justify-center opacity-90 relative shrink-0 w-full">
          <div className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-base md:text-lg text-center text-slate-600 w-full max-w-[726px] whitespace-pre-wrap">
            <p className="mb-0">Join thousands of construction professionals who trust </p>
            <p>SiteBuilt to streamline their projects</p>
          </div>
        </div>
        <div className="box-border flex flex-col sm:flex-row gap-3 md:gap-4 items-stretch justify-center pl-0 pr-[0.021px] py-0 relative shrink-0 w-full sm:w-auto">
          <Link
            href="/signup"
            className="group bg-blue-600 flex-1 sm:flex-[1_0_0] h-[60px] min-h-px w-full sm:min-w-[200px] relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
          >
            <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative w-full">
              <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-white">
                Start free trial
              </span>
              <ArrowIcon className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all" size={18} />
            </div>
          </Link>
          <Link
            href="/contact"
            className="group border border-blue-600 border-solid flex-1 sm:flex-[1_0_0] h-[60px] min-h-px w-full sm:min-w-[200px] relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
          >
            <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative w-full">
              <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-blue-600 group-hover:text-blue-700 transition-colors">
                Contact Sales
              </span>
              <ArrowIcon className="relative shrink-0 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" size={18} />
            </div>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 h-auto sm:h-5 items-center justify-center opacity-75 relative shrink-0 w-full">
          <div className="h-5 relative shrink-0">
            <div className="h-5 relative flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <p className="font-['Arial',sans-serif] leading-[20px] not-italic text-xs md:text-sm text-center text-slate-600">
                SOC 2 Certified
              </p>
            </div>
          </div>
          <div className="h-5 relative shrink-0">
            <div className="h-5 relative flex items-center gap-1">
              <Headphones className="w-4 h-4 text-slate-600" />
              <p className="font-['Arial',sans-serif] leading-[20px] not-italic text-xs md:text-sm text-center text-slate-600">
                24/7 Support
              </p>
            </div>
          </div>
          <div className="h-5 relative shrink-0">
            <div className="h-5 relative flex items-center gap-1">
              <Activity className="w-4 h-4 text-slate-600" />
              <p className="font-['Arial',sans-serif] leading-[20px] not-italic text-xs md:text-sm text-center text-slate-600">
                99.9% Uptime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

