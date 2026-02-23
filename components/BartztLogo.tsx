import { forwardRef } from "react";

interface BartztLogoProps {
  className?: string;
  size?: number;
  variant?: "compact" | "full";
}

export const BartztLogo = forwardRef<SVGSVGElement, BartztLogoProps>(
  ({ className = "", size = 24, variant = "full" }, ref) => {
    // Para versão compacta (mobile), usamos um design mais simplificado
    if (variant === "compact") {
      return (
        <svg
          ref={ref}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-all duration-300 ${className}`}
        >
          {/* Base structure mais simplificada para mobile */}
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            opacity="0.9"
          />
          
          {/* Vertical divider central */}
          <line
            x1="12"
            y1="5"
            x2="12"
            y2="19"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
          />
          
          {/* Stylized "B" mais bold para mobile */}
          <path
            d="M6 8V16M6 8H9C9.8 8 10.5 8.7 10.5 9.5C10.5 10.3 9.8 11 9 11H6M6 11H9.5C10.3 11 11 11.7 11 12.5C11 13.3 10.3 14 9.5 14H6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Handle direito */}
          <circle
            cx="17"
            cy="12"
            r="1"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
      );
    }

    // Versão completa (desktop)
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-300 ${className}`}
      >
        {/* Base structure representing modular furniture framework */}
        <rect
          x="2"
          y="5"
          width="28"
          height="22"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.85"
        />
        
        {/* Vertical dividers representing cabinet sections */}
        <line
          x1="11"
          y1="5"
          x2="11"
          y2="27"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="21"
          y1="5"
          x2="21"
          y2="27"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.6"
        />
        
        {/* Horizontal shelf representing organization */}
        <line
          x1="2"
          y1="16"
          x2="30"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.5"
        />
        
        {/* Stylized "B" for Bartz - integrated with furniture design */}
        <path
          d="M5 9V23M5 9H9.5C10.6 9 11.5 9.9 11.5 11C11.5 12.1 10.6 13 9.5 13H5M5 13H10C11.1 13 12 13.9 12 15C12 16.1 11.1 17 10 17H5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Drawer handles representing functionality */}
        <circle
          cx="15"
          cy="11"
          r="0.8"
          fill="currentColor"
          opacity="0.75"
        />
        <circle
          cx="25"
          cy="11"
          r="0.8"
          fill="currentColor"
          opacity="0.75"
        />
        <circle
          cx="15"
          cy="21"
          r="0.8"
          fill="currentColor"
          opacity="0.75"
        />
        <circle
          cx="25"
          cy="21"
          r="0.8"
          fill="currentColor"
          opacity="0.75"
        />
        
        {/* Corner detail representing precision and craftsmanship */}
        <path
          d="M2 7L4 5M30 7L28 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Bottom accent representing foundation/base */}
        <rect
          x="1"
          y="26"
          width="30"
          height="2"
          rx="1"
          fill="currentColor"
          opacity="0.5"
        />
        
        {/* Additional detail - small mounting holes */}
        <circle
          cx="7"
          cy="11"
          r="0.4"
          fill="currentColor"
          opacity="0.4"
        />
        <circle
          cx="7"
          cy="21"
          r="0.4"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
    );
  }
);

BartztLogo.displayName = "BartztLogo";
