import cn from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { ChangeEvent } from "react";

export default function DataOperation({
  value,
  options,
  onChange,
  className,
}: {
  value: string;
  options: string[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) {
  return (
    <div className="flex relative items-center">
      <select
        value={value}
        onChange={onChange}
        className={cn(
          "appearance-none font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent cursor-pointer font-['Open_Sans',sans-serif] leading-5.5 bg-gray-100 p-3 w-32 rounded-[1.25rem]",
          className,
        )}
      >
        {options.map((value, index) => {
          return (
            <option
              key={value}
              className={`${index === 0 ? "pt-4 pb-1" : index === options.length - 1 ? "pt-1 pb-2" : "py-1"} bg-white`}
            >
              {value}
            </option>
          );
        })}
      </select>
      <ChevronDown className="right-3 absolute w-4 h-4 text-[#717182] pointer-events-none" />
    </div>
  );
}
