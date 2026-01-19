import React from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Story, Location } from '../types';

// Create a custom DivIcon using pure CSS/SVG to avoid asset loading issues
const createCustomIcon = (isNew: boolean = false) => {
  const color = isNew ? '#9CA3AF' : '#78716C'; // Cool gray for new, Warm Stone for existing
  const html = `
    <svg width="30" height="42" viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.3));">
      <path d="M15 0C6.71573 0 0 6.71573 0 15C0 26.25 15 42 15 42C15 42 30 26.25 30 15C30 6.71573 23.2843 0 15 0Z" fill="${color}"/>
      <circle cx="15" cy="15" r="6" fill="#FAFAF8"/>
    </svg>
  `;
  
  return L.divIcon({
    className: 'custom-pin',
    html: html,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

const existingIcon = createCustomIcon(false);
const newIcon = createCustomIcon(true);

interface MapEventsProps {
  onMapClick: (loc: Location) => void;
}

// Component to handle map clicks
export const MapClickHandler: React.FC<MapEventsProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

interface StoryMarkerProps {
  story: Story;
  onClick: (story: Story) => void;
}

export const StoryMarker: React.FC<StoryMarkerProps> = ({ story, onClick }) => {
  return (
    <Marker 
      position={[story.location.lat, story.location.lng]} 
      icon={existingIcon}
      eventHandlers={{
        click: () => onClick(story)
      }}
    />
  );
};

export const NewMarker: React.FC<{ location: Location }> = ({ location }) => {
  return (
    <Marker 
      position={[location.lat, location.lng]} 
      icon={newIcon}
      opacity={0.8}
    />
  );
};
