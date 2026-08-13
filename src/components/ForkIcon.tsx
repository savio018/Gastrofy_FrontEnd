import type { SVGProps } from 'react';

export function ForkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 3v5M9 3v5M12 3v5" />
      <path d="M6 8c0 2 1.5 3 3 3s3-1 3-3" />
      <path d="M9 11v10" />
    </svg>
  );
}
