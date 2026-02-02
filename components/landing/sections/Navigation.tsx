"use client";

import Link from "next/link";
import { LayoutGrid, VideoIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "../shared/Logo";
import { NavLink } from "../shared/NavLink";
import { ArrowIcon } from "../shared/ArrowIcon";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px", // Triggers when section is near top but allows scrolling adjustment
        threshold: 0,
      },
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <nav className="bg-gray-50 border-b-[1.25px] border-gray-100 border-l-0 border-r-0 border-solid border-t-0 box-border flex flex-col min-h-[65px] items-start pb-[1.25px] pt-0 px-4 md:px-8 lg:px-12 xl:px-[120px] sticky top-0 w-full z-50">
      <div className="flex min-h-[63.984px] items-center justify-between relative shrink-0 w-full py-[33.5px]">
        <div className="relative shrink-0 flex items-center lg:flex-[1_0_0] lg:min-h-px lg:min-w-px">
          <a href="#hero">
            <Logo className="flex items-center" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex h-[24px] relative shrink-0">
          <div className="flex gap-3 md:gap-4 lg:gap-5 xl:gap-6 h-[24px] items-center justify-center relative">
            <NavLink
              link="Features"
              href="#corefeatures"
              isActive={activeSection === "corefeatures"}
              className="cursor-pointer relative shrink-0"
            />
            <NavLink
              link="Benefits"
              href="#benefits"
              isActive={activeSection === "benefits"}
              className="relative shrink-0"
            />
            <NavLink
              link="Pricing"
              href="#pricing"
              isActive={activeSection === "pricing"}
              className="cursor-pointer relative shrink-0"
            />
            <NavLink
              link="Contact"
              href="#cta"
              isActive={activeSection === "cta"}
              className="relative shrink-0"
            />
          </div>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex flex-[1_0_0] h-[35.996px] min-h-px min-w-px relative shrink-0 py-">
          <div className="flex gap-1 md:gap-1 lg:gap-2 xl:gap-4 h-[35.996px] items-center justify-end relative w-auto lg:w-full py-4">
            <Link
              href="/signup"
              className="group bg-blue-600 box-border flex gap-2 h-[61px] items-center justify-center px-5 py-2.5 relative rounded-4xl shrink-0 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
            >
              <div className="font-['Inter',sans-serif] font-semibold leading-[normal] ml-[9px] not-italic relative shrink-0 text-sm md:text-base text-white">
                Get Started
              </div>
              <ArrowIcon
                className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all mr-[9px]"
                size={24}
              />
            </Link>
            <Link
              href="/login"
              className="group border border-blue-600 border-solid box-border flex gap-2 h-[61px] items-center justify-center px-5 py-2.5 relative rounded-4xl shrink-0 transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
            >
              <div className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-blue-600 group-hover:text-blue-700 transition-colors">
                See Demo
              </div>
              <VideoIcon
                className="relative shrink-0 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                size={24}
              />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-blue-600"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full pb-4 pt-2 flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <NavLink
              link="Features"
              href="#corefeatures"
              isActive={activeSection === "corefeatures"}
              className="cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavLink
              link="Benefits"
              href="#benefits"
              isActive={activeSection === "benefits"}
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavLink
              link="Pricing"
              href="#pricing"
              isActive={activeSection === "pricing"}
              className="cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavLink
              link="Contact"
              href="#cta"
              isActive={activeSection === "cta"}
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/signup"
              className="group bg-blue-600 h-[39px] relative rounded-[30px] transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
            >
              <div className="flex gap-2 h-[39px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-white">
                  Get Started
                </span>
                <ArrowIcon
                  className="relative shrink-0 text-white group-hover:translate-x-0.5 transition-all"
                  size={16}
                />
              </div>
            </Link>
            <Link
              href="/login"
              className="group border border-blue-600 border-solid h-[39px] relative rounded-[30px] transition-all duration-200 hover:bg-blue-50 hover:border-blue-700"
            >
              <div className="flex gap-2 h-[39px] items-center justify-center px-5 py-[10px] relative">
                <span className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[16px] text-blue-600 group-hover:text-blue-700 transition-colors">
                  See Demo
                </span>
                <VideoIcon
                  className="relative shrink-0 text-blue-600 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all"
                  size={18}
                />
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
