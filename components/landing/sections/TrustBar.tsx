export function TrustBar() {
  return (
    <section className="bg-blue-600 box-border flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-[120px] py-4 md:py-6 w-full">
      <div className="trustbar-marquee-container w-full max-w-[1280px]">
        <div className="trustbar-marquee">
          {/* First sequence of brands */}
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Arial',sans-serif] text-sm sm:text-base md:text-lg leading-[28px] tracking-wide">
            Logo
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Open_Sans',sans-serif] text-sm sm:text-base md:text-lg leading-[28px] font-semibold">
            Logo
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Baloo_Tammudu_2',sans-serif] text-base sm:text-lg md:text-xl leading-[28px] tracking-tight">
            MetroConstruct
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Catallina',cursive] text-sm sm:text-base md:text-lg leading-[28px] italic">
            SteelWorks
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Inter',sans-serif] text-sm sm:text-base md:text-lg leading-[28px] font-bold uppercase tracking-[0.12em]">
            UrbanDev
          </div>

          {/* Duplicate sequence for seamless marquee */}
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Arial',sans-serif] text-sm sm:text-base md:text-lg leading-[28px] tracking-wide">
            Logo
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Open_Sans',sans-serif] text-sm sm:text-base md:text-lg leading-[28px] font-semibold">
            Logo
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Baloo_Tammudu_2',sans-serif] text-base sm:text-lg md:text-xl leading-[28px] tracking-tight">
            MetroConstruct
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Catallina',cursive] text-sm sm:text-base md:text-lg leading-[28px] italic">
            SteelWorks
          </div>
          <div className="flex h-12 md:h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-3 md:px-4 text-white font-['Inter',sans-serif] text-sm sm:text-base md:text-lg leading-[28px] font-bold uppercase tracking-[0.12em]">
            UrbanDev
          </div>
        </div>
      </div>
    </section>
  );
}