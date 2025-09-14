import { Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  UserIcon, 
  TagIcon, 
  HeartIcon, 
  ChatBubbleLeftIcon,
  BookmarkIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 150);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement share functionality
  };

  const readingTime = Math.ceil(stripHtml(post.content).split(' ').length / 200);

  return (
    <article className="card-elevated group overflow-hidden hover:scale-[1.02] transition-all duration-300">
      {/* Image */}
      {post.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Reading Time Badge */}
          <div className="absolute top-4 right-4 glass-dark px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-3 h-3 text-white" />
              <span className="text-xs text-white font-medium">{readingTime} min read</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {post.author?.profilePic ? (
                <img 
                  src={post.author.profilePic} 
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full ring-2 ring-primary-100 hover:ring-primary-200 transition-all duration-200"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center shadow-soft">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-secondary-800 hover:text-primary-600 transition-colors cursor-pointer">
                {post.author?.name}
              </span>
              <div className="flex items-center space-x-2 text-xs text-secondary-500">
                <CalendarIcon className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleBookmark}
              className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              {isBookmarked ? (
                <BookmarkSolidIcon className="w-4 h-4 text-primary-600" />
              ) : (
                <BookmarkIcon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
          <Link to={`/post/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {/* Content Preview */}
        <p className="text-secondary-600 mb-6 line-clamp-3 leading-relaxed">
          {stripHtml(post.content)}...
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full hover:bg-primary-100 transition-colors duration-200 cursor-pointer border border-primary-200"
              >
                <TagIcon className="w-3 h-3" />
                <span>#{tag}</span>
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-600 text-xs font-semibold rounded-full border border-secondary-200">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
          <Link 
            to={`/post/${post.slug}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm transition-all duration-200 hover:translate-x-1 group/link"
          >
            <span>Read more</span>
            <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-sm text-secondary-500 hover:text-red-500 transition-colors duration-200 group/like"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500 animate-bounce-subtle" />
              ) : (
                <HeartIcon className="w-5 h-5 group-hover/like:scale-110 transition-transform duration-200" />
              )}
              <span className="font-medium">{likeCount}</span>
            </button>
            <div className="flex items-center space-x-1 text-sm text-secondary-500">
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="font-medium">{post.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
