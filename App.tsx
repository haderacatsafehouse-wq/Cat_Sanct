
import React, { useState, useMemo, useEffect } from 'react';
import type { Cat } from './types';
import { LOCATIONS } from './constants';
import * as dbService from './services/dbService';
import Header from './components/Header';
import CatCard from './components/CatCard';
import CatDetailModal from './components/CatDetailModal';
import AddCatForm from './components/AddCatForm';
import LoginModal from './components/LoginModal';
import { PlusIcon } from './components/icons';

const initialCats: Cat[] = [
  {
    id: 'c1',
    name: 'מרשל',
    locationId: '1',
    description: {
      shelterEntryYear: 2023,
      about: 'מרשל הוא חתול ג\'ינג\'י וידידותי שאוהב להתפנק בשמש. הוא מסתדר נהדר עם חתולים אחרים ומחפש בית חם ואוהב.',
    },
    media: [
        { type: 'image', content: 'https://picsum.photos/seed/marshal/400/300' },
    ],
  },
];


const App = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all');
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [catToEdit, setCatToEdit] = useState<Cat | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const loadCats = async () => {
      setIsLoading(true);
      try {
        let catsFromDb = await dbService.getAllCats();
        if (catsFromDb.length === 0) {
          // Seed the DB if it's empty on first load
          for (const cat of initialCats) {
            await dbService.addCat(cat);
          }
          catsFromDb = await dbService.getAllCats();
        }
        setCats(catsFromDb);
      } catch (error) {
        console.error("Failed to load or seed cats from DB", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCats();
  }, []);


  const handleSaveCat = async (catData: Omit<Cat, 'id'> | Cat) => {
    if ('id' in catData) {
      // Update existing cat
      await dbService.updateCat(catData);
      setCats(prevCats => prevCats.map(c => c.id === catData.id ? catData : c));
    } else {
      // Add new cat
      const newCat: Cat = {
        id: `c${Date.now()}`,
        ...catData,
      };
      await dbService.addCat(newCat);
      setCats(prevCats => [newCat, ...prevCats]);
    }
    setIsFormOpen(false);
    setCatToEdit(null);
  };

  const handleStartEdit = (cat: Cat) => {
    setCatToEdit(cat);
    setSelectedCat(null);
    setIsFormOpen(true);
  };

  const handleDeleteCat = async (catId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את החתול הזה?')) {
      await dbService.deleteCat(catId);
      setCats(prevCats => prevCats.filter(c => c.id !== catId));
      setSelectedCat(null);
    }
  };
  
  const handleOpenAddForm = () => {
    setCatToEdit(null);
    setIsFormOpen(true);
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  }

  const filteredCats = useMemo(() => {
    if (selectedLocationId === 'all') {
      return cats;
    }
    return cats.filter(cat => cat.locationId === selectedLocationId);
  }, [cats, selectedLocationId]);

  return (
    <div className="bg-[#F9F5FF] min-h-screen">
      <Header 
        isAuthenticated={isAuthenticated} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        onLogoutClick={handleLogout}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
                 <div className="flex flex-wrap gap-2">
                    {LOCATIONS.map(location => (
                        <button 
                            key={location.id} 
                            onClick={() => setSelectedLocationId(location.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedLocationId === location.id ? 'bg-[#763C96] text-white' : 'bg-white text-gray-700 hover:bg-purple-100'}`}
                        >
                            {location.name}
                        </button>
                    ))}
                 </div>
            </div>
            {isAuthenticated && (
                <button
                    onClick={handleOpenAddForm}
                    className="flex items-center gap-2 bg-[#763C96] text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-[#5f2f78] transition-transform transform hover:scale-105"
                >
                    <PlusIcon className="w-5 h-5" />
                    הוסף חתול חדש
                </button>
            )}
        </div>

        {isLoading ? (
            <div className="text-center py-16">
                 <div className="w-16 h-16 border-8 border-[#763C96] border-t-transparent rounded-full animate-spin mx-auto"></div>
                 <p className="text-xl text-gray-500 mt-4">טוען חתולים...</p>
            </div>
        ) : filteredCats.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCats.map(cat => (
                    <CatCard key={cat.id} cat={cat} onSelect={setSelectedCat} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <p className="text-xl text-gray-500">לא נמצאו חתולים במיקום זה.</p>
            </div>
        )}
      </main>

      {selectedCat && (
        <CatDetailModal 
            cat={selectedCat} 
            onClose={() => setSelectedCat(null)}
            isAuthenticated={isAuthenticated}
            onEdit={handleStartEdit}
            onDelete={handleDeleteCat}
        />
      )}
      {isFormOpen && (
        <AddCatForm 
          onSaveCat={handleSaveCat} 
          onClose={() => {
            setIsFormOpen(false);
            setCatToEdit(null);
          }}
          catToEdit={catToEdit}
        />
      )}
      {isLoginModalOpen && <LoginModal onLoginSuccess={handleLoginSuccess} onClose={() => setIsLoginModalOpen(false)} />}
    </div>
  );
};

export default App;
