"use client";

import { images } from "../assets";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    image: images.step1,
    title: "Upload Site Photos",
    description: "Upload progress or post-installation\nphotos from site.",
  },
  {
    image: images.step2,
    title: "Uses AI + spatial alignment",
    description:
      "Our AI analyzes photos and aligns\nthem to reference drawings to\nunderstand real-world geometry.",
  },
  {
    image: images.step3,
    title: "Converts them into verified\nAs-Built drawings",
    description:
      "Detected elements convert into\nlayered As-Built drawings that\nengineers review and approve.",
  },
  {
    image: images.step4,
    title: "Outputs CAD-ready +\nclient-ready drawings",
    description:
      "Export in DWG, DXF, PDF with revision history and photo references.",
  },
];

export function CoreFeatures() {
  const titleAnim = useScrollAnimation({ threshold: 0.2 });
  const descAnim = useScrollAnimation({ threshold: 0.2 });
  const step1Anim = useScrollAnimation({ threshold: 0.1 });
  const step2Anim = useScrollAnimation({ threshold: 0.1 });
  const step3Anim = useScrollAnimation({ threshold: 0.1 });
  const step4Anim = useScrollAnimation({ threshold: 0.1 });

  const stepAnims = [step1Anim, step2Anim, step3Anim, step4Anim];

  return (
    <section
      id="corefeatures"
      className="bg-gray-50 box-border flex flex-col gap-10 md:gap-16 lg:gap-20 items-center left-0 overflow-clip px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] w-full"
    >
      <div className="flex flex-col gap-10 items-center max-w-[1280px] relative shrink-0 w-full">
        <div className="flex flex-col gap-3 md:gap-4 items-start leading-[0] relative shrink-0 text-center w-full px-4 sm:px-0">
          <h2
            ref={titleAnim.ref}
            className={`font-['Inter',sans-serif] font-semibold leading-tight not-italic relative shrink-0 text-3xl sm:text-4xl tracking-[-0.96px] w-full max-w-full md:max-w-[768px] mx-auto whitespace-pre-wrap ${titleAnim.isVisible ? "animate-fade-in-up" : "opacity-0-animate"}`}
          >
            <span className="text-black">Core </span>
            <span className="text-green-600">Features</span>
          </h2>
          <div
            ref={descAnim.ref}
            className={`font-['Open_Sans',sans-serif] font-normal leading-normal relative shrink-0 text-base md:text-lg text-black w-full max-w-full md:max-w-[768px] mx-auto whitespace-pre-wrap pb-5.25 ${descAnim.isVisible ? "animate-fade-in-up animation-delay-200" : "opacity-0-animate"}`}
          >
            <p className="mb-0">Convert site photos into accurate </p>
            <p>As-Built drawings automatically, without manual CAD marking.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap gap-6 md:gap-6 lg:gap-12 items-start justify-center relative shrink-0 w-full">
          {steps.map((step, index) => {
            const anim = stepAnims[index];
            const delays = ["", "animation-delay-200", "animation-delay-400"];
            return (
              <div
                key={index}
                ref={anim.ref}
                className={`box-border flex flex-col bg-linear-[189deg,#f9fafb_32%,#547acc33_71%,#0b40b60d_95%] rounded-[20px] gap-6 md:gap-8 items-start w-full md:w-[calc(50%-12px)] lg:w-auto lg:flex-[1_0_0] overflow-clip p-4 md:p-5 relative shrink-0 ${anim.isVisible ? `animate-fade-in-up ${delays[index]}` : "opacity-0-animate"}`}
              >
                <div className="flex flex-col gap-4 md:gap-6 items-center relative shrink-0 w-full">
                  <div className="flex flex-col gap-3 md:gap-4 items-start leading-[0] relative shrink-0 w-full">
                    <div className="font-outfit font-medium leading-tight not-italic relative shrink-0 text-base sm:text-lg md:text-xl text-black tracking-[-0.48px] w-full whitespace-pre-wrap">
                      {step.title}
                    </div>
                    <div className="font-arimo font-normal leading-5 relative shrink-0 text-xs sm:text-sm text-slate-600 w-full whitespace-pre-wrap">
                      {step.description}
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 w-full rounded-[15.5px] overflow-clip">
                  <div
                    className="w-full aspect-117/71 bg-no-repeat bg-size-[100%_auto]"
                    style={{ backgroundImage: `url('${step.image}')` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
