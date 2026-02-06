import { MouseEvent } from "react";

function ChevronLeft({
  className,
  height = 24,
  width = 24,
  onClick,
}: {
  className?: string;
  height?: number;
  width?: number;
  onClick?: (e?: MouseEvent) => void;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
    >
      <g id="Iconly/Curved/Light/Arrow - Left 2">
        <g id="Arrow - Left 2">
          <path
            id="Stroke 1"
            d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}

export default ChevronLeft;
