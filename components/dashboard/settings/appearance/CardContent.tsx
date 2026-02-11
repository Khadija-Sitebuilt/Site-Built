import ToggleSwitch from "../ToggleSwitch";

export default function AppearanceCardContent() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <span className="text-[#1f2937] text-sm font-roboto leading-5.25 font-medium">
          Dark Mode
        </span>
        <p className="text-[#6b7280] text-[0.8125rem] leading-5">
          Switch to dark theme for better visibility in low light
        </p>
      </div>

      <ToggleSwitch />
    </div>
  );
}
