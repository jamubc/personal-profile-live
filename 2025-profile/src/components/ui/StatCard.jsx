import React from 'react';
import GlassCard from './GlassCard';

export const StatCard = ({
  value,
  label,
  glowColor = 'purple',
  isGradient = false,
  className = '',
}) => {
  return (
    <GlassCard
      variant="gradient-border"
      glowColor={glowColor}
      hoverEffect="lift"
      className={`text-center px-6 py-8 ${className}`}
    >
      <div
        className={`text-3xl font-bold mb-2 ${
          isGradient
            ? 'bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent'
            : `text-accent-${glowColor}`
        }`}
      >
        {value}
      </div>
      <div className="text-text-secondary text-sm uppercase tracking-wider">
        {label}
      </div>
    </GlassCard>
  );
};
