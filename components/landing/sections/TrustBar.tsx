export function TrustBar() {
  return (
    <section className="bg-blue-600 box-border flex items-center justify-center px-[120px] py-6 w-full">
      <div className="trustbar-marquee-container w-full max-w-[1280px]">
        <div className="trustbar-marquee">
          {/* First sequence of brands */}
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Arial',sans-serif] text-[18px] leading-[28px] tracking-wide">
            Logo
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Open_Sans',sans-serif] text-[18px] leading-[28px] font-semibold">
            Logo
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Baloo_Tammudu_2',sans-serif] text-[20px] leading-[28px] tracking-tight">
            MetroConstruct
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Catallina',cursive] text-[18px] leading-[28px] italic">
            SteelWorks
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Inter',sans-serif] text-[18px] leading-[28px] font-bold uppercase tracking-[0.12em]">
            UrbanDev
          </div>

          {/* Duplicate sequence for seamless marquee */}
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Arial',sans-serif] text-[18px] leading-[28px] tracking-wide">
            Logo
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Open_Sans',sans-serif] text-[18px] leading-[28px] font-semibold">
            Logo
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Baloo_Tammudu_2',sans-serif] text-[20px] leading-[28px] tracking-tight">
            MetroConstruct
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Catallina',cursive] text-[18px] leading-[28px] italic">
            SteelWorks
          </div>
          <div className="flex h-16 min-w-[33.3333%] items-center justify-center rounded-[10px] px-4 text-white font-['Inter',sans-serif] text-[18px] leading-[28px] font-bold uppercase tracking-[0.12em]">
            UrbanDev
          </div>
        </div>
      </div>
    </section>
  );
}