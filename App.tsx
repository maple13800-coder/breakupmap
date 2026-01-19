import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { getStories, saveStory } from './services/storageService';
import { Story, Location, ModalMode } from './types';
import StoryModal from './components/StoryModal';
import { StoryMarker, NewMarker, MapClickHandler } from './components/MapMarker';
import { Icons } from './components/Icons';
import { v4 as uuidv4 } from 'uuid'; // Need to polyfill or just use simple random for this demo

// Simple UUID generator since we don't have uuid package in this restricted env
const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [stories, setStories] = useState<Story[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>('CLOSED');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [newLocation, setNewLocation] = useState<Location | null>(null);
  
  // Initial center (Seoul)
  const [mapCenter] = useState<[number, number]>([37.5665, 126.9780]);

  useEffect(() => {
    // Load stories on mount
    const data = getStories();
    setStories(data);
  }, []);

  const handleMapClick = (loc: Location) => {
    // Determine if we should allow clicking map
    // Only allow if not reading a story currently
    setNewLocation(loc);
    setModalMode('CREATE');
    setSelectedStory(null);
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    setModalMode('READ');
    setNewLocation(null);
  };

  const handleCreateStory = (content: string) => {
    if (!newLocation) return;

    const newStory: Story = {
      id: generateId(),
      location: newLocation,
      content,
      createdAt: Date.now(),
      likes: 0
    };

    const updated = saveStory(newStory);
    setStories(updated);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalMode('CLOSED');
    setSelectedStory(null);
    setNewLocation(null);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F5F5F0]">
      {/* Header / Brand Overlay */}
      <div className="absolute top-4 left-4 z-[999] pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white/50 pointer-events-auto">
          <h1 className="font-serif font-bold text-2xl text-stone-700 tracking-tight">이별지도</h1>
          <p className="text-xs text-stone-500 mt-1">당신의 기억을 이곳에 묻어두세요.</p>
        </div>
      </div>

      {/* Map */}
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // We will add custom zoom control position
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // CartoDB Light for the "muted" look
        />
        
        <ZoomControl position="bottomright" />

        <MapClickHandler onMapClick={handleMapClick} />

        {stories.map(story => (
          <StoryMarker 
            key={story.id} 
            story={story} 
            onClick={handleStoryClick} 
          />
        ))}

        {newLocation && modalMode === 'CREATE' && (
          <NewMarker location={newLocation} />
        )}
      </MapContainer>

      {/* Action Buttons (Bottom Center) - Optional call to action hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[999] pointer-events-none">
        <div className="bg-stone-800/80 backdrop-blur text-white px-4 py-2 rounded-full text-sm shadow-lg opacity-80 animate-fade-in-up">
          지도를 클릭하여 기억을 남겨보세요
        </div>
      </div>

      {/* Modal */}
      <StoryModal 
        mode={modalMode}
        selectedStory={selectedStory}
        onClose={handleCloseModal}
        onSubmit={handleCreateStory}
      />
    </div>
  );
}

export default App;
