import cn from "@/lib/utils";
import { Search } from "lucide-react";

export default function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder,
  className,
}: {
  searchQuery: string;
  onSearchChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className="flex-1 max-w-lg hidden md:block">
      <div className="relative text-black">
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className={cn(
            `w-full pl-14 pr-4 py-6 rounded-[1.75rem] bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-4.75`,
            className,
          )}
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-4" />
      </div>
    </div>
  );
}
