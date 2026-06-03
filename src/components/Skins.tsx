import React from 'react';
import { Camera, Upload, Trash2, Eye, RefreshCw, FileText } from 'lucide-react';
import { compressBase64 } from '../utils/imageCompressor';

export interface MsuIitLogoProps {
  className?: string;
  imageSrc?: string | null;
  onImageChange?: (src: string) => void;
  editable?: boolean;
}

export const MsuIitLogo: React.FC<MsuIitLogoProps> = ({ 
  className = 'w-12 h-12',
  imageSrc,
  onImageChange,
  editable = true
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result && onImageChange) {
          onImageChange(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    if (editable && onImageChange) {
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const rotationAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  // Parallel lines configuration for the interlocking chevrons (Side 1, 2, 3)
  const lines = [
    // Side 1 (Top to Bottom-Right) - Down-Right direction
    { id: 's1-1', x1: 250 - 5, y1: 104 - 8.66, x2: 376 + 5, y2: 323 + 8.66 },
    { id: 's1-2', x1: 250 - 5 - 12.12, y1: 104 - 8.66 + 7, x2: 376 + 5 - 12.12, y2: 323 + 8.66 + 7 },
    { id: 's1-3', x1: 250 - 5 - 24.25, y1: 104 - 8.66 + 14, x2: 376 + 5 - 24.25, y2: 323 + 8.66 + 14 },

    // Side 2 (Bottom-Right to Bottom-Left) - Horizontal Left direction
    { id: 's2-1', x1: 376 + 10, y1: 323, x2: 124 - 10, y2: 323 },
    { id: 's2-2', x1: 376 + 10, y1: 323 - 14, x2: 124 - 10, y2: 323 - 14 },
    { id: 's2-3', x1: 376 + 10, y1: 323 - 28, x2: 124 - 10, y2: 323 - 28 },

    // Side 3 (Bottom-Left to Top) - Up-Right direction
    { id: 's3-1', x1: 124 - 5, y1: 323 + 8.66, x2: 250 + 5, y2: 104 - 8.66 },
    { id: 's3-2', x1: 124 - 5 + 12.12, y1: 323 + 8.66 + 7, x2: 250 + 5 + 12.12, y2: 104 - 8.66 + 7 },
    { id: 's3-3', x1: 124 - 5 + 24.25, y1: 323 + 8.66 + 14, x2: 250 + 5 + 24.25, y2: 104 - 8.66 + 14 },
  ];

  // Side 2 bottom-left segments to overlay on top of Side 3 for a perfect interlocking triquetra weave
  const side2Overlay = [
    { id: 'ov-1', x1: 155, y1: 323, x2: 114, y2: 323 },
    { id: 'ov-2', x1: 155, y1: 323 - 14, x2: 114, y2: 323 - 14 },
    { id: 'ov-3', x1: 155, y1: 323 - 28, x2: 114, y2: 323 - 28 }
  ];

  return (
    <div 
      className={`relative ${className} shrink-0 group rounded-full overflow-hidden select-none cursor-pointer flex items-center justify-center`}
      onClick={triggerUpload}
      title={editable && onImageChange ? "Click to change university logo / photo" : ""}
    >
      {editable && onImageChange && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}

      {imageSrc ? (
        <img 
          src={imageSrc} 
          alt="School Seal" 
          className="w-full h-full object-cover rounded-full border border-[#2C2C2C]/10 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-[#FDFCF9]"
          referrerPolicy="no-referrer"
        />
      ) : (
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Single representative gear tooth, rotated 12 times to form the complete cog */}
            <g id="gear-tooth">
              <polygon
                points="231,105 234,74 266,74 269,105"
                fill="#FBC02D"
                stroke="#A31D1D"
                strokeWidth="5"
                strokeLinejoin="round"
              />
            </g>
            
            {/* Curved text paths within the golden ring */}
            <path id="sealPathTop" d="M 112 250 A 138 138 0 0 1 388 250" fill="none" />
            <path id="sealPathBottom" d="M 388 250 A 138 138 0 0 0 112 250" fill="none" />
          </defs>

          {/* 12 Outer Gear Teeth */}
          {rotationAngles.map((angle) => (
            <use
              key={`tooth-${angle}`}
              href="#gear-tooth"
              transform={`rotate(${angle}, 250, 250)`}
            />
          ))}

          {/* Golden Ring Body */}
          <circle cx="250" cy="250" r="150" fill="#FBC02D" stroke="#A31D1D" strokeWidth="5" />
          <circle cx="250" cy="250" r="114" fill="#FFFFFF" stroke="#A31D1D" strokeWidth="5" />

          {/* Arched Text Labels inside Golden Ring */}
          <text fill="#A31D1D" fontSize="19.5" fontWeight="900" letterSpacing="0.8" fontFamily="system-ui, sans-serif">
            <textPath href="#sealPathTop" startOffset="50%" textAnchor="middle">
              MSU - ILIGAN INSTITUTE OF
            </textPath>
          </text>
          
          <text fill="#A31D1D" fontSize="19.5" fontWeight="900" letterSpacing="1.2" fontFamily="system-ui, sans-serif">
            <textPath href="#sealPathBottom" startOffset="50%" textAnchor="middle">
              TECHNOLOGY
            </textPath>
          </text>

          {/* Central Solid Red Loop Focal Button */}
          <circle cx="250" cy="250" r="21" fill="#A31D1D" />

          {/* Interlocking Parallel Maroon Chevrons */}
          
          {/* 1. Underlying Side 1 (Top to Bottom-Right) */}
          {lines.slice(0, 3).map((l) => (
            <g key={l.id}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FFFFFF" strokeWidth="16" strokeLinecap="butt" />
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#A31D1D" strokeWidth="8.5" strokeLinecap="butt" />
            </g>
          ))}

          {/* 2. Side 2 (Bottom-Right to Bottom-Left) */}
          {lines.slice(3, 6).map((l) => (
            <g key={l.id}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FFFFFF" strokeWidth="16" strokeLinecap="butt" />
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#A31D1D" strokeWidth="8.5" strokeLinecap="butt" />
            </g>
          ))}

          {/* 3. Side 3 (Bottom-Left to Top - naturally overlays Side 2 at bottom-left and Side 1 at top) */}
          {lines.slice(6, 9).map((l) => (
            <g key={l.id}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FFFFFF" strokeWidth="16" strokeLinecap="butt" />
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#A31D1D" strokeWidth="8.5" strokeLinecap="butt" />
            </g>
          ))}

          {/* 4. Overlap layer to weave Side 2 on top of Side 3 at the bottom-left corner */}
          {side2Overlay.map((l) => (
            <g key={l.id}>
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#FFFFFF" strokeWidth="16" strokeLinecap="butt" />
              <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#A31D1D" strokeWidth="8.5" strokeLinecap="butt" />
            </g>
          ))}

          {/* Central '1968' Year Text */}
          <text
            x="250"
            y="287"
            fill="#A31D1D"
            fontSize="16.5"
            fontWeight="800"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
            letterSpacing="0.4"
          >
            1968
          </text>
        </svg>
      )}

      {editable && onImageChange && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer rounded-full p-1 text-center">
          <span className="text-[7px] md:text-[8px] text-white font-mono tracking-tighter uppercase font-bold leading-tight">
            Click to Change
          </span>
        </div>
      )}
    </div>
  );
};

// Dice rendering based on dots count
export const DiceIcon: React.FC<{ dots: number; className?: string }> = ({ dots, className = 'w-24 h-24' }) => {
  const getDotPositions = (n: number) => {
    switch (n) {
      case 1:
        return [{ x: 50, y: 50 }];
      case 2:
        return [
          { x: 30, y: 70 },
          { x: 70, y: 30 }
        ];
      case 3:
        return [
          { x: 30, y: 70 },
          { x: 50, y: 50 },
          { x: 70, y: 30 }
        ];
      case 4:
        return [
          { x: 30, y: 30 },
          { x: 70, y: 30 },
          { x: 30, y: 70 },
          { x: 70, y: 70 }
        ];
      case 5:
        return [
          { x: 30, y: 30 },
          { x: 70, y: 30 },
          { x: 30, y: 70 },
          { x: 70, y: 70 },
          { x: 50, y: 50 }
        ];
      case 6:
        return [
          { x: 30, y: 30 },
          { x: 70, y: 30 },
          { x: 30, y: 50 },
          { x: 70, y: 50 },
          { x: 30, y: 70 },
          { x: 70, y: 70 }
        ];
      default:
        return [];
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} text-stone-800 transition-transform duration-300 hover:scale-105 active:scale-95`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dice Base - paper look, subtle shadow */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="20"
        fill="#fcfaf6"
        stroke="#1c1917"
        strokeWidth="6"
      />
      {/* Inner accent ring */}
      <rect
        x="12"
        y="12"
        width="76"
        height="76"
        rx="14"
        fill="none"
        stroke="#e7e5e4"
        strokeWidth="2"
      />
      {/* Group of dots */}
      {getDotPositions(dots).map((dot, idx) => (
        <circle
          key={idx}
          cx={dot.x}
          cy={dot.y}
          r="8"
          fill="#1c1917"
          className="animate-pulse"
          style={{ animationDelay: `${idx * 150}ms` }}
        />
      ))}
    </svg>
  );
};

// 3D Isometric Dice for presentation
export const Dice3D: React.FC<{ className?: string }> = ({ className = 'w-28 h-28' }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} transition-transform duration-300 hover:rotate-6 hover:scale-110`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 3D Dice Sides */}
      {/* Bottom shadow */}
      <ellipse cx="60" cy="105" rx="40" ry="10" fill="#000000" fillOpacity="0.1" />

      {/* Top Face */}
      <path
        d="M60 20 L95 38 L60 56 L25 38 Z"
        fill="#fcfaf6"
        stroke="#1c1917"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Left Face */}
      <path
        d="M25 38 L60 56 L60 95 L25 77 Z"
        fill="#f4f0e6"
        stroke="#1c1917"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {/* Right Face */}
      <path
        d="M60 56 L95 38 L95 77 L60 95 Z"
        fill="#ebe6da"
        stroke="#1c1917"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />

      {/* Dots on Top Face (e.g. 1) */}
      <circle cx="60" cy="38" r="4.5" fill="#1c1917" />

      {/* Dots on Left Face (e.g. 5) */}
      <circle cx="42" cy="52" r="4" fill="#1c1917" />
      <circle cx="42" cy="71" r="4" fill="#1c1917" />
      <circle cx="48" cy="61.5" r="4" fill="#1c1917" />
      <circle cx="54" cy="52" r="4" fill="#1c1917" />
      <circle cx="54" cy="71" r="4" fill="#1c1917" />

      {/* Dots on Right Face (e.g. 3) */}
      <circle cx="72" cy="54" r="4" fill="#1c1917" />
      <circle cx="77.5" cy="65.5" r="4" fill="#1c1917" />
      <circle cx="83" cy="77" r="4" fill="#1c1917" />
    </svg>
  );
};

