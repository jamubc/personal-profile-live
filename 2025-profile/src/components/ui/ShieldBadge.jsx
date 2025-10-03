export const ShieldBadge = ({
  href,
  src,
  alt,
  className = '',
}) => {
  const img = (
    <img
      src={src}
      alt={alt}
      className={`inline-block h-6 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {img}
      </a>
    );
  }

  return img;
};

