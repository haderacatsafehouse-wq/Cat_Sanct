
import React, { useState, useEffect } from 'react';
import type { Cat, Location, MediaItem } from '../types';
import { LOCATIONS } from '../constants';
import { CloseIcon, VideoIcon } from './icons';

interface AddCatFormProps {
  onSaveCat: (catData: Omit<Cat, 'id'> | Cat) => void;
  onClose: () => void;
  catToEdit?: Cat | null;
}

const MediaPreview: React.FC<{ item: MediaItem; onRemove: () => void; }> = ({ item, onRemove }) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        let objectUrl: string | null = null;
        if (item.content instanceof File) {
            objectUrl = URL.createObjectURL(item.content);
            setPreviewUrl(objectUrl);
        } else if (typeof item.content === 'string') {
            setPreviewUrl(item.content);
        }

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [item]);

    if (!previewUrl) return null;

    return (
        <div className="relative group">
            {item.type === 'image' ? (
                <img src={previewUrl} alt="Preview" className="h-24 w-full object-cover rounded-md" />
            ) : (
                <div className="h-24 w-full bg-black rounded-md flex items-center justify-center">
                    <VideoIcon className="h-8 w-8 text-white" />
                </div>
            )}
            <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove media"
            >
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
    );
};


const AddCatForm: React.FC<AddCatFormProps> = ({ onSaveCat, onClose, catToEdit }) => {
  const isEditMode = !!catToEdit;
  
  const [name, setName] = useState('');
  const [locationId, setLocationId] = useState(LOCATIONS[1]?.id || '');
  const [shelterEntryYear, setShelterEntryYear] = useState<number>(new Date().getFullYear());
  const [about, setAbout] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && catToEdit) {
      setName(catToEdit.name);
      setLocationId(catToEdit.locationId);
      setShelterEntryYear(catToEdit.description.shelterEntryYear);
      setAbout(catToEdit.description.about);
      setMedia(catToEdit.media);
    } else {
      setName('');
      setLocationId(LOCATIONS[1]?.id || '');
      setShelterEntryYear(new Date().getFullYear());
      setAbout('');
      setMedia([]);
    }
  }, [catToEdit, isEditMode]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newMediaItems: MediaItem[] = files.map(file => ({
        type: file.type.startsWith('video') ? 'video' : 'image',
        content: file,
      }));
      setMedia(prev => [...prev, ...newMediaItems]);
    }
  };

  const handleRemoveMedia = (index: number) => {
      setMedia(prev => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = !name || !locationId || !shelterEntryYear || !about;
    if (validationError) {
      setError('נא למלא את כל שדות החובה.');
      return;
    }
     if (media.length === 0) {
      setError('נא להוסיף לפחות קובץ מדיה אחד.');
      return;
    }
    setError('');
    setIsLoading(true);
      
    const catData = {
      name,
      locationId,
      media,
      description: {
        shelterEntryYear,
        about: about,
      },
    };

    if (isEditMode && catToEdit) {
      onSaveCat({ ...catData, id: catToEdit.id });
    } else {
      onSaveCat(catData);
    }
    setIsLoading(false);
  };
  
  const formLocations = LOCATIONS.filter(loc => loc.id !== 'all');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-[#763C96]">{isEditMode ? 'עריכת פרטי חתול' : 'הוספת חתול חדש'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">שם החתול*</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">מיקום*</label>
                    <select id="location" value={locationId} onChange={(e) => setLocationId(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-white" required>
                        {formLocations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="shelterEntryYear" className="block text-sm font-medium text-gray-700">שנת הגעה למקלט*</label>
                    <input type="number" id="shelterEntryYear" value={shelterEntryYear} onChange={(e) => setShelterEntryYear(parseInt(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">תמונות/סרטונים*</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"><span>העלה קבצים</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*,video/*" /></label>
                                <p className="ps-1">או גרור ושחרר</p>
                            </div>
                            <p className="text-xs text-gray-500">תמונות או סרטונים</p>
                        </div>
                    </div>
                     {media.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {media.map((item, index) => (
                                <MediaPreview key={index} item={item} onRemove={() => handleRemoveMedia(index)} />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">קצת עליי*</label>
                  <textarea id="about" value={about} onChange={(e) => setAbout(e.target.value)} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" required></textarea>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex justify-end space-x-4 space-x-reverse">
                    <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">ביטול</button>
                    <button type="submit" disabled={isLoading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#763C96] hover:bg-[#5f2f78] disabled:bg-purple-300 flex items-center">
                        {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin me-2"></div>}
                        {isLoading ? (isEditMode ? 'שומר...' : 'מוסיף...') : (isEditMode ? 'שמור שינויים' : 'הוסף חתול')}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default AddCatForm;
