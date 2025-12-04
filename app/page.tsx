import { Navigation } from "@/components/landing/sections/Navigation";
import { Hero } from "@/components/landing/sections/Hero";
import { HowItWorks } from "@/components/landing/sections/HowItWorks";
import { Benefits } from "@/components/landing/sections/Benefits";
import { Pricing } from "@/components/landing/sections/Pricing";
import { TrustBar } from "@/components/landing/sections/TrustBar";
import { Testimonials } from "@/components/landing/sections/Testimonials";
import { FAQ } from "@/components/landing/sections/FAQ";
import { Contact } from "@/components/landing/sections/Contact";
import { CTA } from "@/components/landing/sections/CTA";
import { Footer } from "@/components/landing/sections/Footer";

export default function Home() {
  return (
    <div className="bg-white relative shadow-[0px_4px_28.3px_52px_rgba(48,7,253,0.05)] min-h-screen">
      <Navigation />
      <Hero />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <TrustBar />
      <Testimonials />
      <Contact />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
