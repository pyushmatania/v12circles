import React from 'react';

interface ImageAttributionProps {
  attribution?: string;
  copyright?: string;
  className?: string;
}

const ImageAttribution: React.FC<ImageAttributionProps> = ({ 
  attribution, 
  copyright, 
  className = "" 
}) => {
  if (!attribution && !copyright) return null;

  return (
    <div className={`text-xs text-gray-500 ${className}`}>
      {attribution && (
        <div>Image: {attribution}</div>
      )}
      {copyright && (
        <div>{copyright}</div>
      )}
    </div>
  );
};

export default ImageAttribution;