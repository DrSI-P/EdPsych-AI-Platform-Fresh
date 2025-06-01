import React from 'react';

interface BlogPostViewProps {
  post: {
    id: string;
    title: string;
    content: string;
    author?: {
      name?: string;
      image?: string;
    };
    createdAt: string;
    publishedAt?: string;
    summary?: string;
    featuredImage?: string;
    likeCount?: number;
  };
  relatedPosts?: any[];
  onLike?: () => void;
  isLikeLoading?: boolean;
}

export function BlogPostView({ post, relatedPosts = [], onLike, isLikeLoading = false }: BlogPostViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {post.featuredImage && (
        <div className="mb-6">
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="flex items-center gap-3 mb-6 text-gray-600">
        {post.author?.image && (
          <img 
            src={post.author.image} 
            alt={post.author.name || 'Author'} 
            className="w-10 h-10 rounded-full"
          />
        )}
        <div>
          <p>By {post.author?.name || 'Unknown'}</p>
          <p className="text-sm">
            {post.publishedAt 
              ? `Published on ${new Date(post.publishedAt).toLocaleDateString('en-GB')}`
              : `Created on ${new Date(post.createdAt).toLocaleDateString('en-GB')}`
            }
          </p>
        </div>
      </div>
      
      {post.summary && (
        <div className="bg-blue-50 p-4 rounded-md mb-6 text-blue-800 italic">
          {post.summary}
        </div>
      )}
      
      <div 
        className="prose prose-blue max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
      
      <div className="flex items-center gap-4 border-t border-b py-4 my-8">
        <button
          onClick={onLike}
          disabled={isLikeLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-md transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{isLikeLoading ? 'Liking...' : `${post.likeCount || 0} Likes`}</span>
        </button>
      </div>
      
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="border rounded-lg overflow-hidden">
                {relatedPost.featuredImage && (
                  <img 
                    src={relatedPost.featuredImage} 
                    alt={relatedPost.title} 
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold mb-2">{relatedPost.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    By {relatedPost.author?.name || 'Unknown'} on {' '}
                    {new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString('en-GB')}
                  </p>
                  <a 
                    href={`/blog/${relatedPost.slug}`} 
                    className="text-blue-600 hover:underline"
                  >
                    Read more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
