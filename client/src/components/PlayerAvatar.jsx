import React, { useState, useEffect } from 'react';

export default function PlayerAvatar({ name = '', country = '', photo_url = '', photoUrl = '', size = 'md', className = '' }) {
  const initialSrc = photo_url || photoUrl || `/photos/${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.jpg`;
  const [currentSrc, setCurrentSrc] = useState(initialSrc);

  useEffect(() => {
    setCurrentSrc(photo_url || photoUrl || `/photos/${name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.jpg`);
  }, [photo_url, photoUrl, name]);

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-full',
    sm: 'w-9 h-9 rounded-full',
    md: 'w-12 h-12 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl'
  };

  const handleImageError = () => {
    // If specific photo fails, fallback to default local photo
    if (currentSrc !== '/photos/sachin_tendulkar.jpg') {
      setCurrentSrc('/photos/sachin_tendulkar.jpg');
    }
  };

  return (
    <img
      src={currentSrc}
      alt={name}
      className={`object-cover object-top border-2 border-cyan-500/30 shadow-md bg-slate-800 shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      onError={handleImageError}
    />
  );
}
