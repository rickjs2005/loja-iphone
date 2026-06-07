import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Imagem do produto com fallback elegante quando não há foto cadastrada.
 */
export function ProductImage({
  url,
  alt,
  sizes,
  priority,
  className,
}: {
  url: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!url) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-surface to-bg",
          className,
        )}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted/40"
        >
          <rect x="7" y="2" width="10" height="20" rx="2" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
