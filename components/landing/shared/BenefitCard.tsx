import { LucideIcon } from "lucide-react";

type BenefitCardProps = {
  icon?: boolean;
  title: string;
  description: string;
  IconComponent?: LucideIcon;
  descriptionFont?: "Open_Sans" | "Arial";
};

export function BenefitCard({
  icon = true,
  title,
  description,
  IconComponent,
  descriptionFont = "Open_Sans"
}: BenefitCardProps) {
  const titleLines = title.split('\n');

  return (
    <div className="bg-gray-50 border-[1.25px] border-gray-50 border-solid box-border flex flex-[1_0_0] flex-col gap-[16px] h-auto min-h-[235px] md:min-h-[250px] lg:min-h-[260px] items-start min-w-px p-[20px] relative rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] shrink-0">
      {icon && IconComponent && (
        <div className="bg-blue-50 box-border flex items-center justify-center pl-0 pr-[0.02px] py-0 relative rounded-[10px] shrink-0 size-[47.988px]">
          <IconComponent className="text-blue-600" size={24} />
        </div>
      )}
      <div className="font-['Inter',sans-serif] font-semibold leading-[normal] min-w-full not-italic relative shrink-0 text-lg sm:text-xl md:text-2xl text-neutral-950 tracking-[-0.48px] w-[min-content] whitespace-pre-wrap">
        {titleLines.map((line, index) => (
          <p key={index} className={index === 0 ? "mb-0" : ""}>{line}</p>
        ))}
      </div>
      <p
        className={`font-['${descriptionFont}',sans-serif] ${descriptionFont === "Arial" ? "leading-[24px] not-italic" : "font-normal leading-[normal]"} min-w-full relative shrink-0 text-xs sm:text-sm md:text-base text-slate-600 w-[min-content] whitespace-pre-wrap`}
        style={descriptionFont === "Open_Sans" ? { fontVariationSettings: '"wdth" 100' } : undefined}
      >
        {description}
      </p>
    </div>
  );
}
