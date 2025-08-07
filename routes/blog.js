const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Mock blog data - in a real app, this would be a database model
const blogs = [
  {
    id: 1,
    title: "How To Build Your Own Workout Routine: Plans, Schedules, and Exercises",
    author: "Steve Kamb",
    content: "Building your own workout routine can seem overwhelming, but it doesn't have to be. This comprehensive guide will walk you through the process of creating a personalized fitness plan that works for your goals, schedule, and fitness level...",
    excerpt: "Explore intelligent workout strategies",
    image: "images/blog/blog1.jpg",
    category: "workout",
    tags: ["workout routine", "fitness planning", "exercise"],
    publishedAt: "2023-12-01",
    readTime: "8 min read",
    url: "https://www.nerdfitness.com/blog/how-to-build-your-own-workout-routine/"
  },
  {
    id: 2,
    title: "6 Beginner Gym Workouts: How to Work Out in a Gym The Right Way!",
    author: "Steve Kamb",
    content: "Starting your fitness journey at the gym can be intimidating, but with the right approach, you can build confidence and see real results. This guide covers everything from proper form to workout structure...",
    excerpt: "Dynamic workouts for holistic fitness",
    image: "images/blog/blog2.jpg",
    category: "beginner",
    tags: ["beginner workout", "gym tips", "fitness"],
    publishedAt: "2023-11-15",
    readTime: "12 min read",
    url: "https://www.nerdfitness.com/blog/a-beginners-guide-to-the-gym-everything-you-need-to-know/"
  },
  {
    id: 3,
    title: "Strength Training For Women: 7 Things You Should Know First Beforehand!",
    author: "Staci Ardison",
    content: "Strength training is essential for women's health and fitness, but there are many misconceptions that can hold you back. Learn the truth about building strength and muscle as a woman...",
    excerpt: "Unleash powerful fitness transformations",
    image: "images/class/crossfit-class.jpg",
    category: "strength",
    tags: ["strength training", "women fitness", "muscle building"],
    publishedAt: "2023-10-20",
    readTime: "10 min read",
    url: "https://www.nerdfitness.com/blog/7-strength-training-myths-every-woman-should-know/"
  }
];

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, tag, author, search, limit = 10, page = 1 } = req.query;
    
    let filteredBlogs = [...blogs];
    
    // Filter by category
    if (category) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by tag
    if (tag) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
      );
    }
    
    // Filter by author
    if (author) {
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredBlogs = filteredBlogs.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        blog.excerpt.toLowerCase().includes(searchLower) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      count: paginatedBlogs.length,
      total: filteredBlogs.length,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(filteredBlogs.length / parseInt(limit)),
        limit: parseInt(limit)
      },
      data: paginatedBlogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get blog post by ID
// @route   GET /api/blog/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
router.get('/categories', optionalAuth, async (req, res) => {
  try {
    const categories = [...new Set(blogs.map(blog => blog.category))];
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get blog tags
// @route   GET /api/blog/tags
// @access  Public
router.get('/tags', optionalAuth, async (req, res) => {
  try {
    const allTags = blogs.flatMap(blog => blog.tags);
    const uniqueTags = [...new Set(allTags)];
    
    res.json({
      success: true,
      count: uniqueTags.length,
      data: uniqueTags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get featured blog posts
// @route   GET /api/blog/featured
// @access  Public
router.get('/featured', optionalAuth, async (req, res) => {
  try {
    // In a real app, this would be based on views, likes, or editorial selection
    const featuredBlogs = blogs.slice(0, 3);
    
    res.json({
      success: true,
      count: featuredBlogs.length,
      data: featuredBlogs
    });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get related blog posts
// @route   GET /api/blog/:id/related
// @access  Public
router.get('/:id/related', optionalAuth, async (req, res) => {
  try {
    const blog = blogs.find(b => b.id === parseInt(req.params.id));
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Find related blogs based on category and tags
    const relatedBlogs = blogs
      .filter(b => b.id !== blog.id)
      .filter(b => 
        b.category === blog.category || 
        b.tags.some(tag => blog.tags.includes(tag))
      )
      .slice(0, 3);
    
    res.json({
      success: true,
      count: relatedBlogs.length,
      data: relatedBlogs
    });
  } catch (error) {
    console.error('Get related blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Search blog posts
// @route   GET /api/blog/search
// @access  Public
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchLower = q.toLowerCase();
    const searchResults = blogs.filter(blog => 
      blog.title.toLowerCase().includes(searchLower) ||
      blog.content.toLowerCase().includes(searchLower) ||
      blog.excerpt.toLowerCase().includes(searchLower) ||
      blog.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      blog.author.toLowerCase().includes(searchLower)
    );
    
    res.json({
      success: true,
      count: searchResults.length,
      query: q,
      data: searchResults.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 