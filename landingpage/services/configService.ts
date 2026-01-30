
import { 
  DEFAULT_YOUTUBE_LIVE_LINK, 
  DEFAULT_TOPIC_TITLE, 
  DEFAULT_TOPIC_DESC, 
  DEFAULT_TOPIC_IMAGE,
  DEFAULT_SCHEDULE,
  DEFAULT_SPEAKER,
  STORAGE_KEY_LIVE_LINK,
  STORAGE_KEY_TOPIC_TITLE,
  STORAGE_KEY_TOPIC_DESC,
  STORAGE_KEY_TOPIC_IMAGE,
  STORAGE_KEY_SCHEDULE,
  STORAGE_KEY_SPEAKER
} from '../constants';

export const getLiveLink = (): string => {
  return localStorage.getItem(STORAGE_KEY_LIVE_LINK) || DEFAULT_YOUTUBE_LIVE_LINK;
};

export const setLiveLink = (url: string): void => {
  localStorage.setItem(STORAGE_KEY_LIVE_LINK, url);
};

export const getWebinarInfo = () => {
  return {
    title: localStorage.getItem(STORAGE_KEY_TOPIC_TITLE) || DEFAULT_TOPIC_TITLE,
    description: localStorage.getItem(STORAGE_KEY_TOPIC_DESC) || DEFAULT_TOPIC_DESC,
    imageUrl: localStorage.getItem(STORAGE_KEY_TOPIC_IMAGE) || DEFAULT_TOPIC_IMAGE,
    schedule: localStorage.getItem(STORAGE_KEY_SCHEDULE) || DEFAULT_SCHEDULE,
    speaker: localStorage.getItem(STORAGE_KEY_SPEAKER) || DEFAULT_SPEAKER,
  };
};

export const setWebinarInfo = (title: string, desc: string, imageUrl: string, schedule: string, speaker: string): void => {
  localStorage.setItem(STORAGE_KEY_TOPIC_TITLE, title);
  localStorage.setItem(STORAGE_KEY_TOPIC_DESC, desc);
  localStorage.setItem(STORAGE_KEY_TOPIC_IMAGE, imageUrl);
  localStorage.setItem(STORAGE_KEY_SCHEDULE, schedule);
  localStorage.setItem(STORAGE_KEY_SPEAKER, speaker);
};
