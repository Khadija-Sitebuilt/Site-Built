import { images } from "../assets";

type IconProps = {
  className?: string;
  type?: "Arrow - Right" | "Shield Done" | "Time Square" | "Upload" | "Video";
};

export function Icon({ className, type = "Video" }: IconProps) {
  const isArrowRight = type === "Arrow - Right";
  const isVideo = type === "Video";
  
  return (
    <div className={className}>
      {isVideo && (
        <div className="absolute inset-[20.83%_4.86%_14.58%_8.33%]">
          <img className="block max-w-none size-full" alt="" src={images.videoIcon} />
        </div>
      )}
      {isArrowRight && (
        <div className="absolute flex inset-[20.63%_14.58%_22.92%_16.67%] items-center justify-center">
          <div className="flex-none h-[16.5px] rotate-[270deg] w-[13.549px]">
            <div className="relative size-full">
              <img className="block max-w-none size-full" alt="" src={images.arrowRight} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

