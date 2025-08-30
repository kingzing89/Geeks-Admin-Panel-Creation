import express from 'express';
import AdminJS from 'adminjs';
import { buildAuthenticatedRouter } from '@adminjs/express';
import { DefaultAuthProvider } from 'adminjs';
import { ComponentLoader } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Import all your models
import { Category } from './../models/Category.js';
import { Course } from './../models/Course.js';
import { CourseProgress } from './../models/CourseProgress.js';
import { CourseReview } from './../models/CourseReview.js';
import { Documentation } from './../models/Documentation.js';
import { Enrollment } from './../models/Enrollment.js';
import { User } from './../models/User.js';

dotenv.config();

const port = process.env.PORT || 3000;

// Register AdminJS adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// Initialize database
const initializeDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log('✅ Database connected successfully');
    
    // Verify models are loaded
    console.log('📋 Loaded models:', {
      Category: Category.modelName,
      Course: Course.modelName,
      User: User.modelName,
      Documentation: Documentation.modelName,
      CourseProgress: CourseProgress.modelName,
      CourseReview: CourseReview.modelName,
      Enrollment: Enrollment.modelName,
    });
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// Component loader
const componentLoader = new ComponentLoader();

// Auth provider
const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate: async ({ email, password }) => {
    console.log('Authentication attempt for:', email);
    
    // Default admin credentials
    if (email === 'admin@courseplatform.com' && password === 'admin@2025!secure') {
      return { 
        email: 'admin@courseplatform.com', 
        role: 'super-admin',
        name: 'Super Admin'
      };
    }
    return null;
  },
});

