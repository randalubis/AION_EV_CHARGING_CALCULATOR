interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  /** Rendered after the title in italic serif, the site's accent typography. */
  titleAccent?: string;
  subtitle?: string;
  align?: 'center' | 'left';
}

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center' : 'text-left';
  const subtitleWidth = align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl';

  return (
    <div className={`${alignment} mb-12 md:mb-16`}>
      <p className="text-[#FFC300] text-sm font-body uppercase tracking-widest mb-4">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white">
        {title}
        {titleAccent && (
          <span className="block font-serif italic font-normal text-white/80">{titleAccent}</span>
        )}
      </h2>
      {subtitle && <p className={`text-white/60 text-lg mt-6 ${subtitleWidth}`}>{subtitle}</p>}
    </div>
  );
}
