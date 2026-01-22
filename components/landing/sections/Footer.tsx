import { Logo } from "../shared/Logo";

const footerLinks = {
  product: ["Features", "Pricing", "Mobile App", "Integrations"],
  company: ["About", "Careers", "Contact", "Blog"],
  support: ["Help Center", "Documentation", "Status", "Privacy"],
};

export function Footer() {
  return (
    <footer className="bg-black border-[rgba(0,0,0,0.1)] border-b-0 border-l-0 border-r-0 border-solid border-t-[1.333px] box-border flex flex-col items-start left-0 pb-5 pt-12 md:pt-16 lg:pt-20 px-4 sm:px-8 md:px-12 lg:px-[120px] w-full">
      <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 h-auto items-start relative shrink-0 w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-start relative shrink-0 w-full">
          {/* Logo and Description */}
          <div className="flex flex-col gap-4 md:gap-4 h-auto md:h-40 items-start w-full md:w-auto md:max-w-xs relative shrink-0">
            <div className="flex items-end relative shrink-0 w-full md:w-auto">
              <Logo className="content-stretch flex gap-1 items-end justify-start relative shrink-0" />
            </div>
            <div className="flex gap-[10px] items-start justify-start relative shrink-0 w-full">
              <p className="font-['Open_Sans',sans-serif] font-normal leading-[1.5] relative min-w-0 text-xs sm:text-sm md:text-base text-white whitespace-normal md:whitespace-pre-line break-words">
                {`Streamlining construction project
management through intelligent
collaboration tools.`}
              </p>
            </div>
          </div>

          {/* Product Section */}
          <div className="flex flex-1 flex-col gap-3 md:gap-4 h-auto md:h-40 items-start w-full md:min-w-px relative shrink-0">
            <h3 className="font-['Open_Sans',sans-serif] font-semibold leading-[normal] text-sm sm:text-base md:text-lg text-white">
              Product
            </h3>
            <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
              {footerLinks.product.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="font-['Open_Sans',sans-serif] font-normal leading-[normal] text-xs sm:text-sm md:text-base text-white hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Company Section */}
          <div className="flex flex-1 flex-col gap-3 md:gap-4 h-auto md:h-40 items-start w-full md:min-w-px relative shrink-0">
            <h3 className="font-['Open_Sans',sans-serif] font-semibold leading-[normal] text-sm sm:text-base md:text-lg text-white">
              Company
            </h3>
            <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
              {footerLinks.company.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="font-['Open_Sans',sans-serif] font-normal leading-[normal] text-xs sm:text-sm md:text-base text-white hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="flex flex-1 flex-col gap-3 md:gap-4 h-auto md:h-40 items-start w-full md:min-w-px relative shrink-0">
            <h3 className="font-['Arial',sans-serif] font-semibold leading-[normal] text-sm sm:text-base md:text-lg text-white">
              Support
            </h3>
            <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
              {footerLinks.support.map((link, i) => (
                <a
                  key={i}
                  href="#"
                  className="font-['Open_Sans',sans-serif] font-normal leading-[normal] text-xs sm:text-sm md:text-base text-white hover:text-blue-400 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row h-auto md:h-auto items-start md:items-center justify-start md:justify-between pt-4 md:pt-6 border-t border-gray-800 relative shrink-0 w-full">
          <p className="font-['Arial',sans-serif] leading-[24px] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-white">
            © 2025 SiteBuilt. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

