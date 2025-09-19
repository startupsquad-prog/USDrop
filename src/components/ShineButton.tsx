import React from "react";

// Props type for ShineButton
interface ShineButtonProps {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

// ShineButton component
const ShineButton: React.FC<ShineButtonProps> = ({
  onClick,
  href,
  children,
  className = "",
}) => {
  return (
    <>
      {/* Inline style tag for the shine animation */}
      <style>
        {`
          @keyframes shine {
            0% { left: -75%; }
            100% { left: 125%; }
          }

          .btn-shine::before {
            content: "";
            position: absolute;
            top: 0;
            left: -75%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.6) 50%,
              rgba(255, 255, 255, 0.2) 100%
            );
            transform: skewX(-25deg);
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
          }

          .btn-shine:hover::before {
            animation: shine 1.2s forwards;
            opacity: 1;
          }
        `}
      </style>

      {href ? (
        <a
          href={href}
          className={`relative group flex items-center justify-center px-4 py-2 text-sm rounded-full bg-[#0052D4] text-white font-semibold shadow-md overflow-hidden transition-all duration-300 btn-shine ${className}`}
        >
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#0052D4] to-[#4364F7] z-0"></div>
        </a>
      ) : (
        <button
          onClick={onClick}
          className={`relative group flex items-center justify-center px-4 py-2 text-sm rounded-full bg-[#0052D4] text-white font-semibold shadow-md overflow-hidden transition-all duration-300 btn-shine ${className}`}
        >
          <span className="relative z-10">{children}</span>
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[#0052D4] to-[#4364F7] z-0"></div>
        </button>
      )}
    </>
  );
};

export default ShineButton;
