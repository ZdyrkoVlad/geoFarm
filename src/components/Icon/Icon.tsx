interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Renders an SVG icon from /public/icons/ using CSS mask-image.
 * This allows the icon to inherit `currentColor` for theming.
 */
export default function Icon({ name, size = 18, className = '' }: IconProps) {
  return (
    <span
      role="img"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: 'currentColor',
        maskImage: `url(/icons/${name}.svg)`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: `url(/icons/${name}.svg)`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}
