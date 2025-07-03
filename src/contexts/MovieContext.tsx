
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  original_title: string;
}

interface MovieContextType {
  favorites: Movie[];
  watchlist: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  const addToFavorites = (movie: Movie) => {
    setFavorites(prev => [...prev.filter(m => m.id !== movie.id), movie]);
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(prev => prev.filter(m => m.id !== movieId));
  };

  const addToWatchlist = (movie: Movie) => {
    setWatchlist(prev => [...prev.filter(m => m.id !== movie.id), movie]);
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist(prev => prev.filter(m => m.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(m => m.id === movieId);
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(m => m.id === movieId);
  };

  return (
    <MovieContext.Provider value={{
      favorites,
      watchlist,
      addToFavorites,
      removeFromFavorites,
      addToWatchlist,
      removeFromWatchlist,
      isFavorite,
      isInWatchlist
    }}>
      {children}
    </MovieContext.Provider>
  );
};
