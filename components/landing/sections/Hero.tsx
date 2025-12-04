import Link from "next/link";
import { Play } from "lucide-react";
import { images } from "../assets";
import { ArrowIcon } from "../shared/ArrowIcon";

export function Hero() {
  return (
    <section
      className="box-border flex flex-col gap-20 items-center overflow-clip px-[120px] py-[200px] w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,250,251,1) 55%, rgba(84,122,204,0.2) 71%, rgba(11,64,182,0.05) 95%)",
      }}
    >
      <div className="flex flex-col gap-20 items-center max-w-[1280px] relative shrink-0 w-full">
        <div className="flex flex-col gap-8 items-center max-w-[768px] relative shrink-0 w-full">
          <div className="flex flex-col gap-6 items-center leading-[0] relative shrink-0 text-center w-full">
            <div className="font-['Inter',sans-serif] font-bold relative shrink-0 text-[0px] w-full whitespace-pre-wrap">
              <p className="font-['Inter',sans-serif] leading-[1.2] mb-0 not-italic text-[48px] tracking-[-0.96px] text-black">
                Turn Site Photos into{" "}
              </p>
              <p className="leading-[1.2] text-[48px] tracking-[-0.96px] text-black">
                <span className="font-['Inter',sans-serif] font-normal italic text-green-600">Verified</span>
                <span className="font-['Inter',sans-serif] font-bold not-italic text-black"> </span>
                <span className="font-['Inter',sans-serif] font-bold not-italic text-black">As-Builts</span>
                <span className="font-['Inter',sans-serif] font-bold not-italic text-black"> in Minutes.</span>
              </p>
            </div>
            <div className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[18px] text-slate-600 w-full whitespace-pre-wrap">
              <p className="mb-0">
                Upload geo-tagged photos, map them to floor plans, and{" "}
              </p>
              <p>generate accurate As-Built reports automatically.</p>
            </div>
          </div>
          <div className="flex gap-4 h-[60px] items-center justify-center relative shrink-0 w-full">
            <Link
              href="/signup"
              className="group bg-blue-600 h-[60px] relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
            >
              <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white">
                  Get Started for free
                </span>
                <ArrowIcon className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all" size={18} />
              </div>
            </Link>
            <Link
              href="#demo"
              className="group border border-blue-600 border-solid h-[60px] relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
            >
              <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-blue-600 group-hover:text-blue-700 transition-colors">
                  See Demo
                </span>
                <Play className="relative shrink-0 text-blue-600 group-hover:text-blue-700 transition-colors" size={18} fill="currentColor" />
              </div>
            </Link>
          </div>
        </div>
        <div 
          className="aspect-[1280/720] bg-repeat bg-size-[1204.186019897461px_856.31005859375px] bg-top-left border border-blue-600 border-solid rounded-[20px] shadow-[0px_18px_33px_4px_rgba(23,93,247,0.21)] shrink-0 w-full relative"
          style={{ backgroundImage: `url('${images.heroPlaceholder}')` }}
        />
        <div className="absolute left-[205px] pointer-events-none rounded-[270px] size-[138px] top-[159px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[270px] size-full" src={images.heroPlaceholder1} />
          <div className="absolute inset-0 shadow-[inset_0px_0px_4px_0px_rgba(11,64,182,0.2)]" />
        </div>
        <div className="absolute left-[910px] rounded-[146px] size-[147px] top-[171px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[146px] size-full" src={images.heroPlaceholder2} />
        </div>
      </div>
    </section>
  );
}

