import ToggleSwitch from "../ToggleSwitch";

export default function NotificationCardContent() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[#1f2937] font-roboto font-medium text-sm leading-5.25">
            Push Notifications
          </h2>
          <p className="text-[#6b7280] font-roboto text-[0.8125rem] leading-5">
            Receive notifications on your device
          </p>
        </div>
        <ToggleSwitch />
      </div>
      <div className="h-px w-full bg-black/10" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[#1f2937] font-roboto font-medium text-sm leading-5.25">
            Email Notifications
          </h2>
          <p className="text-[#6b7280] font-roboto text-[0.8125rem] leading-5">
            Get notified via email for important updates
          </p>
        </div>
        <ToggleSwitch />
      </div>
      <div className="h-px w-full bg-black/10" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[#1f2937] font-roboto font-medium text-sm leading-5.25">
            SMS Notifications
          </h2>
          <p className="text-[#6b7280] font-roboto text-[0.8125rem] leading-5">
            Receive text messages for urgent items
          </p>
        </div>
        <ToggleSwitch />
      </div>
      <div className="h-px w-full bg-black/10" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[#1f2937] font-roboto font-medium text-sm leading-5.25">
            Upload Reminders
          </h2>
          <p className="text-[#6b7280] font-roboto text-[0.8125rem] leading-5">
            Get reminders for pending uploads
          </p>
        </div>
        <ToggleSwitch />
      </div>
    </div>
  );
}
