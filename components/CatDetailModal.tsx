
import React, { useState, useEffect } from 'react';
import type { Cat, MediaItem } from '../types';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, TrashIcon } from './icons';

interface CatDetailModalProps {
  cat: Cat | null;
  onClose: () => void;
  isAuthenticated: boolean;
  onEdit: (cat: Cat) => void;
  onDelete: (catId: string) => void;
}

const CatDetailModal: React.FC<CatDetailModalProps> = ({ cat, onClose, isAuthenticated, onEdit, onDelete }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [displayUrl, setDisplayUrl] = useState('');

  useEffect(() => {
    // Reset index when cat changes
    setCurrentMediaIndex(0);
  }, [cat]);

  const currentMedia = cat?.media[currentMediaIndex];

  useEffect(() => {
    let objectUrl: string | null = null;
    
    if (currentMedia) {
      if (currentMedia.content instanceof File) {
        objectUrl = URL.createObjectURL(currentMedia.content);
        setDisplayUrl(objectUrl);
      } else if (typeof currentMedia.content === 'string') {
        setDisplayUrl(currentMedia.content);
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [currentMedia]);

  if (!cat) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prevIndex) => 
      prevIndex === 0 ? cat.media.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMediaIndex((prevIndex) => 
      prevIndex === cat.media.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(cat);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(cat.id);
  };
  
  const renderMedia = (item: MediaItem, url: string) => {
    if (!url) return <div className="w-full h-80 bg-gray-200 animate-pulse rounded-md"></div>;

    if (item.type === 'image') {
        return <img src={url} alt={`${cat.name} - ${currentMediaIndex + 1}`} className="w-full h-80 object-cover rounded-md" />;
    }
    
    if (item.type === 'video') {
        const isYouTube = url.includes('youtube.com/embed');
        return isYouTube ? (
            <iframe 
                src={url}
                title={`Video of ${cat.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="w-full h-80 rounded-md"
            ></iframe>
        ) : (
            <video controls src={url} className="w-full h-80 rounded-md bg-black"></video>
        );
    }
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-3xl font-bold text-[#763C96]">{cat.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <CloseIcon className="w-8 h-8" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {cat.media.length > 0 && currentMedia && (
            <div className="relative mb-4">
              {renderMedia(currentMedia, displayUrl)}
              {cat.media.length > 1 && (
                <>
                  <button onClick={handlePrev} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75">
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button onClick={handleNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75">
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs rounded-full px-2 py-1">
                    {currentMediaIndex + 1} / {cat.media.length}
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-1 mb-2">שנת הגעה לבית המחסה</h3>
              <p className="text-gray-700 text-lg">{cat.description.shelterEntryYear}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-purple-200 pb-1 mb-2">קצת עליי</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{cat.description.about}</p>
            </div>
          </div>

        </div>
        {isAuthenticated && (
            <div className="p-4 border-t mt-auto flex justify-end space-x-4 space-x-reverse">
                <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <EditIcon className="w-5 h-5" />
                    ערוך
                </button>
                 <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <TrashIcon className="w-5 h-5" />
                    מחק
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default CatDetailModal;
