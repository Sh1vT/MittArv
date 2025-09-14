import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { BookmarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Bookmarks = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getBookmarks();
      setBookmarks(response.data);
    } catch (err) {
      setError('Failed to fetch bookmarks');
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookmarkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h1>
              <p className="text-gray-600 mb-8">You need to be logged in to view your bookmarks.</p>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading your bookmarks...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <BookmarkIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
          </div>
          <p className="text-gray-600">Posts you've saved for later reading</p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
              <button 
                onClick={fetchBookmarks}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookmarkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookmarks yet</h2>
              <p className="text-gray-600 mb-6">Start bookmarking posts you like to save them for later!</p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Explore Posts
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
