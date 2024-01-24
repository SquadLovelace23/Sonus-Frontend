import React from 'react'
import { createContext, useState, useContext, ReactNode } from 'react';
import { Song } from '../interfaces/models.interfaces';
import { updateSong } from '../services/song.service';

interface PlayerContextProps {
  currentSong: Song | null;
  setSong: (song: Song | null) => void;
  shuffleSongs: () => void;
  songs: Song[]; 
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  isShuffled: boolean;
  setIsShuffled: React.Dispatch<React.SetStateAction<boolean>>;
}

const counterSong = (song: Song | null) => {
  if (song) {
    if (song.listened === undefined) {
      song.listened = 0;
    }
    song.listened += 1;
  }
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);  
  const [songs, setSongs] = useState<Song[]>(() => {
    const storedSongs = JSON.parse(localStorage.getItem('lastPathSongs') || '[]');
    return storedSongs;
  });
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  const shuffleSongs = () => {
    const storedSongs = JSON.parse(localStorage.getItem('lastPathSongs') || '[]');
    const originalOrder = JSON.parse(localStorage.getItem('originalOrder') || '[]');
  
    let updatedSongs;
  
    if (!isShuffled) {
      updatedSongs = [...storedSongs].sort(() => Math.random() - 0.5);
      localStorage.setItem('lastPathSongs', JSON.stringify(updatedSongs));
      localStorage.setItem('originalOrder', JSON.stringify(storedSongs));
    } else {
      const currentSongIndex = originalOrder.findIndex(
        (song: { url: string | undefined; }) => song.url === currentSong?.url
      );
      updatedSongs = [...originalOrder];
      localStorage.setItem('lastPathSongs', JSON.stringify(updatedSongs));
      setCurrentSong(originalOrder[currentSongIndex]);
      counterSong(originalOrder[currentSongIndex]);
    }
  
    setSongs(updatedSongs);
    setIsShuffled((prevIsShuffled) => !prevIsShuffled);
  };

  const findOriginalIndex = (currentSong: Song, originalOrder: Song[]) => {
    const originalIndex = originalOrder.findIndex(
      (song) => song.url === currentSong.url
    );
    return originalIndex >= 0 ? originalIndex : 0;
  };

  const setSong = async (song: Song | null) => {
    const originalOrder = JSON.parse(localStorage.getItem('originalOrder') || '[]');
  
    if (currentSong && currentSong.url === song?.url && !isShuffled) {
      setCurrentSong(null);
      setTimeout(async () => {
        const originalIndex = findOriginalIndex(song!, originalOrder);
        setCurrentSong(originalOrder[originalIndex]);
        counterSong(originalOrder[originalIndex]);
      }, 0);
    } else {
      setCurrentSong(song);
      counterSong(song);
  
      if (song) {
        updateSong(song);
      }
    }
  };

  return (
    <PlayerContext.Provider value={{ currentSong, setSong, shuffleSongs, songs, setSongs, isShuffled, setIsShuffled }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error();
  }
  return context;
};
