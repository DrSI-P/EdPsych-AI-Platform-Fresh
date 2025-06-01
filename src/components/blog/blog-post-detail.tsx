'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Heart, 
  MessageSquare, 
  MoreHorizontal, 
  Share2, 
  ThumbsUp, 
  Bookmark,
  BookmarkPlus,
  Eye,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Printer,
  Flag,
  AlertTriangle
} from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

// Mock data for a blog post
const blogPost = {
  id: 1,
  title: "AI-Powered Differentiation: Transforming Inclusive Education",
  content: `
  <h2>Introduction</h2>
  <p>Inclusive education has long been a cornerstone of effective teaching practise, but the challenge of truly differentiating instruction for diverse learners remains significant. With the advent of artificial intelligence technologies, educators now have powerful new tools to support personalised learning at scale.</p>
  
  <p>This article explores how AI-powered differentiation is transforming inclusive education in UK classrooms, providing evidence-based strategies and practical implementation guidance.</p>
  
  <h2>The Challenge of Differentiation</h2>
  <p>Effective differentiation requires teachers to modify content, process, products, and learning environments based on individual student needs. However, the reality of managing a classroom with 30+ students, each with unique learning profiles, makes this ideal difficult to achieve consistently.</p>
  
  <p>Research by Thompson et al. (2023) found that while 92% of UK teachers believe differentiation is essential for inclusive practise, only 34% feel they can implement it effectively for all students in their classrooms.</p>
  
  <h2>AI-Enhanced Differentiation Approaches</h2>
  <p>Artificial intelligence offers several promising approaches to enhance differentiation:</p>
  
  <h3>1. Adaptive Learning Pathways</h3>
  <p>AI systems can analyse student performance data to create personalised learning pathways that adapt in real-time. For example, the MathsWhiz platform uses AI to adjust problem difficulty, provide targeted hints, and modify the sequence of content based on individual student responses.</p>
  
  <p>A 2024 study by Chen and Williams demonstrated that students using adaptive AI math platforms showed 27% greater improvement in problem-solving skills compared to traditional instruction, with the greatest gains observed among students with learning difficulties.</p>
  
  <h3>2. Multimodal Content Presentation</h3>
  <p>AI tools can transform educational content into multiple formats to match diverse learning preferences. The LiteracyLens platform can automatically convert text into audio, video, simplified language, or visual concept maps based on individual student profiles.</p>
  
  <p>Research by Ahmed et al. (2024) found that when content was presented in AI-matched formats, student engagement increased by 42% and comprehension improved by 31% across all ability levels.</p>
  
  <h3>3. Intelligent Scaffolding</h3>
  <p>AI systems can provide just-in-time scaffolding tailored to individual needs. The WritingCoach tool analyses student writing in real-time, identifying areas where support is needed and providing personalised prompts, sentence starters, or vocabulary suggestions.</p>
  
  <p>Jackson's (2023) research demonstrated that students receiving AI-powered writing scaffolds produced essays with 38% greater structural coherence and 24% more sophisticated vocabulary use compared to traditional scaffolding methods.</p>
  
  <h2>Implementation Considerations</h2>
  <p>While AI offers powerful differentiation capabilities, successful implementation requires careful consideration of several factors:</p>
  
  <h3>Data Privacy and Ethics</h3>
  <p>Schools must ensure that AI systems comply with UK data protection regulations, particularly the special protections afforded to children's data under GDPR. Transparent policies regarding data collection, storage, and usage are essential.</p>
  
  <h3>Teacher Professional Development</h3>
  <p>Effective integration of AI tools requires comprehensive professional development. Teachers need training not only in tool operation but in interpreting AI-generated insights and maintaining pedagogical decision-making authority.</p>
  
  <h3>Maintaining Human Connection</h3>
  <p>AI should enhance rather than replace human interaction. The most successful implementations use AI to handle routine differentiation tasks, freeing teachers to focus on relationship-building, complex concept explanation, and social-emotional support.</p>
  
  <h2>Case Study: Oakridge Primary School</h2>
  <p>Oakridge Primary School in Manchester implemented an AI-powered differentiation system across Years 3-6, focusing on literacy and numeracy. The system provided teachers with daily insights into student progress, automatically generated differentiated resources, and offered personalised feedback to students.</p>
  
  <p>After one academic year, the school reported:</p>
  <ul>
    <li>42% reduction in the attainment gap for disadvantaged pupils</li>
    <li>37% increase in teacher satisfaction regarding differentiation practices</li>
    <li>29% reduction in teacher time spent creating differentiated resources</li>
    <li>Significant improvements in student self-efficacy and engagement</li>
  </ul>
  
  <h2>Conclusion</h2>
  <p>AI-powered differentiation represents a significant advancement in our ability to create truly inclusive educational environments. By leveraging these technologies thoughtfully, educators can move closer to the ideal of meeting each student's unique learning needs while maintaining manageable workloads.</p>
  
  <p>As these tools continue to evolve, ongoing research, ethical vigilance, and teacher-led implementation will be essential to ensure they serve our educational values and priorities.</p>
  
  <h2>References</h2>
  <p>Ahmed, K., Singh, P., & Thompson, R. (2024). Multimodal content presentation and learning outcomes in diverse classrooms. <em>British Journal of Educational Technology, 55</em>(2), 218-237.</p>
  
  <p>Chen, L., & Williams, J. (2024). Adaptive learning platforms and mathematics achievement: A longitudinal study. <em>Journal of Research in Mathematics Education, 42</em>(3), 312-329.</p>
  
  <p>Jackson, M. (2023). AI-powered writing scaffolds: Impact on student composition quality and self-efficacy. <em>Educational Technology Research and Development, 71</em>(4), 589-612.</p>
  
  <p>Thompson, S., Roberts, A., & Davies, H. (2023). Teacher perspectives on differentiation practices in UK primary schools. <em>British Educational Research Journal, 49</em>(1), 78-96.</p>
  `,
  excerpt: "Explore how artificial intelligence is revolutionizing differentiated instruction in UK classrooms, providing personalized support for all learners.",
  author: {
    name: "Dr. Emma Wilson",
    avatar: "/avatars/emma-wilson.jpg",
    role: "Educational Psychologist",
    bio: "Dr. Emma Wilson is an Educational Psychologist with over 15 years of experience working with schools across the UK. Her research focuses on inclusive education practices and the application of technology to support diverse learners."
  },
  publishedAt: "2025-05-15",
  readTime: "8 min read",
  category: "Inclusive Education",
  tags: ["AI", "Differentiation", "Inclusion", "Personalized Learning", "Educational Technology", "SEND"],
  image: "/blog/ai-differentiation.jpg",
  likes: 124,
  comments: 32,
  views: 1850,
  curriculum: ["SEND", "Inclusive Practise", "EdTech"],
  ageRange: ["KS2", "KS3", "KS4"],
  relatedPosts: [
    {
      id: 2,
      title: "Evidence-Based Approaches to Supporting Executive Function",
      excerpt: "A comprehensive review of research-backed strategies for developing executive function skills in primary and secondary education.",
      image: "/blog/executive-function.jpg",
      author: "Prof. James Thompson",
      publishedAt: "2025-05-10"
    },
    {
      id: 5,
      title: "Neurodiversity in the Digital Classroom: Creating Inclusive Spaces",
      excerpt: "Best practices for designing digital learning environments that support and celebrate neurodivergent learners.",
      image: "/blog/neurodiversity-classroom.jpg",
      author: "Dr. Michael Rivera",
      publishedAt: "2025-05-03"
    },
    {
      id: 8,
      title: "The Role of AI in Supporting SEND Students",
      excerpt: "How artificial intelligence is transforming support for students with special educational needs and disabilities.",
      image: "/blog/ai-send-support.jpg",
      author: "Dr. Sarah Chen",
      publishedAt: "2025-04-22"
    }
  ]
};

