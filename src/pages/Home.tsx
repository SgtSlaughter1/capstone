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

// Mock data for demonstration - replace with actual API calls
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    overview:
      "Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
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
    original_title: "Avatar: The Way of Water",
  },
  {
    id: 2,
    title: "Black Panther: Wakanda Forever",
    overview:
      "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T'Challa's death.",
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
    original_title: "Black Panther: Wakanda Forever",
  },
  {
    id: 3,
    title: "Top Gun: Maverick",
    overview:
      "After more than thirty years of service as one of the Navy's top aviators, and dodging the advancement in rank that would ground him, Pete 'Maverick' Mitchell finds himself training a detachment of TOP GUN graduates for a specialized mission the likes of which no living pilot has ever seen.",
    poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    backdrop_path: "/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
    release_date: "2022-05-24",
    vote_average: 8.3,
    vote_count: 7892,
    genre_ids: [28, 18],
    popularity: 1523.144,
    adult: false,
    video: false,
    original_language: "en",
    original_title: "Top Gun: Maverick",
  },
  {
    id: 4,
    title: "The Batman",
    overview:
      "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    poster_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    backdrop_path: "/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    release_date: "2022-03-01",
    vote_average: 7.8,
    vote_count: 9234,
    genre_ids: [80, 18, 53],
    popularity: 1234.567,
    adult: false,
    video: false,
    original_language: "en",
    original_title: "The Batman",
  },
  {
    id: 5,
    title: "Dune",
    overview:
      "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    backdrop_path: "/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
    release_date: "2021-09-15",
    vote_average: 8.0,
    vote_count: 12543,
    genre_ids: [878, 12],
    popularity: 987.654,
    adult: false,
    video: false,
    original_language: "en",
    original_title: "Dune",
  },
  {
    id: 6,
    title: "Spider-Man: No Way Home",
    overview:
      "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    backdrop_path: "/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
    release_date: "2021-12-15",
    vote_average: 8.4,
    vote_count: 15678,
    genre_ids: [28, 12, 878],
    popularity: 2345.123,
    adult: false,
    video: false,
    original_language: "en",
    original_title: "Spider-Man: No Way Home",
  },
];

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

  // Mock queries - replace with actual API calls
  const { data: trendingMovies = mockMovies.slice(0, 6) } = useQuery({
    queryKey: ["trending"],
    queryFn: () => Promise.resolve(mockMovies.slice(0, 6)),
  });

  const { data: topRatedMovies = mockMovies.slice(2, 6) } = useQuery({
    queryKey: ["topRated"],
    queryFn: () => Promise.resolve(mockMovies.slice(2, 6)),
  });

  const { data: recentMovies = mockMovies.slice(1, 5) } = useQuery({
    queryKey: ["recent"],
    queryFn: () => Promise.resolve(mockMovies.slice(1, 5)),
  });

  const featuredMovie = mockMovies[0];

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