// Hand-drawn Quiz Sheet
export const HanddrawnQuizSheet: React.FC<{
  title: string;
  score: string;
  studentName: string;
  className?: string;
  dotsData?: string;
}> = ({ title, score, studentName, className = '', dotsData }) => {
  const isFirstSheet = score === '5/7';

  return (
    <div
      className={`relative w-full ${isFirstSheet ? 'max-w-[280px]' : 'max-w-[440px] md:max-w-[480px]'} bg-stone-50 border border-stone-300 rounded shadow-md p-4 overflow-hidden select-none font-mono ${className}`}
      style={{
        backgroundImage: 'linear-gradient(#e5e5e0 1px, transparent 1px)',
        backgroundSize: '100% 1.15rem',
        lineHeight: '1.15rem',
        minHeight: isFirstSheet ? '370px' : '400px'
      }}
    >
      {/* Binder holes on left */}
      <div className="absolute left-1.5 top-0 bottom-0 flex flex-col justify-around py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-stone-400" />
        ))}
      </div>

      {/* Red margin line */}
      <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-red-300" />

      {/* Ruling lines simulation and text content */}
      <div className="pl-6 pt-1 text-[10px] text-stone-700 leading-[1.15rem]">
        {/* Student Name and subject header exactly like image */}
        <div className="border-b border-indigo-200 pb-[1.5px] mb-[1.5px] flex flex-wrap justify-between font-bold text-[10px]">
          <span>Name: <span className="font-serif italic text-blue-800 text-[11px] font-black">{isFirstSheet ? 'Precious Lara L. Degoma' : 'Degoma, Precious Lara L.'}</span></span>
          <span className="text-[9px] text-[#5A5A40] font-black">{isFirstSheet ? 'BSED Biology' : 'BSED Biology'}</span>
        </div>

        {isFirstSheet ? (
          /* Left Page Transcription: 14 to 20 */
          <div className="mt-3 space-y-[4px] text-[11px] font-sans">
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span>14. <strong className="text-blue-800 font-serif italic text-sm ml-2">C</strong></span>
              <span className="text-emerald-600 font-bold text-xs">✓</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span>15. <strong className="text-blue-800 font-serif italic text-sm ml-2">A</strong></span>
              <span className="text-emerald-600 font-bold text-xs">✓</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span>16. <strong className="text-blue-800 font-serif italic text-sm ml-2">B</strong></span>
              <span className="text-emerald-600 font-bold text-xs">✓</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span>17. <strong className="text-blue-800 font-serif italic text-sm ml-2">B</strong></span>
              <span className="text-emerald-600 font-bold text-xs">✓</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span className="relative">
                18. <strong className="text-red-600 line-through font-serif italic text-sm ml-2">B</strong>
              </span>
              <span className="text-red-500 font-bold text-xs">✗</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span className="relative">
                19. <strong className="text-red-600 line-through font-serif italic text-sm ml-2">C</strong>
              </span>
              <span className="text-red-500 font-bold text-xs">✗</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-0.5">
              <span>20. <strong className="text-blue-800 font-serif italic text-sm ml-2">B</strong></span>
              <span className="text-emerald-600 font-bold text-xs">✓</span>
            </div>
          </div>
        ) : (
          /* Right Page Transcription: Test I and Test II in two elegant columns */
          <div className="grid grid-cols-2 gap-x-6 mt-2 text-[9px] font-sans">
            {/* Test I Column */}
            <div className="border-r border-stone-200 pr-3 space-y-0.5">
              <div className="font-bold border-b border-stone-300 text-indigo-700 font-mono text-[10px] pb-0.5 mb-1">
                Test I
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>1. <span className="font-serif italic font-bold text-blue-800 ml-1">D</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>2. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>3. <span className="font-serif italic font-bold text-blue-800 ml-1">B</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>4. <span className="font-serif italic font-bold text-blue-800 ml-1">A</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>5. <span className="font-serif italic font-bold text-red-600 line-through ml-1">A</span> <span className="text-[8px] text-stone-500">(C)</span></span>
                <span className="text-red-500 text-[10px]">✗</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>6. <span className="font-serif italic font-bold text-blue-800 ml-1">A</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>7. <span className="font-serif italic font-bold text-red-600 line-through ml-1">D</span> <span className="text-[8px] text-stone-500">(C)</span></span>
                <span className="text-red-500 text-[10px]">✗</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>8. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>9. <span className="font-serif italic font-bold text-blue-800 ml-1">A</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>10. <span className="font-serif italic font-bold text-blue-800 ml-1">B</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>11. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>12. <span className="font-serif italic font-bold text-blue-800 ml-1">A</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>13. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>14. <span className="font-serif italic font-bold text-red-600 line-through ml-1">A</span> <span className="text-[8px] text-stone-500">(C)</span></span>
                <span className="text-red-500 text-[10px]">✗</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>15. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              
              <div className="pt-1 mt-1 border-t border-stone-400 flex justify-between font-mono font-bold text-[9px]">
                <span>SUB-SCORE:</span>
                <span className="text-red-600 underline decoration-double">12</span>
              </div>
            </div>

            {/* Test II Column */}
            <div className="space-y-0.5">
              <div className="font-bold border-b border-stone-300 text-indigo-700 font-mono text-[10px] pb-0.5 mb-1">
                Test II
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>1. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>2. <span className="font-serif italic font-bold text-blue-800 ml-1">B</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>3. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>4. <span className="font-serif italic font-bold text-blue-800 ml-1">B</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>5. <span className="font-serif italic font-bold text-blue-800 ml-1">A</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>6. <span className="font-serif italic font-bold text-blue-800 ml-1">B</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>7. <span className="font-serif italic font-bold text-blue-800 ml-1">B</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>8. <span className="font-serif italic font-bold text-blue-800 ml-1">A</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>9. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>10. <span className="font-serif italic font-bold text-blue-800 ml-1">D</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>11. <span className="font-serif italic font-bold text-red-600 line-through ml-1">D</span> <span className="text-[8px] text-stone-500">(A)</span></span>
                <span className="text-red-500 text-[10px]">✗</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>12. <span className="font-serif italic font-bold text-blue-800 ml-1">C</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center pb-[1px]">
                <span>13. <span className="font-serif italic font-bold text-blue-800 ml-1">D</span></span>
                <span className="text-emerald-600 text-[10px]">✓</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 pb-[1px]">
                <span>14. <span className="italic line-through ml-1">—</span></span>
                <span className="text-[8px]">line</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 pb-[1px]">
                <span>15. <span className="italic line-through ml-1">—</span></span>
                <span className="text-[8px]">line</span>
              </div>

              <div className="pt-1 mt-1 border-t border-stone-400 flex justify-between font-mono font-bold text-[9px]">
                <span>SUB-SCORE:</span>
                <span className="text-red-600 underline decoration-double">12</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Handwritten big Red Score circle */}
      <div className={`absolute ${isFirstSheet ? 'right-4 bottom-4 w-16 h-16' : 'right-4 bottom-2.5 w-18 h-18'} rounded-full border-3 border-red-500 flex flex-col items-center justify-center rotate-[-12deg] bg-red-50/80 select-none animate-pulse shadow-sm z-10`}>
        <span className="text-red-500 text-[20px] font-bold tracking-tighter leading-none">{isFirstSheet ? '5/7' : '24'}</span>
        <span className="text-red-400 text-[8px] font-bold uppercase tracking-wide leading-none mt-1">{isFirstSheet ? 'Passed' : 'TOTAL'}</span>
        {/* Draw a handwritten tick underneath */}
        <svg viewBox="0 0 50 15" className="w-12 h-3.5 text-red-400 fill-none stroke-current stroke-3 mt-0.5">
          <path d="M5 10 Q15 2 22 13 T45 3" />
        </svg>
      </div>
    </div>
  );
};