// Mock comments data
const comments = [
  {
    id: 1,
    author: {
      name: "Jane Smith",
      avatar: "/avatars/jane-smith.jpg",
      role: "Primary Teacher"
    },
    content: "This article provides such valuable insights! I've been struggling with effective differentiation in my Year 4 class, especially with the wide range of abilities. I'm going to look into the LiteracyLens platform mentioned - has anyone here had experience with it?",
    publishedAt: "2025-05-16T09:23:00",
    likes: 8,
    replies: [
      {
        id: 101,
        author: {
          name: "Dr. Emma Wilson",
          avatar: "/avatars/emma-wilson.jpg",
          role: "Educational Psychologist"
        },
        content: "Thank you for your comment, Jane! LiteracyLens has been implemented in several schools I work with, and the feedback has been very positive. I'd be happy to connect you with some teachers who are using it if you'd like to hear about their experiences directly.",
        publishedAt: "2025-05-16T10:15:00",
        likes: 5
      }
    ]
  },
  {
    id: 2,
    author: {
      name: "Robert Johnson",
      avatar: "/avatars/robert-johnson.jpg",
      role: "SENCO"
    },
    content: "As a SENCO, I'm both excited and cautious about AI-powered differentiation. The potential benefits are clear, but I worry about over-reliance on technology and the potential loss of teacher intuition in the differentiation process. How do we ensure we're using these tools to enhance rather than replace professional judgment?",
    publishedAt: "2025-05-16T11:42:00",
    likes: 12,
    replies: [
      {
        id: 102,
        author: {
          name: "Dr. Emma Wilson",
          avatar: "/avatars/emma-wilson.jpg",
          role: "Educational Psychologist"
        },
        content: "Robert, you raise an excellent point. In my experience, the most successful implementations position AI as a decision-support tool rather than a decision-making system. Teacher professional development is crucial here - educators need to understand both the capabilities and limitations of AI systems, and schools need clear protocols for when human judgment should override AI recommendations. The case study schools that saw the best results maintained what they called 'pedagogical sovereignty' while leveraging AI for insights and efficiency.",
        publishedAt: "2025-05-16T12:30:00",
        likes: 9
      },
      {
        id: 103,
        author: {
          name: "Sarah Williams",
          avatar: "/avatars/sarah-williams.jpg",
          role: "EdTech Researcher"
        },
        content: "Adding to Emma's excellent response, we've found in our research that creating structured reflection points where teachers evaluate and potentially override AI recommendations actually strengthens rather than diminishes teacher expertise over time. It becomes a collaborative intelligence model rather than a replacement.",
        publishedAt: "2025-05-16T13:15:00",
        likes: 7
      }
    ]
  },
  {
    id: 3,
    author: {
      name: "Michael Chen",
      avatar: "/avatars/michael-chen.jpg",
      role: "Parent"
    },
    content: "As a parent of a child with dyslexia, I'm intrigued by the multimodal content presentation mentioned. My son struggles with traditional text but thrives with audio and visual learning. Are there any resources you could recommend for parents looking to support this kind of learning at home?",
    publishedAt: "2025-05-17T08:05:00",
    likes: 6,
    replies: []
  }
];

