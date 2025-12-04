export function NavLink({ link, className }: { link: string; className?: string }) {
  return (
    <div className={className}>
      <p className="font-['Arial',sans-serif] leading-[24px] not-italic relative shrink-0 text-[16px] text-slate-600">
        {link}
      </p>
    </div>
  );
}

