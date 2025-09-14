  import { useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useAuth } from '../contexts/AuthContext';
  import { postsAPI } from '../services/api';
  import { 
    ArrowLeftIcon, 
    PhotoIcon,
    EyeIcon,
    DocumentTextIcon,
    TagIcon,
    SparklesIcon,
    PlusIcon,
    XMarkIcon
  } from '@heroicons/react/24/outline';

  const CreatePost = () => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      tags: '',
      image: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [tagsList, setTagsList] = useState([]);
    
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return null;
    }

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const addTag = (e) => {
      e.preventDefault();
      if (tagInput.trim() && !tagsList.includes(tagInput.trim()) && tagsList.length < 5) {
        const newTag = tagInput.trim();
        setTagsList([...tagsList, newTag]);
        setTagInput('');
      }
    };

    const removeTag = (tagToRemove) => {
      setTagsList(tagsList.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
        const postData = {
          title: formData.title,
          content: formData.content,
          tags: tagsList,
          image: formData.image || ''
        };

        const response = await postsAPI.createPost(postData);
        navigate(`/post/${response.data.slug}`);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to create post');
      } finally {
        setLoading(false);
      }
    };

    const wordCount = formData.content.split(' ').filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-all duration-200 mb-6 hover:translate-x-1 group"
            >
              <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Create New Story</h1>
                <p className="text-secondary-600 text-lg">Share your thoughts with the community</p>
              </div>
              
              {/* Preview Toggle */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-secondary-500">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{readingTime} min read</span>
                </div>
                <button
                  onClick={() => setPreview(!preview)}
                  className={`btn ${preview ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  {preview ? 'Edit' : 'Preview'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="card-elevated">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center space-x-3 animate-slide-up">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-secondary-700 mb-3">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What's your story about?"
                      className="form-input text-xl font-semibold"
                    />
                    <p className="mt-2 text-sm text-secondary-500">
                      Make it compelling and descriptive
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-secondary-700 mb-3">
                      Content *
                    </label>
                    {preview ? (
                      <div className="min-h-[400px] p-6 border border-secondary-200 rounded-2xl bg-secondary-50">
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
                      </div>
                    ) : (
                      <textarea
                        id="content"
                        name="content"
                        required
                        rows={16}
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Share your story, thoughts, or insights..."
                        className="form-textarea text-lg leading-relaxed scrollbar-custom"
                      />
                    )}
                    <p className="mt-2 text-sm text-secondary-500">
                      You can use basic HTML tags for formatting (e.g., &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;, &lt;p&gt;)
                    </p>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-semibold text-secondary-700 mb-3">
                      Featured Image URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                        className="form-input pl-12"
                      />
                      <PhotoIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    </div>
                    <p className="mt-2 text-sm text-secondary-500">
                      Optional: Add a featured image to make your post more engaging
                    </p>
                  </div>

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-semibold text-secondary-700 mb-3">
                        Image Preview
                      </label>
                      <div className="border border-secondary-200 rounded-2xl overflow-hidden shadow-soft">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-8 border-t border-secondary-200">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="btn btn-secondary btn-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary btn-lg"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Publishing...</span>
                        </div>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          Publish Story
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tags */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-primary-600" />
                    Tags
                  </h3>
                  
                  <div className="space-y-4">
                    <form onSubmit={addTag} className="flex space-x-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag..."
                        className="form-input flex-1 text-sm"
                        maxLength="20"
                      />
                      <button
                        type="submit"
                        disabled={!tagInput.trim() || tagsList.length >= 5}
                        className="btn btn-primary btn-sm px-3"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </form>
                    
                    <div className="flex flex-wrap gap-2">
                      {tagsList.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full border border-primary-200"
                        >
                          <span>#{tag}</span>
                          <button
                            onClick={() => removeTag(tag)}
                            className="text-primary-500 hover:text-primary-700 transition-colors"
                          >
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-xs text-secondary-500">
                      {tagsList.length}/5 tags • Tags help others discover your content
                    </p>
                  </div>
                </div>
              </div>

              {/* Writing Tips */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Writing Tips
                  </h3>
                  <div className="space-y-3 text-sm text-secondary-600">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Write a compelling title that captures attention</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Use clear, concise language and short paragraphs</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Add relevant tags to help others find your content</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Include a featured image to make your post stand out</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="card">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Words</span>
                      <span className="text-sm font-semibold text-secondary-900">{wordCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Reading Time</span>
                      <span className="text-sm font-semibold text-secondary-900">{readingTime} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Characters</span>
                      <span className="text-sm font-semibold text-secondary-900">{formData.content.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary-600">Tags</span>
                      <span className="text-sm font-semibold text-secondary-900">{tagsList.length}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CreatePost;
