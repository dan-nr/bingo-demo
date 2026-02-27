import type { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export function Card({ padding = true, className = '', ...props }: Props) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${padding ? 'p-6' : ''} ${className}`}
      {...props}
    />
  );
}
