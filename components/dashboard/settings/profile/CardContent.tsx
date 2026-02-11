import Image from "next/image";
import Form from "./Form";

export default function ProfileCardContent() {
  return (
    <div className="flex flex-col gap-y-6 pb-2">
      {/* Profile Photo */}
      <div className="flex items-center gap-x-3.5">
        <Image
          width={80}
          height={80}
          alt="profile-photo"
          src="/images/dashboard/settings/profile.jpg"
          className="size-20 rounded-full"
        />

        <div className="flex flex-col justify-center items-start gap-y-2">
          <button className="border-2 border-black/10 rounded-lg text-[#1f2937] text-sm font-roboto font-medium px-4.25 py-2">
            Change Photo
          </button>
          <span className="text-sm text-[#6b7280] font-roboto">
            JPG, PNG or GIF. Max size 2MB
          </span>
        </div>
      </div>

      <div className="h-px bg-black/10" />

      <Form />
    </div>
  );
}
