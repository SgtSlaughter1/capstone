import express from 'express';
import axios from 'axios';
import auth from '../middleware/auth.js';
import Favorite from '../models/Favorite.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get popular movies with filters
router.get('/popular', async (req, res) => {
  try {
    const { page = 1, genre, minRating, maxRating, year, sortBy } = req.query;
    
    let url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}`;
    
    if (genre) url += `&with_genres=${genre}`;
    if (minRating) url += `&vote_average.gte=${minRating}`;
    if (maxRating) url += `&vote_average.lte=${maxRating}`;
    if (year) url += `&year=${year}`;
    if (sortBy) url += `&sort_by=${sortBy}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching movies', error: error.message });
  }
});

// Get trending movies
router.get('/trending', async (req, res) => {
  try {
    const { timeWindow = 'week' } = req.query;
    const response = await axios.get(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending movies', error: error.message });
  }
});

// Get movie details
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${req.params.id}?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie details', error: error.message });
  }
});

// Get personalized recommendations
router.get('/recommendations/personalized', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const favorites = await Favorite.find({ user: req.userId }).limit(5);
    const reviews = await Review.find({ user: req.userId }).sort({ rating: -1 }).limit(5);

    let recommendations = [];

    // Get recommendations based on favorite movies
    if (favorites.length > 0) {
      for (const favorite of favorites.slice(0, 3)) {
        try {
          const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${favorite.movieId}/recommendations?api_key=${TMDB_API_KEY}`
          );
          recommendations.push(...response.data.results.slice(0, 5));
        } catch (error) {
          console.error('Error fetching recommendations for movie:', favorite.movieId);
        }
      }
    }

    // Get recommendations based on preferred genres
    if (user.preferences.favoriteGenres && user.preferences.favoriteGenres.length > 0) {
      try {
        const genreIds = user.preferences.favoriteGenres.join(',');
        const response = await axios.get(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds}&sort_by=vote_average.desc&vote_count.gte=100`
        );
        recommendations.push(...response.data.results.slice(0, 10));
      } catch (error) {
        console.error('Error fetching genre-based recommendations');
      }
    }

    // Remove duplicates and movies already in favorites
    const favoriteMovieIds = favorites.map(f => f.movieId);
    const uniqueRecommendations = recommendations
      .filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id) && 
        !favoriteMovieIds.includes(movie.id)
      )
      .slice(0, 20);

    res.json({
      results: uniqueRecommendations,
      total_results: uniqueRecommendations.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching personalized recommendations', error: error.message });
  }
});

// Get genres
router.get('/genres/list', async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching genres', error: error.message });
  }
});

export default router;