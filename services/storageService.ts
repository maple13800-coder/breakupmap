import { Story } from '../types';

const STORAGE_KEY = 'breakup_map_stories';

// Initial seed data to populate the map with some "mood"
const SEED_DATA: Story[] = [
  {
    id: 'seed-1',
    location: { lat: 37.5665, lng: 126.9780 }, // Seoul City Hall area
    content: "우리가 처음 만났던 시청 광장. 이제는 혼자 걷기엔 너무 넓게 느껴져. 너의 웃음소리가 아직도 들리는 것 같아서 가끔 멈춰 서곤 해.",
    createdAt: Date.now() - 10000000,
    likes: 12
  },
  {
    id: 'seed-2',
    location: { lat: 37.5512, lng: 126.9882 }, // Namsan
    content: "남산 타워 자물쇠는 아직 거기에 있을까? 영원하자고 약속했는데, 그 약속은 녹슬어버린 자물쇠보다 더 빨리 부서졌네. 부디 행복하길.",
    createdAt: Date.now() - 5000000,
    likes: 45
  },
  {
    id: 'seed-3',
    location: { lat: 37.5283, lng: 126.9294 }, // Yeouido Hangang
    content: "한강 바람이 차다. 네가 덮어주던 옷이 없으니까 더 춥네. 오늘은 여기서 맥주 한 캔 하고 털어버릴게. 안녕, 나의 가장 뜨거웠던 여름.",
    createdAt: Date.now() - 2000000,
    likes: 8
  }
];

export const getStories = (): Story[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // If empty, initialize with seed data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load stories", e);
    return SEED_DATA;
  }
};

export const saveStory = (story: Story): Story[] => {
  const currentStories = getStories();
  const updatedStories = [story, ...currentStories];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
  return updatedStories;
};
