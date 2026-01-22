export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img
        src="/images/sitebuilt.svg"
        alt="SiteBuilt Logo"
        className="h-auto w-auto max-h-[40px]"
      />
    </div>
  );
}

