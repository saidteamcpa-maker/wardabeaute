export function LogoImage({
  imageSrc = "/logo.png",
  alt = "Warda Beauté",
  className = "w-full max-w-xs",
  containerClassName = "",
}: {
  imageSrc?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-brume card-hover ${containerClassName}`}
    >
      <img src={imageSrc} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </div>
  );
}
