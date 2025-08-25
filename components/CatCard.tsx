
import React, { useState, useEffect } from 'react';
import type { Cat } from '../types';

interface CatCardProps {
  cat: Cat;
  onSelect: (cat: Cat) => void;
}

const CatCard: React.FC<CatCardProps> = ({ cat, onSelect }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState('https://placekitten.com/400/300');

  useEffect(() => {
    let objectUrl: string | null = null;
    if (cat.media.length > 0) {
      const firstMedia = cat.media[0];
      if (firstMedia.content instanceof File) {
        objectUrl = URL.createObjectURL(firstMedia.content);
        setThumbnailUrl(objectUrl);
      } else if (typeof firstMedia.content === 'string') {
        setThumbnailUrl(firstMedia.content);
      }
    } else {
        setThumbnailUrl('https://placekitten.com/400/300');
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [cat.media]);

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => onSelect(cat)}
    >
      <img src={thumbnailUrl} alt={cat.name} className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
      </div>
    </div>
  );
};

export default CatCard;
