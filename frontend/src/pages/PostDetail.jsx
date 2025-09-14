import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon, 
  HeartIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(slug);
      setPost(response.data);
      setIsLiked(response.data.likes?.includes(user?._id) || false);
      setLikesCount(response.data.likes?.length || 0);
    } catch (err) {
      setError('Post not found');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Optimistic update
    const newLiked = !isLiked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newLiked);
    setLikesCount(newLikesCount);

    // TODO: Implement like/unlike API call
  };

  const handleDelete = async () => {
    if (!post || post.author._id !== user?._id) return;
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post._id);
        navigate('/');
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content.replace(/<[^>]*>/g, '').substring(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
              <p className="text-gray-600 mb-8">The post you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = post.author._id === user?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <article className="card overflow-hidden">
          {post.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    {post.author.profilePic ? (
                      <img 
                        src={post.author.profilePic} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full ring-2 ring-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{post.author.name}</p>
                      <p className="text-gray-500">Author</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>

                {isAuthor && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate(`/edit/${post.slug}`)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                    >
                      <TrashIcon className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                  >
                    <TagIcon className="w-4 h-4" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isLiked 
                      ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5" />
                  ) : (
                    <HeartIcon className="w-5 h-5" />
                  )}
                  <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <ChatBubbleLeftIcon className="w-5 h-5" />
                  <span>{post.comments?.length || 0} {post.comments?.length === 1 ? 'comment' : 'comments'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ShareIcon className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
