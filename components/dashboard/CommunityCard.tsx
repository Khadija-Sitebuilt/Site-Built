import Image from "next/image";

function CommunityCard() {
  return (
    <div className="flex flex-col py-5.25 px-5 w-full rounded-3xl bg-[#f2f3f4]">
      <div className="flex mb-5">
        <div className="relative rounded-full size-7.5 bg-linear-[190deg,#fed136,#f7961f]">
          <Image
            height={100}
            width={100}
            src="/images/dashboard/community/Ellipse 317.jpg"
            alt="317"
            className="rounded-full border-2"
          />
        </div>
        <div className="relative rounded-full size-7.5 bg-linear-[190deg,#fed136,#f7961f] -left-1.5">
          <Image
            height={100}
            width={100}
            src="/images/dashboard/community/Ellipse 318.jpg"
            alt="318"
            className="rounded-full border-2"
          />
        </div>
        <div className="relative rounded-full size-7.5 bg-linear-[190deg,#fed136,#f7961f] -left-3">
          <Image
            height={100}
            width={100}
            src="/images/dashboard/community/Ellipse 319.jpg"
            alt="319"
            className="rounded-full border-2"
          />
        </div>
      </div>
      <div className="space-y-1 mb-3">
        <h1 className="text-[1.25rem] font-semibold font-outfit leading-5.25">
          SiteBuilt
          <br />
          Community
        </h1>
        <p className="text-[0.875rem] font-inter leading-5.25 text-[#5d6b82]">
          Join the community of
          <br />
          Engineers using Sitebuilt
        </p>
      </div>
      <button className="bg-linear-[191deg,#0088ff,#6155f5_100%] px-5 py-2 w-fit font-sans rounded-full text-white text-[0.875rem]">
        Join now
      </button>
    </div>
  );
}

export default CommunityCard;
