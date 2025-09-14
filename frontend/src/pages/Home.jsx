import { useState, useEffect } from 'react';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import { 
  MagnifyingGlassIcon, 
  SparklesIcon,
  FireIcon,
  // TrendingUpIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ClockIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('latest');

  const fetchPosts = async (page = 1, search = '', sort = 'latest') => {
    try {
      setLoading(true);
      const response = await postsAPI.getPosts({
        page,
        limit: 6,
        search: search || undefined,
        sort
      });
      
      setPosts(response.data.posts);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1, searchTerm, sortBy);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    fetchPosts(1, searchTerm, newSort);
  };

  const handlePageChange = (page) => {
    fetchPosts(page, searchTerm, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
              <div className="text-center">
                <p className="text-secondary-600 text-lg font-medium">Loading amazing stories...</p>
                <p className="text-secondary-500 text-sm mt-1">Discovering the best content for you</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Welcome Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full shadow-soft border border-white/30">
                <SparklesIcon className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome to MittArv
                </span>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-secondary-900 mb-8 leading-tight">
              Discover Amazing
              <br />
              <span className="gradient-text animate-fade-in">Stories</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-secondary-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Share your thoughts, connect with a community of writers, and explore inspiring content from around the world.
            </p>
            
            {/* Search Section */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative glass rounded-2xl p-2 border border-white/30">
                  <div className="flex">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search posts, topics, or authors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-4 text-lg bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-secondary-400"
                      />
                      <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-secondary-400" />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary px-8 py-4 text-lg rounded-xl ml-2"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Latest Stories</h2>
            <p className="text-secondary-600">Discover fresh content from our community</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-xl border border-white/20">
              <FunnelIcon className="w-4 h-4 text-secondary-500" />
              <span className="text-sm font-medium text-secondary-700">Sort by:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { key: 'latest', label: 'Latest', icon: ClockIcon },
                { key: 'trending', label: 'Trending', icon: TrendingUpIcon },
                { key: 'popular', label: 'Popular', icon: FireIcon },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleSortChange(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    sortBy === key
                      ? 'bg-primary-600 text-white shadow-medium'
                      : 'glass text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {error ? (
          <div className="text-center py-16">
            <div className="glass max-w-md mx-auto p-8 rounded-2xl border border-red-200/50">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-red-900 mb-4">Oops! Something went wrong</h3>
              <p className="text-red-600 text-lg font-medium mb-6">{error}</p>
              <button 
                onClick={() => fetchPosts()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="glass max-w-md mx-auto p-8 rounded-2xl border border-white/20">
              <div className="w-20 h-20 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-secondary-400" />
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">No posts found</h3>
              <p className="text-secondary-600 text-lg mb-6">
                {searchTerm ? 'Try adjusting your search terms or explore different topics' : 'Be the first to share an amazing story with our community!'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    fetchPosts();
                  }}
                  className="btn btn-secondary mb-4"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
              {posts.map((post, index) => (
                <div key={post._id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2 glass px-6 py-4 rounded-2xl border border-white/20">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-ghost btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          currentPage === index + 1
                            ? 'bg-primary-600 text-white shadow-medium'
                            : 'text-secondary-700 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-ghost btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
