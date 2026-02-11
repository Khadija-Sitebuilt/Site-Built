import { useState } from "react";

export default function ToggleSwitch() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <label className="relative w-8.5 h-5">
      <input
        type="checkbox"
        className="w-0 h-0 opacity-0 checked:[&+span]:bg-blue-600 checked:[&+span]:before:translate-x-3.5"
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <span className="absolute cursor-pointer inset-0 bg-[#cbced4] duration-400 before:duration-400 before:absolute before:content-[''] before:w-4 before:h-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full rounded-full" />
    </label>
  );
}
