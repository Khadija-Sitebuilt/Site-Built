import { Logo } from "../shared/Logo";

const footerLinks = {
  product: ["Features", "Pricing", "Mobile App", "Integrations"],
  company: ["About", "Careers", "Contact", "Blog"],
  support: ["Help Center", "Documentation", "Status", "Privacy"],
};

export function Footer() {
  return (
    <footer className="bg-black border-[rgba(0,0,0,0.1)] border-b-0 border-l-0 border-r-0 border-solid border-t-[1.333px] box-border flex flex-col items-start left-0 pb-5 pt-20 px-[120px] w-full">
      <div className="flex flex-col gap-16 h-[281.333px] items-start relative shrink-0 w-full">
        <div className="flex gap-8 items-center relative shrink-0 w-full">
          <div className="flex flex-[1_0_0] flex-col gap-4 h-40 items-start min-h-px min-w-px relative shrink-0">
            <div className="flex items-end relative shrink-0 w-full">
              <Logo className="content-stretch flex gap-1 items-end justify-center relative shrink-0" />
            </div>
            <div className="flex gap-[10px] items-center justify-center relative shrink-0 w-full">
              <p className="flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[16px] text-white whitespace-pre-wrap">
                Streamlining construction project management through intelligent collaboration tools.
              </p>
            </div>
          </div>
          <div className="flex flex-[1_0_0] flex-col gap-4 h-40 items-start min-h-px min-w-px relative shrink-0">
            <div className="h-6 relative shrink-0 w-full">
              <p className="absolute font-['Open_Sans',sans-serif] font-semibold leading-[normal] left-0 text-[16px] text-white top-[-1.67px]">
                Product
              </p>
            </div>
            <div className="flex flex-col gap-2 h-30 items-start relative shrink-0 w-full">
              {footerLinks.product.map((link, i) => (
                <div key={i} className="h-6 relative shrink-0 w-full">
                  <div className="absolute flex h-[21.333px] items-start left-0 top-[1.33px]">
                    <p className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white">
                      {link}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-[1_0_0] flex-col gap-4 h-40 items-start min-h-px min-w-px relative shrink-0">
            <div className="h-6 relative shrink-0 w-full">
              <p className="absolute font-['Open_Sans',sans-serif] font-semibold leading-[normal] left-0 text-[16px] text-white top-[-1.67px]">
                Company
              </p>
            </div>
            <div className="flex flex-col gap-2 h-30 items-start relative shrink-0 w-full">
              {footerLinks.company.map((link, i) => (
                <div key={i} className="h-6 relative shrink-0 w-full">
                  <div className="absolute flex h-[21.333px] items-start left-0 top-[1.33px]">
                    <p className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white">
                      {link}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-[1_0_0] flex-col gap-4 h-40 items-start min-h-px min-w-px relative shrink-0">
            <div className="h-6 relative shrink-0 w-full">
              <p className="absolute font-['Arial',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-white top-[-1.67px]">
                Support
              </p>
            </div>
            <div className="flex flex-col gap-2 h-30 items-start relative shrink-0 w-full">
              {footerLinks.support.map((link, i) => (
                <div key={i} className="h-6 relative shrink-0 w-full">
                  <div className="absolute flex h-[21.333px] items-start left-0 top-[1.33px]">
                    <p className="font-['Open_Sans',sans-serif] font-normal leading-[normal] relative shrink-0 text-[16px] text-white">
                      {link}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-[57.333px] items-center justify-between relative shrink-0 w-full">
          <div className="relative shrink-0">
            <div className="flex gap-[10px] items-center justify-center relative">
              <p className="font-['Arial',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-white">
                © 2025 SiteBuilt. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

