import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Star, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Movie } from "@/contexts/MovieContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/utils";

const apiKey = import.meta.env.VITE_TMDB_API_KEY;

const fetchTrendingMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
  );
  const data = await res.json();
  return data.results;
};

const fetchTopRatedMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`
  );
  const data = await res.json();
  return data.results;
};

const fetchRecentMovies = async () => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`
  );
  const data = await res.json();
  return data.results;
};

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Replace mock queries with real API calls
  const { data: trendingMovies = [] } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingMovies,
  });

  const { data: topRatedMovies = [] } = useQuery({
    queryKey: ["topRated"],
    queryFn: fetchTopRatedMovies,
  });

  const { data: recentMovies = [] } = useQuery({
    queryKey: ["recent"],
    queryFn: fetchRecentMovies,
  });

  const featuredMovie = trendingMovies[0];

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!isAuthenticated) return;
      setLoadingRecs(true);
      try {
        const res = await api.get("/movies/recommendations/personalized");
        setRecommendations(res.data.results || []);
      } catch {
        setRecommendations([]);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecommendations();
  }, [isAuthenticated]);

  return (
    <Layout>
      <div className='relative'>
        {/* Hero Section */}
        {featuredMovie ? (
          <section className='relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden'>
            <div className='absolute inset-0'>
              <img
                src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
                alt={featuredMovie.title}
                className='w-full h-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent' />
            </div>

            <div className='relative z-10 h-full flex items-center'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='max-w-2xl'>
                  <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4'>
                    {featuredMovie.title}
                  </h1>
                  <p className='text-lg md:text-xl text-gray-300 mb-6 line-clamp-3'>
                    {featuredMovie.overview}
                  </p>
                  <div className='flex items-center space-x-4 mb-8'>
                    <div className='flex items-center space-x-1'>
                      <Star className='h-5 w-5 text-yellow-400 fill-yellow-400' />
                      <span className='text-white font-medium'>
                        {featuredMovie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Calendar className='h-5 w-5 text-gray-400' />
                      <span className='text-gray-300'>
                        {new Date(featuredMovie.release_date).getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className='flex space-x-4'>
                    <Link to={`/movie/${featuredMovie.id}`}>
                      <Button size='lg' className='bg-red-600 hover:bg-red-700'>
                        Watch Now
                      </Button>
                    </Link>
                    <Button
                      size='lg'
                      variant='outline'
                      className='border-white text-white hover:bg-white hover:text-black'
                    >
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className='relative h-96 md:h-[500px] lg:h-[600px] flex items-center justify-center bg-gray-900'>
            <span className='text-white text-xl'>Loading...</span>
          </section>
        )}

        {/* Search Section */}
        <section className='py-12 bg-gray-800'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-8'>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>
                Discover Your Next Favorite Movie
              </h2>
              <p className='text-gray-400 max-w-2xl mx-auto'>
                Search through thousands of movies to find exactly what you're
                looking for
              </p>
            </div>

            <form onSubmit={handleSearch} className='max-w-2xl mx-auto'>
              <div className='flex'>
                <Input
                  type='text'
                  placeholder='Search movies...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                />
                <Button
                  type='submit'
                  className='ml-2 bg-red-600 hover:bg-red-700'
                >
                  <Search className='h-4 w-4' />
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Movie Sections */}
        <div className='bg-gray-900 py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
            {/* Trending Movies */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center space-x-2'>
                  <TrendingUp className='h-6 w-6 text-red-500' />
                  <h2 className='text-2xl font-bold text-white'>
                    Trending Now
                  </h2>
                </div>
                <Link to='/search?category=trending'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white'
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {trendingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size='small' />
                ))}
              </div>
            </section>

            {/* Top Rated Movies */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center space-x-2'>
                  <Star className='h-6 w-6 text-yellow-400 fill-yellow-400' />
                  <h2 className='text-2xl font-bold text-white'>Top Rated</h2>
                </div>
                <Link to='/search?category=top_rated'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white'
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {topRatedMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size='small' />
                ))}
              </div>
            </section>

            {/* Recent Releases */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center space-x-2'>
                  <Calendar className='h-6 w-6 text-blue-400' />
                  <h2 className='text-2xl font-bold text-white'>
                    Recent Releases
                  </h2>
                </div>
                <Link to='/search?category=recent'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='text-gray-400 hover:text-white'
                  >
                    View All
                  </Button>
                </Link>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
                {recentMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size='small' />
                ))}
              </div>
            </section>

            {/* Personalized Recommendations Section */}
            {isAuthenticated && (
              <section className='py-12 bg-gray-900'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <h2 className='text-2xl md:text-3xl font-bold text-white mb-6'>
                    Recommended For You
                  </h2>
                  {loadingRecs ? (
                    <p className='text-gray-400'>Loading recommendations...</p>
                  ) : recommendations.length === 0 ? (
                    <p className='text-gray-400'>
                      No personalized recommendations yet. Add favorites or set
                      preferences!
                    </p>
                  ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
                      {recommendations.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