const start = async () => {
  const app = express();

  await initializeDb();

  const admin = new AdminJS({
    componentLoader,
    rootPath: '/admin',
    // Add explicit database configuration
    databases: [mongoose],
    resources: [
      // Categories Management
      {
        resource: Category,
        options: {
          navigation: { 
            name: 'Content Management', 
            icon: 'Grid',
            show: true // Explicitly show navigation
          },
          id: 'categories', // Add explicit ID
          listProperties: ['title', 'slug', 'description', 'order', 'createdAt'],
          filterProperties: ['title', 'slug'],
          editProperties: ['title', 'slug', 'description', 'content', 'bgColor', 'icon', 'order'],
          properties: {
            title: { 
              isTitle: true,
              description: 'Category name',
            },
            slug: {
              description: 'URL-friendly identifier (lowercase, no spaces)',
            },
            description: {
              type: 'textarea',
              description: 'Short category description',
            },
            content: {
              type: 'textarea',
              description: 'Detailed category content',
            },
            bgColor: {
              description: 'CSS gradient or color classes',
            },
            icon: {
              description: 'Icon identifier',
            },
            order: {
              type: 'number',
              description: 'Display order (lower numbers appear first)',
            },
            createdAt: {
              isVisible: { edit: false, new: false },
            },
            updatedAt: {
              isVisible: { edit: false, new: false },
            },
          },
        },
      },

      // Courses Management
      {
        resource: Course,
        options: {
          navigation: { 
            name: 'Content Management', 
            icon: 'BookOpen',
            show: true
          },
          id: 'courses',
          listProperties: ['title', 'categoryId', 'level', 'rating', 'studentCount', 'isPremium', 'isPublished', 'createdAt'],
          filterProperties: ['title', 'level', 'categoryId', 'isPremium', 'isPublished', 'instructor'],
          editProperties: [
            'title',
            'description',
            'categoryId',
            'level',
            'rating',
            'studentCount',
            'duration',
            'instructor',
            'bgColor',
            'price',
            'isPremium',
            'isPublished'
          ],
          properties: {
            title: { 
              isTitle: true,
              description: 'Course title',
            },
            description: {
              type: 'textarea',
              description: 'Detailed course description',
            },
            categoryId: {
              reference: 'categories',
              description: 'Course category',
            },
            level: {
              availableValues: [
                { value: 'BEGINNER', label: 'Beginner' },
                { value: 'INTERMEDIATE', label: 'Intermediate' },
                { value: 'ADVANCED', label: 'Advanced' },
                { value: 'BEGINNER_TO_ADVANCE', label: 'Beginner to Advance' },
              ],
            },
            rating: {
              type: 'number',
              description: 'Course rating (0-5)',
            },
            studentCount: {
              type: 'number',
              description: 'Number of enrolled students',
            },
            price: {
              type: 'number',
              description: 'Course price (leave empty for free)',
            },
            bgColor: {
              description: 'Tailwind CSS gradient classes',
            },
            instructor: {
              description: 'Course instructor name',
            },
            isPremium: {
              description: 'Is this a premium course?',
            },
            isPublished: {
              description: 'Is course published and visible to users?',
            },
            createdAt: {
              isVisible: { edit: false, new: false },
            },
            updatedAt: {
              isVisible: { edit: false, new: false },
            },
          },
          actions: {
            delete: {
              guard: 'Are you sure you want to delete this course?',
            },
          },
        },
      },

      // Documentation Management
      {
        resource: Documentation,
        options: {
          navigation: { 
            name: 'Documentation', 
            icon: 'Book',
            show: true
          },
          id: 'documentation',
          listProperties: ['title', 'category', 'slug', 'readTime', 'isPublished', 'updatedAt'],
          filterProperties: ['title', 'category', 'isPublished'],
          editProperties: [
            'title',
            'slug',
            'category',
            'description',
            'content',
            'readTime',
            'keyFeatures',
            'codeExamples',
            'quickLinks',
            'proTip',
            'isPublished'
          ],
          properties: {
            title: { 
              isTitle: true,
              description: 'Documentation title',
            },
            slug: {
              description: 'URL slug (lowercase, no spaces)',
            },
            category: {
              description: 'Documentation category',
            },
            content: {
              type: 'textarea',
              description: 'Main documentation content',
            },
            keyFeatures: {
              type: 'mixed',
              description: 'Array of key features',
            },
            codeExamples: {
              type: 'mixed',
              description: 'Code examples with title, code, and description',
            },
            quickLinks: {
              type: 'textarea',
              description: 'Quick navigation links (JSON format: [{"title": "Link Name", "url": "/path", "description": "Link description"}])',
            },
            createdAt: {
              isVisible: { edit: false, new: false },
            },
            updatedAt: {
              isVisible: { edit: false, new: false },
            },
          },
        },
      },

      // User Management
      {
        resource: User,
        options: {
          navigation: { 
            name: 'User Management', 
            icon: 'Users',
            show: true
          },
          id: 'users',
          listProperties: ['email', 'username', 'firstName', 'lastName', 'role', 'createdAt'],
          filterProperties: ['email', 'username', 'role'],
          editProperties: ['email', 'username', 'firstName', 'lastName', 'role', 'bio'],
          properties: {
            email: { 
              isTitle: true,
              description: 'User email address',
            },
            username: {
              description: 'Unique username',
            },
            firstName: {
              description: 'User first name',
            },
            lastName: {
              description: 'User last name',
            },
            password: {
              type: 'password',
              isVisible: {
                list: false,
                filter: false,
                show: false,
                edit: false,
                new: true,
              },
              description: 'User password (hidden for security)',
            },
            role: {
              availableValues: [
                { value: 'USER', label: 'User' },
                { value: 'INSTRUCTOR', label: 'Instructor' },
                { value: 'ADMIN', label: 'Admin' },
              ],
            },
            bio: {
              type: 'textarea',
              description: 'User biography',
            },
            createdAt: {
              isVisible: { edit: false, new: false },
            },
            updatedAt: {
              isVisible: { edit: false, new: false },
            },
          },
          actions: {
            delete: {
              guard: 'Are you sure you want to delete this user?',
            },
          },
        },
      },

      // Course Progress Analytics
      {
        resource: CourseProgress,
        options: {
          navigation: { 
            name: 'Analytics', 
            icon: 'TrendingUp',
            show: true
          },
          id: 'course-progress',
          listProperties: ['userId', 'courseId', 'progressPercentage', 'lastAccessedAt'],
          filterProperties: ['userId', 'courseId', 'progressPercentage'],
          editProperties: ['progressPercentage'],
          properties: {
            userId: {
              reference: 'users',
              isTitle: true,
            },
            courseId: {
              reference: 'courses',
            },
            progressPercentage: {
              type: 'number',
              description: 'Course completion percentage (0-100)',
            },
            completedSections: {
              type: 'mixed',
              isVisible: { edit: false },
              description: 'List of completed section IDs',
            },
            lastAccessedAt: {
              isVisible: { edit: false },
            },
          },
          actions: {
            new: {
              isVisible: false,
            },
            delete: {
              guard: 'Are you sure you want to delete this progress record?',
            },
          },
        },
      },

      // Course Reviews
      {
        resource: CourseReview,
        options: {
          navigation: { 
            name: 'Analytics', 
            icon: 'Star',
            show: true
          },
          id: 'course-reviews',
          listProperties: ['userId', 'courseId', 'rating', 'createdAt'],
          filterProperties: ['userId', 'courseId', 'rating'],
          editProperties: ['rating', 'comment'],
          properties: {
            userId: {
              reference: 'users',
              isTitle: true,
            },
            courseId: {
              reference: 'courses',
            },
            rating: {
              type: 'number',
              description: 'Rating (1-5 stars)',
            },
            comment: {
              type: 'textarea',
              description: 'Review comment',
            },
            createdAt: {
              isVisible: { edit: false, new: false },
            },
            updatedAt: {
              isVisible: { edit: false, new: false },
            },
          },
          actions: {
            edit: {
              isVisible: false, // Disable editing
            },
            new: {
              isVisible: false, // Disable creating new reviews
            },
            delete: {
              guard: 'Are you sure you want to delete this review?',
            },
          },
        },
      },

      // Enrollments
      {
        resource: Enrollment,
        options: {
          navigation: { 
            name: 'Analytics', 
            icon: 'UserCheck',
            show: true
          },
          id: 'enrollments',
          listProperties: ['userId', 'courseId', 'status', 'enrolledAt', 'completedAt'],
          filterProperties: ['userId', 'courseId', 'status'],
          editProperties: ['status', 'completedAt'],
          properties: {
            userId: {
              reference: 'users',
              isTitle: true,
            },
            courseId: {
              reference: 'courses',
            },
            status: {
              availableValues: [
                { value: 'ACTIVE', label: 'Active' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
                { value: 'PAUSED', label: 'Paused' },
              ],
            },
            enrolledAt: {
              isVisible: { edit: false, new: false },
            },
            completedAt: {
              description: 'Date when course was completed',
            },
          },
          actions: {
            new: {
              isVisible: false,
            },
            delete: {
              guard: 'Are you sure you want to delete this enrollment?',
            },
          },
        },
      },
    ],
    branding: {
      companyName: 'Course Platform Admin',
      logo: false,
      withMadeWithLove: false,
      theme: {
        colors: {
          primary100: '#3b82f6',
          primary80: '#60a5fa',
          primary60: '#93c5fd',
          primary40: '#c3ddfd',
          primary20: '#e0f2fe',
        },
      },
    },
    // Add explicit navigation configuration
    locale: {
      language: 'en',
      availableLanguages: ['en'],
    },
  });

  // Better initialization handling
  try {
    if (process.env.NODE_ENV === 'production') {
      await admin.initialize();
    } else {
      admin.watch();
    }
    console.log('✅ AdminJS initialized successfully');
  } catch (error) {
    console.error('❌ AdminJS initialization error:', error);
    throw error;
  }

  const router = buildAuthenticatedRouter(
    admin,
    {
      cookiePassword: process.env.COOKIE_SECRET,
      cookieName: 'adminjs',
      provider,
    },
    null,
    {
      secret: process.env.COOKIE_SECRET,
      saveUninitialized: true,
      resave: true,
    }
  );

  app.use(admin.options.rootPath, router);

  app.listen(port, () => {
    console.log(`🚀 AdminJS available at http://localhost:${port}${admin.options.rootPath}`);
    console.log(`📝 Login with: admin@courseplatform.com / admin@2025!secure`);
    console.log(`🔍 Check browser console for any JavaScript errors`);
  });
};

// Better error handling
start().catch((error) => {
  console.error('❌ Failed to start AdminJS:', error);
  process.exit(1);
});