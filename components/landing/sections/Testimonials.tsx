
"use client";

import { useEffect, useState } from "react";
import { Star, User2 } from "lucide-react";

const testimonials = [
  {
    quote: "SiteBuilt reduced our reporting time by 40% and eliminated the confusion around photo documentation. Game changer for our team.",
    name: "Sarah Mitchell",
    role: "Construction Lead, Lagos Metro",
  },
  {
    quote: "The site pin feature is brilliant. No more guessing where issues occurred. Everything is precisely documented and easy to find.",
    name: "Mike Rodriguez",
    role: "Site Engineer, BuildCorp",
  },
  {
    quote: "We finally have a single source of truth for site photos and markups. Our coordination meetings are twice as effective now.",
    name: "Daniel Kim",
    role: "Project Manager, Skyline Builders",
  },
  {
    quote: "The floor plan pins make it incredibly easy to walk owners through issues. It’s become a core part of our handover process.",
    name: "Priya Singh",
    role: "Owner’s Rep, UrbanCore",
  },
  {
    quote: "Setup took less than a day and our field teams adopted it immediately. Zero training, huge impact.",
    name: "Luis Hernandez",
    role: "Field Supervisor, Apex Construction",
  },
  {
    quote: "SiteBuilt gives us audit-ready documentation without extra work from the team. It’s a no-brainer for compliance.",
    name: "Emma Johnson",
    role: "Quality Manager, NorthBridge Infra",
  },
  {
    quote: "Before SiteBuilt, tracking photo history across phases was a nightmare. Now it’s just a few clicks.",
    name: "Tom Baker",
    role: "VDC Lead, Meridian Projects",
  },
  {
    quote: "Our subcontractors love how easy it is to see exactly where issues are on the plans. It cuts out so many back-and-forth emails.",
    name: "Akira Tanaka",
    role: "Construction Director, HarborWorks",
  },
];

export function Testimonials() {
  const pageSize = 2;
  const totalPages = Math.ceil(testimonials.length / pageSize);
  const [page, setPage] = useState(0);

  // Auto-rotate testimonials pages
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 6000); // 6 seconds per page

    return () => clearInterval(interval);
  }, [totalPages]);

  const visibleTestimonials = testimonials.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <section className="bg-gray-50 box-border flex flex-col gap-20 items-center left-0 px-[120px] py-[112px] w-full">
      <div className="flex flex-col gap-6 items-start relative shrink-0 w-full">
        <div className="box-border flex gap-[10px] items-center justify-center px-[437px] py-0 relative shrink-0 w-full">
          <div className="font-['Inter',sans-serif] font-bold leading-[0] not-italic relative shrink-0 text-[0px] text-center text-neutral-950 tracking-[-0.96px] whitespace-nowrap">
            <p className="leading-[normal] mb-0 text-[48px]">Trusted by </p>
            <p className="leading-[normal] text-[48px]">
              <span className="font-['Inter',sans-serif] font-normal italic text-green-600 tracking-[-0.96px]">Industry</span>
              <span> Leaders</span>
            </p>
          </div>
        </div>
        <div className="flex items-start relative shrink-0 w-full">
          <div className="flex-[1_0_0] font-['Arial',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[#717182] text-[20px] text-center whitespace-pre-wrap">
            <p className="mb-0">Join thousands of construction </p>
            <p>professionals who rely on SiteBuilt</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8 items-start relative shrink-0 w-full">
        <div className="flex flex-col gap-[10px] items-center relative shrink-0 w-full">
          <div className="flex gap-12 items-center relative shrink-0 w-full">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border-[1.333px] border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-[1_0_0] flex-col items-start justify-between min-h-[260px] min-w-px p-[33.333px] relative rounded-[14px] shrink-0"
              >
                <div className="relative shrink-0 w-full">
                  <div className="flex flex-col gap-4 items-start px-6 py-0 relative w-full">
                    <div className="flex gap-1 items-center relative shrink-0 w-full">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="relative shrink-0 size-5">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-[10px] items-center justify-center relative shrink-0 w-full">
                      <p className="flex-[1_0_0] font-['Arial',sans-serif] leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[18px] text-neutral-950 whitespace-pre-wrap">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="flex gap-4 h-12 items-center relative shrink-0 w-full">
                      <div className="bg-[#ececf0] relative rounded-full shrink-0 size-12 flex items-center justify-center">
                        <User2 className="w-6 h-6 text-slate-700" />
                      </div>
                      <div className="h-11 relative shrink-0 w-[196.625px]">
                        <div className="flex flex-col h-11 items-start relative w-[196.625px]">
                          <div className="h-6 relative shrink-0 w-full">
                            <p className="absolute font-['Arial',sans-serif] leading-[24px] left-0 not-italic text-[16px] text-neutral-950 top-[-1.67px]">
                              {testimonial.name}
                            </p>
                          </div>
                          <div className="flex h-5 items-start relative shrink-0 w-full">
                            <p className="font-['Arial',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#717182] text-[14px]">
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
            aria-label={`Show testimonials ${i * pageSize + 1} to ${
              Math.min((i + 1) * pageSize, testimonials.length)
            }`}
          />
        ))}
      </div>
    </section>
  );
}

