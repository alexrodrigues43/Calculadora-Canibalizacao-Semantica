import React from 'react';

interface SemanticoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SemanticoLogo: React.FC<SemanticoLogoProps> = ({ className = '', size = 'md' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const badgeSizes = {
    sm: 'text-[7.5px] px-1.5 py-0.5',
    md: 'text-[8.5px] px-2 py-0.5',
    lg: 'text-[10px] px-2.5 py-0.5',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Network Node Logo with the golden-yellow top-left node */}
      <div className={`${iconSizes[size]} shrink-0 relative flex items-center justify-center`}>
        <svg viewBox="0 0 512 512" fill="none" className="w-full h-full drop-shadow-2xs">
          {/* Connector Spokes */}
          <line x1="240" y1="240" x2="80" y2="80" stroke="#0f172a" strokeWidth="26" strokeLinecap="round" />
          <line x1="240" y1="240" x2="375" y2="95" stroke="#0f172a" strokeWidth="26" strokeLinecap="round" />
          <line x1="240" y1="240" x2="110" y2="365" stroke="#0f172a" strokeWidth="26" strokeLinecap="round" />
          <line x1="240" y1="240" x2="240" y2="435" stroke="#0f172a" strokeWidth="26" strokeLinecap="round" />
          <line x1="240" y1="240" x2="435" y2="415" stroke="#0f172a" strokeWidth="26" strokeLinecap="round" />

          {/* Center White Node */}
          <circle cx="240" cy="240" r="62" fill="#ffffff" stroke="#0f172a" strokeWidth="26" />

          {/* Top-Left Gold/Yellow Node */}
          <circle cx="80" cy="80" r="44" fill="#FFA800" stroke="#0f172a" strokeWidth="26" />

          {/* Peripheral White Nodes */}
          <circle cx="375" cy="95" r="28" fill="#ffffff" stroke="#0f172a" strokeWidth="22" />
          <circle cx="110" cy="365" r="30" fill="#ffffff" stroke="#0f172a" strokeWidth="22" />
          <circle cx="240" cy="435" r="46" fill="#ffffff" stroke="#0f172a" strokeWidth="26" />
          <circle cx="435" cy="415" r="46" fill="#ffffff" stroke="#0f172a" strokeWidth="26" />
        </svg>
      </div>

      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center">
          <span className={`font-black tracking-tight text-slate-950 ${textSizes[size]}`}>
            Semântico
          </span>
        </div>
        <div className="flex items-center mt-1">
          <span
            style={{ backgroundColor: '#FED049' }}
            className={`font-black text-slate-950 rounded-full uppercase tracking-wider inline-block leading-none ${badgeSizes[size]}`}
          >
            SIGNIFICADO E SENTIDO
          </span>
        </div>
      </div>
    </div>
  );
};
