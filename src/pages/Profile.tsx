import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useMovies } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Heart, Plus, Star, Calendar, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { favorites } = useMovies();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    avatar_url: user?.avatar_url || '',
    preferences: user?.preferences || {},
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleEditClick = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm({
      username: user?.username || '',
      avatar_url: user?.avatar_url || '',
      preferences: user?.preferences || {},
    });
    setError('');
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(form);
      setEditing(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
            <p className="text-gray-400 mb-6">
              You need to be logged in to view your profile
            </p>
            <Link to="/login">
              <Button className="bg-red-600 hover:bg-red-700">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const joinDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const stats = [
    {
      icon: Heart,
      label: 'Favorites',
      value: favorites.length,
      color: 'text-red-500'
    },
    {
      icon: Plus,
      label: 'Watchlist', 
      value: 0,
      color: 'text-blue-500'
    },
    {
      icon: Star,
      label: 'Reviews',
      value: 0,
      color: 'text-yellow-500'
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Profile Header */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 bg-red-600">
                  <AvatarFallback className="text-white text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl text-white mb-2">
                    {user.username}
                  </CardTitle>
                  <CardDescription className="text-gray-400 mb-4">
                    {user.email}
                  </CardDescription>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {joinDate}</span>
                  </div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full bg-gray-700 ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-gray-400">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
              <CardDescription className="text-gray-400">
                Your latest interactions with movies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {favorites.slice(0, 3).map((movie) => (
                  <div key={movie.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-12 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{movie.title}</h4>
                      <p className="text-gray-400 text-sm">Added to favorites</p>
                    </div>
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </div>
                ))}
                
                {favorites.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No recent activity</p>
                    <Link to="/search" className="text-red-500 hover:text-red-400 text-sm">
                      Start discovering movies
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link to="/favorites">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Heart className="h-4 w-4 mr-2" />
                    View Favorites
                  </Button>
                </Link>
                <Link to="/search">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Discover Movies
                  </Button>
                </Link>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Movies
                </Button>
              </div>
            </CardContent>
          </Card>

          {editing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1">Avatar URL</label>
                    <input
                      type="text"
                      name="avatar_url"
                      value={form.avatar_url}
                      onChange={handleChange}
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                  </div>
                  {/* Add more fields for preferences as needed */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" className="border-gray-600 text-gray-300" onClick={handleCancel} disabled={saving}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
