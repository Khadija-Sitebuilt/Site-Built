import Link from "next/link";
import { Logo } from "../shared/Logo";
import { NavLink } from "../shared/NavLink";
import { ArrowIcon } from "../shared/ArrowIcon";

export function Navigation() {
  return (
    <nav className="bg-gray-50 border-b-[1.25px] border-gray-100 border-l-0 border-r-0 border-solid border-t-0 box-border flex flex-col h-[65px] items-start pb-[1.25px] pt-0 px-[120px] sticky top-0 w-full z-50">
      <div className="flex h-[63.984px] items-center justify-between relative shrink-0 w-full">
        <div className="flex-[1_0_0] min-h-px min-w-px relative shrink-0 flex items-center">
          <Logo className="flex items-center" />
        </div>
        <div className="h-[24px] relative shrink-0 w-[469px]">
          <div className="flex gap-8 h-[24px] items-center justify-center relative w-[469px]">
            <NavLink link="How it Works" className="cursor-pointer relative shrink-0" />
            <NavLink link="Benefit" className="relative shrink-0" />
            <NavLink link="Pricing" className="cursor-pointer relative shrink-0" />
            <NavLink link="Contact" className="relative shrink-0" />
            <NavLink link="FAQ" className="relative shrink-0" />
          </div>
        </div>
        <div className="flex-[1_0_0] h-[35.996px] min-h-px min-w-px relative shrink-0">
          <div className="flex gap-4 h-[35.996px] items-center justify-end relative w-full">
            <Link
              href="/login"
              className="group border border-blue-600 border-solid h-[39px] relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
            >
              <div className="flex gap-2 h-[39px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-blue-600 group-hover:text-blue-700 transition-colors">
                  Sign in
                </span>
                <ArrowIcon className="relative shrink-0 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" size={16} />
              </div>
            </Link>
            <Link
              href="/signup"
              className="group bg-blue-600 h-[39px] relative rounded-[30px] shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
            >
              <div className="flex gap-2 h-[39px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white">
                  Get Started
                </span>
                <ArrowIcon className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all" size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

