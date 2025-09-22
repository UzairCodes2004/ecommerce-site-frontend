// src/components/product/Rating.tsx
import React from "react";

interface RatingProps {
  value?: number;
  text?: string;
}

const Rating: React.FC<RatingProps> = ({ value = 0, text }) => {
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;

        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill={
              value >= starValue
                ? "currentColor" // full star
                : value >= starValue - 0.5
                ? "url(#half-gradient)" // half star
                : "none" // empty star
            }
            stroke="currentColor"
          >
            <defs>
              <linearGradient id="half-gradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.07 6.36h6.69c.97 0 1.372 1.24.588 1.81l-5.41 3.93 2.07 6.36c.3.922-.755 1.688-1.54 1.118l-5.41-3.93-5.41 3.93c-.784.57-1.838-.196-1.539-1.118l2.07-6.36-5.41-3.93c-.784-.57-.382-1.81.588-1.81h6.69l2.07-6.36z"
            />
          </svg>
        );
      })}
      <span className="text-gray-600 text-sm ml-2">
        {text || "No reviews yet"}
      </span>
    </div>
  );
};

export default Rating;