const BlogPostDetail = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blogPost.likes);
  const [commentText, setCommentText] = useState("");
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "This post has been removed from your bookmarks." : "This post has been added to your bookmarks.",
    });
  };
  
  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };
  
  const handleShare = (platform: string) => {
    // In a real implementation, this would share to the specified platform
    toast({
      title: `Shared on ${platform}`,
      description: `This post has been shared on ${platform}.`,
    });
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      toast({
        title: "Comment submitted",
        description: "Your comment has been submitted for moderation.",
      });
      setCommentText("");
      setShowCommentForm(false);
    }
  };
  
  const handleReport = () => {
    toast({
      title: "Content reported",
      description: "Thank you for your report. Our team will review this content.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Badge variant="outline" className="mb-2">
          {blogPost.category}
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">{blogPost.title}</h1>
        <div className="flex flex-wrap items-centre gap-x-4 gap-y-2 mt-4">
          <div className="flex items-centre space-x-2">
            <Avatar>
              <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
              <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{blogPost.author.name}</p>
              <p className="text-xs text-muted-foreground">{blogPost.author.role}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-centre text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(blogPost.publishedAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-centre text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {blogPost.readTime}
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-centre text-sm text-muted-foreground">
            <Eye className="h-4 w-4 mr-1" />
            {blogPost.views} views
          </div>
        </div>
      </div>
      
      <div className="relative">
        <img 
          src={blogPost.image} 
          alt={blogPost.title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <Button variant="secondary" size="sm" onClick={handleBookmark}>
            {isBookmarked ? <Bookmark className="h-4 w-4 mr-2" /> : <BookmarkPlus className="h-4 w-4 mr-2" />}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Share this post</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleShare("Twitter")}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Facebook")}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("LinkedIn")}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Email")}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Link copied",
                  description: "The link has been copied to your clipboard.",
                });
              }}>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("Print")}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {blogPost.tags.map((tag, index) => (
          <Badge key={index} variant="secondary">{tag}</Badge>
        ))}
      </div>
      
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: blogPost.content }} />
      
      <div className="flex items-centre justify-between border-t border-b py-4">
        <div className="flex items-centre space-x-4">
          <Button 
            variant={isLiked ? "default" : "outline"} 
            size="sm" 
            onClick={handleLike}
            className="flex items-centre"
          >
            <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? "fill-white" : ""}`} />
            {likeCount}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-centre"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {blogPost.comments} Comments
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleReport}>
              <Flag className="h-4 w-4 mr-2" />
              Report content
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showCommentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Leave a comment</CardTitle>
            <CardDescription>
              Your comment will be reviewed before being published.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitComment}>
              <Textarea 
                placeholder="Share your thoughts..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => setShowCommentForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardHeader>
              <div className="flex items-centre justify-between">
                <div className="flex items-centre space-x-2">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{comment.author.name}</p>
                    <p className="text-xs text-muted-foreground">{comment.author.role}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.publishedAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" size="sm">
                <ThumbsUp className="h-4 w-4 mr-2" />
                {comment.likes}
              </Button>
              <Button variant="ghost" size="sm">
                Reply
              </Button>
            </CardFooter>
            {comment.replies.length > 0 && (
              <div className="ml-12 space-y-4 px-6 pb-6">
                {comment.replies.map((reply) => (
                  <Card key={reply.id}>
                    <CardHeader>
                      <div className="flex items-centre justify-between">
                        <div className="flex items-centre space-x-2">
                          <Avatar>
                            <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                            <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{reply.author.name}</p>
                            <p className="text-xs text-muted-foreground">{reply.author.role}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.publishedAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p>{reply.content}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        {reply.likes}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blogPost.relatedPosts.map((post) => (
            <Card key={post.id}>
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-40 object-cover"
              />
              <CardHeader>
                <CardTitle className="text-lg">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-xs text-muted-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">{post.publishedAt}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-8">
        <div className="flex items-centre space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
            <AvatarFallback>{blogPost.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{blogPost.author.name}</h3>
            <p className="text-sm text-muted-foreground">{blogPost.author.role}</p>
            <p className="mt-2">{blogPost.author.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
