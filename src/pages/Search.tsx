
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { Movie } from '@/contexts/MovieContext';

// Mock data - replace with actual API calls
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    overview: "Set more than a decade after the events of the first film...",
    poster_path: "/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    backdrop_path: "/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
    release_date: "2022-12-14",
    vote_average: 7.6,
    vote_count: 8234,
    genre_ids: [878, 12, 28],
    popularity: 2841.323,
    adult: false,
    video: false,
    original_language: "en",
    original_title: "Avatar: The Way of Water"
  },
  {
    id: 2,
    title: "Black Panther: Wakanda Forever",
    overview: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation...",
    poster_path: "/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
    backdrop_path: "/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
    release_date: "2022-11-09",
    vote_average: 7.3,
    vote_count: 4521,
    genre_ids: [28, 12, 18],
    popularity: 1834.212,
    adult: false,
    video: false,
    original_language: "en",
    original_title: "Black Panther: Wakanda Forever"
  }
];

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [sortBy, setSortBy] = useState('popularity');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query: string) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual search
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data based on search query
      const filteredMovies = mockMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filteredMovies);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch(searchQuery.trim());
    }
  };

  const clearFilters = () => {
    setSortBy('popularity');
    setYearFilter('');
    setRatingFilter('');
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-6">Search Movies</h1>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search for movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-lg py-3"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700 px-8"
                  disabled={isLoading}
                >
                  <SearchIcon className="h-5 w-5 mr-2" />
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </form>

            {/* Filters Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              {searchQuery && (
                <p className="text-gray-400">
                  {isLoading ? 'Searching...' : `Found ${results.length} results for "${searchQuery}"`}
                </p>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="release_date">Release Date</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Any year" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="">Any year</SelectItem>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rating
                    </label>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="">Any rating</SelectItem>
                        <SelectItem value="9">9+ Stars</SelectItem>
                        <SelectItem value="8">8+ Stars</SelectItem>
                        <SelectItem value="7">7+ Stars</SelectItem>
                        <SelectItem value="6">6+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="border-gray-700 text-gray-300 hover:bg-gray-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-400 mt-4">Searching for movies...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {results.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                <p className="text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Start your search</h3>
                <p className="text-gray-400">
                  Enter a movie title or keyword to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
