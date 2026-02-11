import { ReactNode } from "react";

interface SettingsCardProps {
  icon: ReactNode;
  header: string;
  description: string;
  children: ReactNode;
}

export default function SettingsCard({
  icon,
  header,
  description,
  children,
}: SettingsCardProps) {
  return (
    <div className="flex flex-col gap-6.25 rounded-[0.875rem] bg-white p-5">
      <div className="gap-y-1.5">
        <h1 className="flex gap-x-2 text-[#1F2937] font-semibold text-xl items-center py-px">
          {/* <CircleUserRoundIcon size={22} /> */}
          {icon}
          {/* Profile Information */}
          {header}
        </h1>
        <p className="text-[#6b7280] leading-5.25 font-roboto text-sm">
          {/* Update your personal details */}
          {description}
        </p>
      </div>

      {/* Card Content */}
      {children}
    </div>
  );
}
