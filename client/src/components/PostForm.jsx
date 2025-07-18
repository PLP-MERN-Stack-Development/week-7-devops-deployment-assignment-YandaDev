import { useState, useEffect } from 'react';
import { usePosts } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function PostForm({ initialData = {}, categories, loading, isEdit = false, postId }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category || '');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || '');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const { error: postError } = usePosts();
  const { user } = useAuth();

  useEffect(() => {
    setTitle(initialData.title || '');
    setContent(initialData.content || '');
    setCategory(initialData.category || '');
    setTags(initialData.tags?.join(', ') || '');
    if (initialData.featuredImage) {
      setImagePreview(`/uploads/${initialData.featuredImage}`);
    }
  }, [initialData]);

  // Validation logic
  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (title.length > 100) newErrors.title = 'Title must be under 100 characters';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (content.length < 10) newErrors.content = 'Content must be at least 10 characters';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
        return;
      }
      setFeaturedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (tags) {
      formData.append('tags', tags);
    }
    if (featuredImage) {
      formData.append('featuredImage', featuredImage);
    }

    try {
      let result;
      if (isEdit && postId) {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        console.log('Update response status:', response.status);
        console.log('Update response headers:', response.headers.get('content-type'));
        
        if (!response.ok) {
          let errorMessage = 'Failed to update post';
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (jsonError) {
              console.error('Error parsing JSON error response:', jsonError);
              errorMessage = `Server error (${response.status})`;
            }
          } else {
            const textResponse = await response.text();
            console.error('Non-JSON response:', textResponse);
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}`;
          }
          
          throw new Error(errorMessage);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
          console.log('Update success response:', responseData);
          result = { success: true, data: responseData };
        } else {
          console.log('Non-JSON update success response');
          result = { success: true };
        }
      } else {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers.get('content-type'));
        
        if (!response.ok) {
          let errorMessage = 'Failed to create post';
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (jsonError) {
              console.error('Error parsing JSON error response:', jsonError);
              errorMessage = `Server error (${response.status})`;
            }
          } else {
            const textResponse = await response.text();
            console.error('Non-JSON response:', textResponse);
            errorMessage = `Server error (${response.status}): ${textResponse.substring(0, 100)}`;
          }
          
          throw new Error(errorMessage);
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const responseData = await response.json();
          console.log('Success response:', responseData);
          result = { success: true, data: responseData };
        } else {
          console.log('Non-JSON success response');
          result = { success: true };
        }
      }
      
      if (result.success) {
        setErrors({});
        // Navigate to home page after successful post creation
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Post submission error:', error);
      setErrors(prev => ({ ...prev, form: error.message || 'An error occurred' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="backdrop-blur-sm bg-white/90 border-orange-100 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            {isEdit ? 'Edit Your Tech Story' : 'Share Your Tech Story'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your insights for the TechTalkZA community' : 'Contribute to South Africa\'s tech conversation'}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <Input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your tech story"
                className="focus:ring-orange-500 focus:border-orange-500"
                required
              />
              {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Featured Image</label>
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-orange-50 file:to-red-50 file:text-orange-600 hover:file:bg-gradient-to-r hover:file:from-orange-100 hover:file:to-red-100 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              {errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
              {imagePreview && (
                <div className="mt-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your tech story here... Share your insights, experiences, and knowledge with the South African tech community."
                rows={12}
                className="resize-none focus:ring-orange-500 focus:border-orange-500"
                required
              />
              {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="focus:ring-orange-500 focus:border-orange-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="no-categories">No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                {(!categories || categories.length === 0) && (
                  <div className="text-amber-600 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No categories available. Please create categories first.
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <Input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="react, javascript, fintech, startup"
                  className="focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-sm text-gray-500">Separate tags with commas</p>
              </div>
            </div>

            {(errors.form || postError) && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 text-sm">{errors.form || postError}</span>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-lg py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving Story...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {isEdit ? 'Update Story' : 'Publish Story'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostForm;