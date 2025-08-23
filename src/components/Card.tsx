import Image from 'next/image';
import Link from 'next/link';

export interface CardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  price?: number | string;
  badge?: { text: string } | null;
  meta?: string;
  href?: string;
  className?: string;
}

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt = '',
  price,
  badge,
  meta,
  href,
  className = '',
}: CardProps) {
  const content = (
    <>
      <div className="relative bg-light-200">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            width={800}
            height={600}
            className="h-60 w-full object-contain sm:h-72"
            priority={false}
          />
        ) : (
          <div className="h-60 w-full sm:h-72 flex items-center justify-center text-dark-500">No image</div>
        )}

        {badge?.text ? (
          <span className="absolute left-3 top-3 rounded-full bg-light-100 px-3 py-1 text-footnote text-green shadow">
            {badge.text}
          </span>
        ) : null}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-heading-3 text-dark-900 line-clamp-2">{title}</h3>
          {price !== undefined && (
            <span className="shrink-0 text-body-medium text-dark-900">
              {typeof price === 'number' ? `$${price}` : price}
            </span>
          )}
        </div>

        {meta && <p className="mt-1 text-caption text-dark-700">{meta}</p>}
        {description && <p className="mt-2 text-body text-dark-700 line-clamp-2">{description}</p>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`group block overflow-hidden rounded-xl bg-light-100 shadow-sm ring-1 ring-light-300 hover:shadow-md transition ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`group block overflow-hidden rounded-xl bg-light-100 shadow-sm ring-1 ring-light-300 hover:shadow-md transition ${className}`}
    >
      {content}
    </div>
  );
}