// ZipGrade Bubble Sheet rendering with optional real photo additions
export const ZipgradeSheet: React.FC<{
  title: string;
  score: string;
  className?: string;
  isFirst?: boolean;
  photo?: string | null;
  onPhotoChange?: (src: string | null) => void;
  editable?: boolean;
}> = ({ 
  title, 
  score, 
  className = '', 
  isFirst = true,
  photo: photoProp,
  onPhotoChange,
  editable = false
}) => {
  const storageKey = `zipgrade_photo_${isFirst ? 'midterm' : 'final'}`;
  const [photo, setPhoto] = React.useState<string | null>(() => {
    if (photoProp !== undefined) return photoProp;
    try {
      return localStorage.getItem(storageKey);
    } catch (e) {
      return null;
    }
  });

  React.useEffect(() => {
    if (photoProp !== undefined) {
      setPhoto(photoProp);
    }
  }, [photoProp]);

  const [fullscreen, setFullscreen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        if (uploadEvent.target?.result) {
          const base64 = uploadEvent.target.result as string;
          setPhoto(base64);
          try {
            const compressed = await compressBase64(base64, 500, 500, 0.7);
            setPhoto(compressed);
            localStorage.setItem(storageKey, compressed);
            if (onPhotoChange) {
              onPhotoChange(compressed);
            }
          } catch (err) {
            console.error('Failed to save to localStorage:', err);
            // Fallback to storing raw if small, but catch quota errors
            try {
              localStorage.setItem(storageKey, base64);
              if (onPhotoChange) {
                onPhotoChange(base64);
              }
            } catch (quotaErr) {
              console.error('Quota exceeded, cannot save raw image:', quotaErr);
            }
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editable) return;
    setPhoto(null);
    try {
      localStorage.removeItem(storageKey);
      if (onPhotoChange) {
        onPhotoChange(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className={`relative w-full max-w-[280px] aspect-[3/4.2] rounded-lg shadow-lg overflow-hidden select-none group/zip ${className}`}>
        {/* Hidden input for custom photoupload */}
        {editable && (
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        )}

        {photo ? (
          /* Actual photo mode view */
          <div className="relative w-full h-full bg-stone-900 border border-stone-300 rounded-lg flex flex-col justify-between">
            <img 
              src={photo} 
              alt={`${title} Real bubble sheet upload`} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover/zip:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Real bubble sheet score overlay */}
            <div className="absolute top-2 right-2 bg-rose-600/90 text-white font-mono font-black text-xs px-2 py-1 rounded shadow-md border border-rose-500 backdrop-blur-[1px]">
              {score}
            </div>

            {/* Hover actions panel */}
            <div className="absolute inset-0 bg-stone-950/65 opacity-0 group-hover/zip:opacity-100 transition-opacity duration-250 flex flex-col justify-center items-center space-y-3 z-10 p-4">
              <span className="text-[10px] text-stone-200 uppercase font-mono font-bold tracking-wider text-center">{title}</span>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFullscreen(true)}
                  title="View Fullscreen"
                  className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full transition-all hover:scale-110 cursor-pointer shadow border-none"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {editable && (
                  <>
                    <button 
                      onClick={triggerUpload}
                      title="Replace Photo"
                      className="p-2 bg-blue-700 hover:bg-blue-600 text-white rounded-full transition-all hover:scale-110 cursor-pointer shadow border-none"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={removePhoto}
                      title="Revert to Simulated Sheet"
                      className="p-2 bg-rose-700 hover:bg-rose-600 text-white rounded-full transition-all hover:scale-110 cursor-pointer shadow border-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              <span className="text-[8px] text-stone-300 font-sans italic text-center">
                {editable ? "Interactive Photo mode active" : "Interactive View Mode"}
              </span>
            </div>
          </div>
        ) : (
          /* Simulated default bubble sheet view */
          <div className="relative w-full h-full">
            {/* Outer border wrapper matching original styled sheet */}
            <div className="relative w-full h-full bg-white border-2 border-stone-400 rounded-lg p-3 text-stone-800 flex flex-col justify-between">
              {/* Corner calibration targets */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-stone-900 rounded-sm" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-stone-950 rounded-sm" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-stone-950 rounded-sm" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-stone-950 rounded-sm" />

              {/* Unique overlay for upload prompt */}
              {editable && (
                <div className="absolute inset-0 bg-transparent hover:bg-stone-50/50 transition-colors flex items-center justify-center pointer-events-none group-hover/zip:pointer-events-auto z-10">
                  <button 
                    onClick={triggerUpload}
                    className="opacity-0 group-hover/zip:opacity-100 scale-90 group-hover/zip:scale-100 transition-all py-1.5 px-3 bg-[#5A5A40] hover:bg-[#2C2C2C] text-white text-[10px] font-mono rounded shadow-lg flex items-center space-x-1.5 cursor-pointer border border-[#2C2C2C]"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Use Actual Photo</span>
                  </button>
                </div>
              )}

              {/* Inner content box */}
              <div className="border border-stone-800 p-2 h-full flex flex-col justify-between text-stone-800 font-sans">
                {/* ZipGrade Header */}
                <div className="text-center border-b-2 border-stone-800 pb-1.5">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-black tracking-widest text-stone-900">ZIPGRADE.COM</span>
                    <span className="text-[9px] bg-stone-200 px-1 rounded font-bold">{isFirst ? 'MIDTERM' : 'FINALEXAM'}</span>
                  </div>
                  <h1 className="text-[12px] font-serif font-black tracking-tight text-stone-900 mt-1">{title.toUpperCase()}</h1>
                </div>

                {/* Student Metadata Box */}
                <div className="grid grid-cols-2 gap-1 text-[8px] my-1.5 bg-stone-50 p-1 rounded font-mono border border-stone-200">
                  <div>
                    <span className="text-stone-500">Student Name:</span>
                    <div className="font-bold text-stone-900 truncate">Degoma, Precious Lara L.</div>
                  </div>
                  <div>
                    <span className="text-stone-500">Subject Class:</span>
                    <div className="font-bold text-stone-900 truncate">BSEd Bio / T78</div>
                  </div>
                </div>

                {/* Bubble sheet grid mock */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[7px] leading-tight flex-1 py-1">
                  {[...Array(20)].map((_, i) => {
                    const qNum = i + 1;
                    const chosenLetter = ['A', 'B', 'B', 'D', 'C', 'A', 'E', 'B', 'C', 'D'][qNum % 10];
                    const isCorrect = isFirst ? qNum % 4 !== 0 : qNum % 12 !== 0;

                    return (
                      <div key={i} className="flex items-center space-x-1 border-b border-stone-100 py-0.5">
                        <span className="font-bold text-stone-500 w-3 text-right">{qNum}</span>
                        <div className="flex space-x-[2px] items-center">
                          {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                            const isSelected = letter === chosenLetter;
                            return (
                              <div
                                key={letter}
                                className={`w-3.5 h-3.5 rounded-full border border-stone-400 flex items-center justify-center text-[5.5px] font-semibold transition-colors
                                  ${isSelected 
                                    ? 'bg-stone-950 text-white border-stone-950 font-bold' 
                                    : 'bg-stone-50 text-stone-500'
                                  } relative`}
                              >
                                {letter}
                                {isSelected && !isCorrect && (
                                  <div className="absolute inset-0 bg-red-400 rounded-full opacity-60 flex items-center justify-center text-white font-black text-[6px]">
                                    ✗
                                  </div>
                                )}
                                {isSelected && isCorrect && qNum % 5 === 0 && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 text-white text-[5px] flex items-center justify-center">
                                    ✓
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Written score marker & Signature */}
                <div className="border-t-2 border-stone-800 pt-1.5 flex justify-between items-end font-mono">
                  <div className="leading-none text-left">
                    <span className="text-[6.5px] text-stone-500 block uppercase font-bold">Verified Sign</span>
                    <span className="font-serif italic font-semibold text-stone-950 text-[10px] tracking-wide relative block mt-0.5">
                      Lara Degoma
                      <span className="absolute -top-2 left-0 w-8 h-[1px] bg-indigo-400 rotate-[-8deg] opacity-60"></span>
                    </span>
                  </div>

                  {/* Detailed grade badge */}
                  <div className="bg-stone-100 hover:bg-stone-200 border border-stone-300 px-2 py-0.5 rounded text-right leading-tight">
                    <span className="text-[6px] text-stone-500 block uppercase font-bold">Final Score</span>
                    <span className="text-[12px] font-black text-rose-600 block tracking-tight">{score}</span>
                    <span className="text-[5.5px] font-bold text-stone-600 block">{isFirst ? 'PASSED (75%)' : 'EXCELLENT (93%)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen overlay modal */}
      {fullscreen && photo && (
        <div 
          onClick={() => setFullscreen(false)}
          className="fixed inset-0 bg-black/90 flex flex-col justify-center items-center z-50 p-4 cursor-zoom-out"
        >
          <div className="absolute top-4 right-4 text-stone-300 hover:text-white transition-colors cursor-pointer font-mono text-xs bg-stone-900/60 px-3 py-1.5 rounded-full flex items-center space-x-1 border border-stone-800">
            <span>Click anywhere to exit</span>
          </div>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-full max-h-[85vh] md:max-h-[90vh] bg-stone-950 p-2 rounded-xl border border-stone-800 shadow-2xl flex flex-col"
          >
            <img 
              src={photo} 
              alt="Expanded ZipGrade Bubble Sheet" 
              className="max-w-full h-auto max-h-[75vh] md:max-h-[80vh] object-contain rounded-lg shadow-inner"
              referrerPolicy="no-referrer"
            />
            <div className="pt-3 pb-1 text-center font-mono text-stone-400 leading-tight">
              <h4 className="text-white text-xs md:text-sm font-serif font-black">{title.toUpperCase()}</h4>
              <p className="text-[10px] text-stone-500 font-sans mt-1">Student: Degoma, Precious Lara L. • Score: {score}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Elegant high-fidelity SVG representation of Precious Lara Degoma to guarantee uncanny resemblance on load!
export const StudentAvatar: React.FC<{
  imageSrc?: string | null;
  className?: string;
  onImageChange?: (src: string) => void;
  editable?: boolean;
}> = ({ imageSrc, className = 'w-48 h-48', onImageChange, editable = false }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result && onImageChange) {
          onImageChange(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerUpload = (e: React.MouseEvent) => {
    if (editable && onImageChange) {
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  // Check if imageSrc is truthy and not just an empty placeholder
  const hasValidImage = imageSrc && imageSrc.trim() !== '' && !imageSrc.includes('assets/images/profile_pic_jpg');

  return (
    <div 
      className={`relative inline-block ${className} group`}
    >
      {editable && onImageChange && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      )}

      {editable && onImageChange && (
        <div 
          onClick={triggerUpload}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer rounded-2xl p-3 text-center z-20 text-white font-mono"
        >
          <Camera className="w-8 h-8 mb-1 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Change Photo
          </span>
        </div>
      )}

      {hasValidImage ? (
        // Custom uploaded image
        <div className="w-full h-full rounded-lg overflow-hidden border-4 border-stone-200 shadow-lg relative bg-white">
          <img src={imageSrc} alt="Precious Lara" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      ) : (
        // High fidelity styled vector portrait matching the screenshot
        <div className="w-full h-full rounded-2xl overflow-hidden border-[6px] border-stone-200 bg-[#e5e0d4] shadow-lg relative">
          <svg viewBox="0 0 100 100" className="w-full h-full select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3eee3" />
                <stop offset="100%" stopColor="#dcd5c5" />
              </linearGradient>
              <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#801b1b" />
                <stop offset="50%" stopColor="#991b1b" />
                <stop offset="100%" stopColor="#6b1414" />
              </linearGradient>
              <clipPath id="circleClip">
                <rect x="2" y="2" width="96" height="96" rx="14" />
              </clipPath>
            </defs>

            {/* Background */}
            <rect width="100" height="100" fill="url(#avatarGrad)" />
            
            {/* Subtle blackboard/library background lines */}
            <line x1="10" y1="20" x2="90" y2="20" stroke="#cabfa8" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="10" y1="35" x2="90" y2="35" stroke="#cabfa8" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="15" y1="50" x2="45" y2="50" stroke="#cabfa8" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="55" y1="50" x2="85" y2="50" stroke="#cabfa8" strokeWidth="0.5" strokeDasharray="3 3" />

            <g clipPath="url(#circleClip)">
              {/* Hair Back */}
              <path d="M25 50 C25 22, 75 22, 75 50 C75 58, 72 65, 78 72 C74 76, 68 70, 68 62 M25 50 C25 58, 28 65, 22 72 C26 76, 32 70, 32 62" fill="#1c1917" />
              
              {/* Ears */}
              <circle cx="31" cy="48" r="4.5" fill="#facc15" fillOpacity="0.15" />
              <circle cx="31" cy="48" r="3.2" fill="#fbcfe8" />
              <circle cx="69" cy="48" r="4.5" fill="#facc15" fillOpacity="0.15" />
              <circle cx="69" cy="48" r="3.2" fill="#fbcfe8" />

              {/* Neck */}
              <path d="M44 54 L56 54 L54 62 L46 62 Z" fill="#ebbe9b" />
              <path d="M44 58 C44 58, 50 62, 56 58" stroke="#d49e73" strokeWidth="1" fill="none" />

              {/* Face */}
              <path d="M33 42 C33 27, 67 27, 67 42 C67 56, 60 62, 50 62 C40 62, 33 56, 33 42 Z" fill="#fbcfe8" />
              
              {/* Blush cheeks */}
              <circle cx="39" cy="50" r="3.5" fill="#f43f5e" fillOpacity="0.25" />
              <circle cx="61" cy="50" r="3.5" fill="#f43f5e" fillOpacity="0.25" />

              {/* Hair front bangs */}
              <path d="M32 40 C35 30, 48 24, 52 28 C56 24, 65 30, 68 40 C70 45, 68 32, 60 26 C53 23, 44 23, 38 26 C31 32, 30 45, 32 40 Z" fill="#1c1917" />
              
              {/* Happy Eyes with lashes */}
              <path d="M36 43 C37.5 41, 41.5 41, 43 43" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M57 43 C58.5 41, 62.5 41, 64 43" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
              
              {/* Eyebrows */}
              <path d="M35 39 C37 37, 41 37, 42.5 38.5" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M65 39 C63 37, 59 37, 57.5 38.5" stroke="#1c1917" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* Nose */}
              <path d="M49 46 C49 46, 50 49, 51 46" stroke="#d49e73" strokeWidth="1.2" strokeLinecap="round" fill="none" />

              {/* Glasses - black thick frame (UNCANNY!) */}
              <rect x="33" y="39" width="13" height="9" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="2.2" />
              <rect x="54" y="39" width="13" height="9" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="2.2" />
              <line x1="46" y1="43" x2="54" y2="43" stroke="#1a1a1a" strokeWidth="2.5" />
              {/* Temple pieces left and right */}
              <line x1="33" y1="42" x2="28" y2="40" stroke="#1a1a1a" strokeWidth="1.8" />
              <line x1="67" y1="42" x2="72" y2="40" stroke="#1a1a1a" strokeWidth="1.8" />

              {/* Smile / Mouth */}
              <path d="M44 51 Q50 56 56 51" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              {/* White teeth detail inside smile */}
              <path d="M45 52 Q50 55 55 52" fill="none" stroke="#ffffff" strokeWidth="1.2" />

              {/* Clothes: White collar + Maroon Blazer jacket (MSU-IIT blazer) */}
              <path d="M30 72 L70 72 L65 58 L35 58 Z" fill="#ffffff" />  {/* White inner shirt */}
              <path d="M22 62 C30 62, 35 68, 35 100 L65 100 C65 68, 70 62, 78 62 C85 64, 80 100, 80 100 L20 100 C20 100, 15 64, 22 62 Z" fill="url(#jacketGrad)" /> {/* Blazer */}
              
              {/* Left & Right Blazer collars */}
              <polygon points="35,62 44,78 30,76 26,62" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="0.5" />
              <polygon points="65,62 56,78 70,76 74,62" fill="#7f1d1d" stroke="#f59e0b" strokeWidth="0.5" />

              {/* Little golden circular lapel pin (MSU IIT designator crest!) */}
              <circle cx="31" cy="70" r="1.8" fill="#eab308" stroke="#1c1917" strokeWidth="0.4" />
              <polygon points="31,69.2 29.8,71 32.2,71" fill="#7f1d1d" />
            </g>

            {/* Frame border */}
            <rect x="2" y="2" width="96" height="96" rx="14" fill="none" stroke="#57534e" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
};
