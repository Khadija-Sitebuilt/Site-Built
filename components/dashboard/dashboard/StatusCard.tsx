import cn from "@/lib/utils";
import { ReactNode } from "react";

function StatusCard({
  data,
  name,
  clasName,
  children,
}: {
  data: any[];
  name: string;
  clasName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex justify-between bg-white px-7.75 py-7 rounded-[1.75rem] border border-gray-200 drop-shadow-[0_20px_15px] drop-shadow-blue-600/20",
        clasName,
      )}
    >
      <div>
        <p className="text-4xl font-semibold font-inter text-gray-900 leading-11.25 mb-1">
          {data.length}
        </p>
        <p className="text-[1rem] font-['Open_Sans',sans-serif] text-gray-500 leading-5.5">
          {name}
        </p>
      </div>
      <div className="h-full aspect-square flex items-center justify-center rounded-full bg-[#f9fafb]">
        <div className="flex items-center justify-center w-12.75 h-12.75 rounded-full drop-shadow-2xl drop-shadow-blue-600/50 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
