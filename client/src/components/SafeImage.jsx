import {
  useState,
} from "react";


export default function SafeImage({
  src,
  alt,
  className = "",
  fallbackLabel = "Image unavailable",
  loading = "lazy",
}) {
  const [failedSrc, setFailedSrc] =
    useState("");

  if (!src || failedSrc === src) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 px-4 text-center text-sm font-medium text-slate-500 ${className}`}
        role="img"
        aria-label={alt || fallbackLabel}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() =>
        setFailedSrc(src)
      }
    />
  );
}
