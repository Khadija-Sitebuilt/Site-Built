"use client";

import { useState } from "react";
import { Navigation } from "@/components/landing/sections/Navigation";
import { Hero } from "@/components/landing/sections/Hero";
import { CoreFeatures } from "@/components/landing/sections/CoreFeatures";
import { Benefits } from "@/components/landing/sections/Benefits";
import { Pricing } from "@/components/landing/sections/Pricing";
import { TrustBar } from "@/components/landing/sections/TrustBar";
import { Testimonials } from "@/components/landing/sections/Testimonials";
import { FAQ } from "@/components/landing/sections/FAQ";
import { CTA } from "@/components/landing/sections/CTA";
import { Footer } from "@/components/landing/sections/Footer";
import { DemoModal } from "../components/landing/shared/DemoModal";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="bg-white relative shadow-[0px_4px_28.3px_52px_rgba(48,7,253,0.05)] min-h-screen">
      <Navigation onOpenDemo={() => setDemoOpen(true)} />
      <Hero onOpenDemo={() => setDemoOpen(true)} />
      <CoreFeatures />
      <Benefits />
      <Pricing />
      <TrustBar />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
