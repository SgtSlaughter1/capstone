
import React from 'react';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import { useMovies } from '@/contexts/MovieContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites, watchlist } = useMovies();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Login to See Your Favorites</h2>
              <p className="text-gray-400 mb-6">
                Create an account to save your favorite movies and build your watchlist
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/login">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My Collection</h1>
            <p className="text-gray-400">Your favorite movies and watchlist</p>
          </div>

          {/* Favorites Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                <h2 className="text-2xl font-bold text-white">Favorites</h2>
                <span className="bg-red-600 text-white text-sm px-2 py-1 rounded-full">
                  {favorites.length}
                </span>
              </div>
            </div>

            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {favorites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No favorites yet</h3>
                <p className="text-gray-400 mb-4">
                  Start adding movies to your favorites by clicking the heart icon
                </p>
                <Link to="/search">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Search className="h-4 w-4 mr-2" />
                    Discover Movies
                  </Button>
                </Link>
              </div>
            )}
          </section>

          {/* Watchlist Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Watchlist</h2>
                <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                  {watchlist.length}
                </span>
              </div>
            </div>

            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {watchlist.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-800 rounded-lg">
                <div className="h-12 w-12 bg-gray-600 rounded mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">+</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Your watchlist is empty</h3>
                <p className="text-gray-400 mb-4">
                  Add movies to your watchlist to watch them later
                </p>
                <Link to="/search">
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Movies
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
