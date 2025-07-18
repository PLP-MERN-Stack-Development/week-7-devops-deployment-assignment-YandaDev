const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const router = express.Router();

// Default categories for seeding
const defaultCategories = [
  { name: 'Technology', description: 'Posts about technology, programming, and software development' },
  { name: 'Web Development', description: 'Frontend and backend web development topics' },
  { name: 'Programming', description: 'General programming concepts and tutorials' },
  { name: 'JavaScript', description: 'JavaScript programming language and frameworks' },
  { name: 'React', description: 'React.js library and ecosystem' },
  { name: 'Node.js', description: 'Node.js runtime and server-side development' },
  { name: 'Database', description: 'Database design, management, and optimization' },
  { name: 'DevOps', description: 'Development operations, deployment, and infrastructure' },
  { name: 'AI & Machine Learning', description: 'Artificial intelligence and machine learning topics' },
  { name: 'Design', description: 'UI/UX design, graphics, and user experience' },
  { name: 'Career', description: 'Career advice, job searching, and professional development' },
  { name: 'Tutorials', description: 'Step-by-step tutorials and how-to guides' }
];

// GET /api/categories - Get all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    
    // If no categories exist, auto-seed them
    if (categories.length === 0) {
      console.log('No categories found, seeding default categories...');
      const seededCategories = await Category.insertMany(defaultCategories);
      console.log(`Seeded ${seededCategories.length} categories`);
      return res.json(seededCategories);
    }
    
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /api/categories/seed - Manual seed endpoint for admin use
router.post('/seed', async (req, res, next) => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert default categories
    const seededCategories = await Category.insertMany(defaultCategories);
    
    res.json({
      message: `Successfully seeded ${seededCategories.length} categories`,
      categories: seededCategories
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/categories - Create a new category
router.post(
  '/',
  body('name').notEmpty().isLength({ max: 50 }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }
      
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      console.error('Category creation error:', err);
      next(err);
    }
  }
);

module.exports = router;