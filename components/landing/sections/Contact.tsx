export function Contact() {
  return (
    <section className="box-border flex flex-col gap-20 items-center justify-center left-0 px-[120px] py-[112px] w-full">
      <div className="flex flex-col gap-6 items-center leading-[0] relative shrink-0 text-center w-full">
        <div className="font-['Inter',sans-serif] font-bold not-italic relative shrink-0 text-[0px] text-neutral-950 tracking-[-0.96px] whitespace-nowrap">
          <p className="leading-[normal] mb-0 text-[48px]">Contact Us at</p>
          <p className="font-['Inter',sans-serif] font-normal italic leading-[normal] text-[48px]">
            <span className="text-blue-600"> Site</span>
            <span className="text-green-600">Built</span>
          </p>
        </div>
        <div className="flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-[18px] w-[1454.667px] whitespace-pre-wrap">
          <p className="mb-0">Tell us as much detail as possible so we </p>
          <p>can route your message to the right team.</p>
        </div>
      </div>
      <div className="bg-white border border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col items-center p-[33px] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-[566px]">
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col gap-6 items-center relative w-full">
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex gap-2 h-[14px] items-center relative shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950">
                  Full Name
                </p>
              </div>
              <div className="border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-9 items-center overflow-clip px-3 py-1 relative rounded-[8px] shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">
                  John Doe
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex gap-2 h-[14px] items-center relative shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950">
                  Email Address
                </p>
              </div>
              <div className="bg-white border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-9 items-center overflow-clip px-3 py-1 relative rounded-[8px] shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">
                  john@company.com
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex gap-2 h-[14px] items-center relative shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950">
                  Subject
                </p>
              </div>
              <div className="bg-white border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-9 items-center overflow-clip px-3 py-1 relative rounded-[8px] shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px]">
                  How can we help?
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex gap-2 h-[14px] items-center relative shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950">
                  Message
                </p>
              </div>
              <div className="bg-white border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-32 items-start overflow-clip px-3 py-2 relative rounded-[8px] shrink-0 w-full">
                <p className="font-['Arial',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px]">
                  Tell us more about your inquiry...
                </p>
              </div>
            </div>
            <button className="bg-blue-600 box-border flex gap-[10px] h-[60px] items-center justify-center px-5 py-[10px] relative rounded-[30px] shrink-0 w-full">
              <p className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white">
                Send Message
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

