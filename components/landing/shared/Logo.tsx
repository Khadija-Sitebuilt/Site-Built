export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img 
        src="/images/landing/Logo.png" 
        alt="SiteBuilt Logo" 
        className="h-auto w-auto max-h-[40px]"
      />
    </div>
  );
}

