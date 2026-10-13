import React from 'react';

interface BackgroundContainerProps {
  imageUrl: string;
  darknessOverlay: number; // 0 - 80 (%)
  blurAmount: number;      // 0 - 10 (px)
  children?: React.ReactNode;
}

export const BackgroundContainer: React.FC<BackgroundContainerProps> = ({
  imageUrl,
  darknessOverlay,
  blurAmount,
  children,
}) => {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden z-0">
      {/* 4K Background Image */}
      <img
        src={imageUrl}
        alt="Relaxing Focus Wallpaper"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-all duration-1000 ease-out"
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
      />

      {/* Darkness Overlay & Depth Vignette */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: `rgba(11, 19, 38, ${darknessOverlay / 100})`,
        }}
      />

      {/* Soft Vignette and Ambient Color Shading */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-slate-950/40 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
