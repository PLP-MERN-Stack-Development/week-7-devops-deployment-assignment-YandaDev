const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

// TechTalkZA Categories - South African tech community focused
const categories = [
  {
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack web development using React, Vue, Angular, Node.js, and more'
  },
  {
    name: 'Mobile Development',
    description: 'iOS, Android, React Native, Flutter, and cross-platform mobile app development'
  },
  {
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence, machine learning, data science, and ML engineering'
  },
  {
    name: 'Cloud & DevOps',
    description: 'Cloud computing, AWS, Azure, Google Cloud, Docker, Kubernetes, CI/CD, and DevOps practices'
  },
  {
    name: 'Blockchain & Crypto',
    description: 'Blockchain technology, cryptocurrency, DeFi, NFTs, and Web3 development'
  },
  {
    name: 'Data Science',
    description: 'Data analysis, big data, data visualization, Python, R, and statistical modeling'
  },
  {
    name: 'Cybersecurity',
    description: 'Information security, ethical hacking, penetration testing, and cybersecurity best practices'
  },
  {
    name: 'Fintech',
    description: 'Financial technology, digital banking, payment systems, and fintech innovation in South Africa'
  },
  {
    name: 'Startup & Entrepreneurship',
    description: 'Tech startups, entrepreneurship, business strategy, and startup ecosystem in South Africa'
  },
  {
    name: 'Programming Languages',
    description: 'JavaScript, Python, Java, C#, Go, Rust, and other programming languages'
  },
  {
    name: 'UI/UX Design',
    description: 'User interface design, user experience, design systems, and product design'
  },
  {
    name: 'Career & Skills',
    description: 'Tech careers, skill development, interviews, freelancing, and professional growth'
  },
  {
    name: 'Tech News & Trends',
    description: 'Latest tech news, industry trends, and emerging technologies'
  },
  {
    name: 'Open Source',
    description: 'Open source projects, contributions, and community-driven development'
  },
  {
    name: 'South African Tech',
    description: 'Tech scene in South Africa, local companies, events, and community initiatives'
  }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techtalk-za-blog');
    console.log('✅ Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🧹 Cleared existing categories');

    // Insert new categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`🎯 Successfully seeded ${insertedCategories.length} categories:`);
    
    insertedCategories.forEach(category => {
      console.log(`   - ${category.name} (ID: ${category._id})`);
    });

    console.log('\n🎉 Categories seeded successfully!');
    console.log('💡 You can now create posts with these categories.');
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedCategories();
