"use client";

import { useEffect, useState } from "react";
import { Star, User2 } from "lucide-react";
import { images } from "../assets";

const testimonials = [
  {
    quote:
      "SiteBuilt reduced our reporting time by 40% and eliminated the confusion around photo documentation. Game changer for our team.",
    name: "Sarah Mitchell",
    role: "Construction Lead, Lagos Metro",
  },
  {
    quote:
      "The site pin feature is brilliant. No more guessing where issues occurred. Everything is precisely documented and easy to find.",
    name: "Mike Rodriguez",
    role: "Site Engineer, BuildCorp",
  },
  {
    quote:
      "We finally have a single source of truth for site photos and markups. Our coordination meetings are twice as effective now.",
    name: "Daniel Kim",
    role: "Project Manager, Skyline Builders",
  },
  {
    quote:
      "The floor plan pins make it incredibly easy to walk owners through issues. It's become a core part of our handover process.",
    name: "Priya Singh",
    role: "Owner's Rep, UrbanCore",
  },
  {
    quote:
      "Setup took less than a day and our field teams adopted it immediately. Zero training, huge impact.",
    name: "Luis Hernandez",
    role: "Field Supervisor, Apex Construction",
  },
  {
    quote:
      "SiteBuilt gives us audit-ready documentation without extra work from the team. It's a no-brainer for compliance.",
    name: "Emma Johnson",
    role: "Quality Manager, NorthBridge Infra",
  },
  {
    quote:
      "Before SiteBuilt, tracking photo history across phases was a nightmare. Now it's just a few clicks.",
    name: "Tom Baker",
    role: "VDC Lead, Meridian Projects",
  },
  {
    quote:
      "Our subcontractors love how easy it is to see exactly where issues are on the plans. It cuts out so many back-and-forth emails.",
    name: "Akira Tanaka",
    role: "Construction Director, HarborWorks",
  },
];

export function Testimonials() {
  const pageSize = 2;
  const totalPages = Math.ceil(testimonials.length / pageSize);
  const [page, setPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate testimonials pages
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 3000); // 3 seconds per page

    return () => clearInterval(interval);
  }, [totalPages, isPaused]);

  const visibleTestimonials = testimonials.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  return (
    <section
      className="box-border flex flex-col gap-10 md:gap-16 lg:gap-20 items-center left-0 px-4 sm:px-8 md:px-12 lg:px-12 xl:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] w-full relative"
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
      <div className="flex flex-col gap-4 md:gap-6 items-start relative shrink-0 w-full max-w-[1280px] mx-auto">
        <div className="box-border flex gap-[10px] items-center justify-center px-4 sm:px-0 py-0 relative shrink-0 w-full">
          <h2 className="font-['Inter',sans-serif] font-bold leading-[1.2] not-italic relative shrink-0 text-center text-neutral-950 tracking-[-0.96px]">
            <span className="block text-3xl sm:text-4xl">Trusted by</span>
            <span className="block text-3xl sm:text-4xl">
              <span className="font-['Inter',sans-serif] not-italic text-green-600 tracking-[-0.96px]">
                Industry
              </span>
              <span> Leaders</span>
            </span>
          </h2>
        </div>
        <div className="flex items-start relative shrink-0 w-full">
          <div className="flex-[1_0_0] font-['Arial',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-base md:text-lg lg:text-xl text-center whitespace-pre-wrap">
            <p className="mb-0">Join thousands of construction </p>
            <p>professionals who rely on SiteSync</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 md:gap-8 items-start relative shrink-0 w-full max-w-[1280px] mx-auto">
        <div
          className="flex flex-col gap-[10px] items-center relative shrink-0 w-full"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-stretch relative shrink-0 w-full">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border-[1.333px] border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col md:flex-[1_0_0] items-start justify-between min-h-[320px] p-6 md:p-8 lg:p-[33.333px] relative rounded-[14px] shrink-0 w-full"
              >
                <div className="relative shrink-0 w-full">
                  <div className="flex flex-col gap-3 md:gap-4 items-start px-4 md:px-6 py-0 relative w-full">
                    <div className="flex gap-1 items-center relative shrink-0 w-full">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="relative shrink-0 size-4 md:size-5"
                        >
                          <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-['Arial',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-sm md:text-base lg:text-lg text-neutral-950 whitespace-pre-wrap">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex gap-3 md:gap-4 h-10 md:h-12 items-center relative shrink-0 w-full">
                      <div className="bg-[#ececf0] relative rounded-full shrink-0 size-10 md:size-12 flex items-center justify-center">
                        <User2 className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
                      </div>
                      <div className="h-auto md:h-11 relative shrink-0 flex-1">
                        <div className="flex flex-col h-auto md:h-11 items-start relative">
                          <div className="h-auto md:h-6 relative shrink-0 w-full">
                            <p className="font-['Arial',sans-serif] leading-[24px] not-italic text-sm md:text-base text-neutral-950">
                              {testimonial.name}
                            </p>
                          </div>
                          <div className="flex h-auto md:h-5 items-start relative shrink-0 w-full">
                            <p className="font-['Arial',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-xs md:text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 ">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPage(i)}
            className={`rounded-full transition-all duration-300 ease-out ${
              i === page
                ? "h-4 w-4 bg-[#16A34A] scale-100"
                : "h-2.5 w-2.5 bg-[#777777] scale-100"
            }`}
            aria-label={`Show testimonials ${i * pageSize + 1} to ${Math.min(
              (i + 1) * pageSize,
              testimonials.length,
            )}`}
          />
        ))}
      </div>
    </section>
  );
}
