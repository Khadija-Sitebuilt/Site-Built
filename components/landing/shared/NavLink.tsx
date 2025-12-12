export function NavLink({ link, href, className, isActive }: { link: string; href?: string; className?: string; isActive?: boolean }) {
  return (
    <a href={href || "#"} className={className}>
      <p className={`font-['Arial',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-xs md:text-xs lg:text-sm xl:text-base transition-colors duration-200 cursor-pointer ${isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
        {link}
      </p>
    </a>
  );
}

