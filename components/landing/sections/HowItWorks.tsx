import { images } from "../assets";

const steps = [
  {
    image: images.step1,
    title: "Drag and drop\nyour floor plan and\nsite photos here.",
    description: "Batch upload supported, save time by\ndropping all photos at once.",
  },
  {
    image: images.step2,
    title: "Our AI auto-pins your photos\nto the correct floor plan location.",
    description: "Adjust pins if needed , full control,\nzero hassle.",
  },
  {
    image: images.step3,
    title: "Generate a polished, photo-\nverified As-Built report in seconds.",
    description: "Share as PDF branded and\n client-ready",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-50 box-border flex flex-col gap-20 items-center left-0 overflow-clip px-[120px] py-[112px] w-full">
      <div className="flex flex-col gap-20 items-center max-w-[1280px] relative shrink-0 w-full">
        <div className="flex flex-col gap-6 items-start leading-[0] relative shrink-0 text-center">
          <p className="font-['Inter',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[0px] text-[48px] tracking-[-0.96px] w-[768px] whitespace-pre-wrap">
            <span className="text-black">How It </span>
            <span className="font-['Inter',sans-serif] font-normal italic text-green-600">Works</span>
          </p>
          <div className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[18px] text-black w-[768px] whitespace-pre-wrap">
            <p className="mb-0">
              Turn site photos into accurate As-Builts in{" "}
            </p>
            <p>three simple steps no CAD, no manual work.</p>
          </div>
        </div>
        <div className="flex gap-12 items-start justify-center relative shrink-0 w-full">
          {steps.map((step, index) => (
            <div key={index} className="box-border flex flex-[1_0_0] flex-col gap-16 items-start min-h-px min-w-px overflow-clip p-5 relative shrink-0">
              <div className="h-[215.676px] relative shrink-0 w-full">
                <div className="absolute border border-gray-50 border-solid h-[215.676px] left-0 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] top-0 w-full">
                  {index === 2 ? (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
                      <img alt="" className="absolute h-[160.3%] left-[1.57%] max-w-none top-[-59.8%] w-full" src={step.image} />
                    </div>
                  ) : (
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[20px] size-full" src={step.image} />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6 items-center relative shrink-0 w-full">
                <div className="flex flex-col gap-4 items-start leading-[0] relative shrink-0 text-center w-full">
                  <div className="font-['Inter',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[24px] text-black tracking-[-0.48px] w-full whitespace-pre-wrap">
                    {step.title}
                  </div>
                  <div className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-slate-600 w-full whitespace-pre-wrap">
                    {step.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

