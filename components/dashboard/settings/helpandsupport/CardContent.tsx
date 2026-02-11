export default function HelpAndSupportCardContent() {
  return (
    <div className="flex flex-col gap-3 pb-7.5 text-[#1f2937] font-roboto font-medium text-sm">
      <button className="bg-[#f9faf8] rounded-lg border-2 border-black/10 cursor-pointer py-2.5">
        View Documentation
      </button>
      <button className="bg-[#f9faf8] rounded-lg border-2 border-black/10 cursor-pointer py-2.5">
        Contact Support
      </button>
      <button className="bg-[#f9faf8] rounded-lg border-2 border-black/10 cursor-pointer py-2.5">
        Report an Issue
      </button>
    </div>
  );
}
