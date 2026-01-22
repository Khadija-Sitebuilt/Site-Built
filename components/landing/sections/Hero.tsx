"use client";

import Link from "next/link";
import { VideoIcon } from "lucide-react";
import { images } from "../assets";
import { ArrowIcon } from "../shared/ArrowIcon";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export function Hero() {
  const headingAnim = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      id="hero"
      className="box-border flex flex-col gap-10 md:gap-16 lg:gap-20 items-center overflow-clip px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-20 md:py-32 lg:pt-[25.75px] lg:pb-50 relative w-full"
      style={{
        background:
          "linear-gradient(180deg, rgba(249,250,251,1) 55%, rgba(84,122,204,0.2) 71%, rgba(11,64,182,0.05) 95%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-center opacity-20 bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${images.heroBackgroundImage})`,
        }}
      />
      <div className="flex flex-col gap-10 md:gap-16 lg:gap-20 items-center max-w-[1280px] relative shrink-0 w-full">
        <div className="flex flex-col gap-6 md:gap-8 items-center max-w-full md:max-w-[768px] relative shrink-0 w-full px-4 sm:px-0">
          <div className="flex flex-col gap-4 md:gap-6 items-center leading-[0] relative shrink-0 text-center w-full">
            <div className="group border bg-blue-50 border-blue-200 border-solid shrink-0 transition-all duration-200 relative rounded-full sm:w-auto">
              <div className="flex gap-2 h-[29px] items-center justify-center px-3.75 py-1.25 relative">
                <div className="relative shrink-0 w-2 h-2 rounded-full bg-blue-700/50" />
                <span className="font-['Open_Sans',sans-serif] leading-4.75 not-italic relative shrink-0 text-sm md:text-base text-blue-700">
                  AI-Powered SiteBuilt Generation
                </span>
              </div>
            </div>
            <div
              ref={headingAnim.ref}
              className={`font-outfit font-bold relative shrink-0 text-[0px] w-full whitespace-pre-wrap ${headingAnim.isVisible ? "animate-blur-in" : "opacity-0-animate"}`}
            >
              <p className="font-outfit leading-[1.2] mb-0 not-italic text-3xl sm:text-4xl lg:text-5xl tracking-[-0.96px] text-black">
                Turn Site Photos into{" "}
              </p>
              <p className="leading-[1.275] text-3xl sm:text-4xl lg:text-5xl tracking-[-0.96px] text-black">
                <span className="font-outfit font-bold not-italic text-black">
                  Accurate
                </span>
                <span className="font-outfit font-bold not-italic text-black">
                  {" "}
                </span>
                <span className="font-outfit font-bold not-italic text-black">
                  As-Built
                </span>
                <span className="font-outfit font-bold not-italic text-black">
                  {" "}
                  Drawings
                </span>
                <br />
                <span className="font-outfit font-normal not-italic text-green-600">
                  -Automatically.
                </span>
              </p>
            </div>
            <div className="font-['Open_Sans',sans-serif] font-normal leading-[1.389] relative shrink-0 text-base md:text-lg text-slate-600 w-full whitespace-pre-wrap">
              <p className="mb-0">
                Upload site photos. Our AI generates precise As-Built{" "}
              </p>
              <p>drawings engineers can trust."</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 min-h-[60px] items-center justify-center relative shrink-0 w-full">
            <Link
              href="/signup"
              className="group bg-blue-600 h-[60px] w-full sm:w-auto relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
            >
              <div className="flex gap-2 h-[60px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-white">
                  Get Started for free
                </span>
                <ArrowIcon
                  className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all"
                  size={18}
                />
              </div>
            </Link>
            <Link
              href="#demo"
              className="group border border-blue-600 border-solid h-[60px] w-full sm:w-auto relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
            >
              <div className="flex gap-2.5 h-[60px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-blue-600 group-hover:text-blue-700 transition-colors">
                  See Demo
                </span>
                <VideoIcon
                  className="relative shrink-0 text-blue-600 group-hover:text-blue-700 transition-colors"
                  size={24}
                />
              </div>
            </Link>
          </div>
        </div>
        <div
          className="aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[1280/720] bg-no-repeat border border-blue-600 border-solid rounded-[8px] sm:rounded-[12px] md:rounded-[16px] lg:rounded-[20px] shadow-[0px_12px_24px_2px_rgba(23,93,247,0.15)] sm:shadow-[0px_15px_28px_3px_rgba(23,93,247,0.18)] md:shadow-[0px_18px_33px_4px_rgba(23,93,247,0.21)] shrink-0 w-full relative bg-cover bg-top"
          style={{ backgroundImage: `url('${images.heroPlaceholder}')` }}
        />
        <div className="absolute left-[8%] lg:left-[10%] xl:left-[15%] 2xl:left-[205px] pointer-events-none rounded-full w-[80px] h-[80px] xl:w-[100px] xl:h-[100px] 2xl:w-[138px] 2xl:h-[138px] top-[140px] xl:top-[150px] 2xl:top-[199px] hidden lg:block">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover rounded-full size-full"
            src={images.heroPlaceholder1}
          />
          {/* <div className="absolute inset-0 shadow-[inset_0px_0px_4px_0px_rgba(11,64,182,0.2)]" /> */}
        </div>
        <div className="absolute right-[8%] lg:right-[10%] xl:right-[15%] 2xl:right-[200.5px] rounded-full w-[80px] h-[80px] xl:w-[100px] xl:h-[100px] 2xl:w-[147px] 2xl:h-[147px] top-[150px] xl:top-[160px] 2xl:top-[182px] hidden lg:block">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-full size-full"
            src={images.heroPlaceholder2}
          />
        </div>
      </div>
    </section>
  );
}
