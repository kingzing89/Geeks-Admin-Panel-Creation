import { AdminJSOptions } from 'adminjs';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJS from 'adminjs';
import uploadFeature from '@adminjs/upload';

// Import models
import { Category } from '../../models/Category.js';
import { Course } from '../../models/Course.js';

import { User } from '../../models/User.js';
import { Documentation } from '../../models/Documentation.js';
import { CourseProgress } from '../../models/CourseProgress.js';
import { CourseReview } from '../../models/CourseReview.js';
import { Enrollment } from '../../models/Enrollment.js';

import componentLoader from './component-loader.js';

// Register the mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

const AWScredentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
};

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [
    // Categories Management
    {
      resource: Category,
      options: {
        navigation: {
          name: 'Content Management',
          icon: 'Grid',
        },
        listProperties: ['title', 'slug', 'description', 'order', 'createdAt'],
        filterProperties: ['title', 'slug'],
        showProperties: ['title', 'slug', 'description', 'content', 'bgColor', 'icon', 'order', 'createdAt', 'updatedAt'],
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
        },
        listProperties: ['title', 'categoryId', 'level', 'rating', 'studentCount', 'isPremium', 'isPublished', 'createdAt'],
        filterProperties: ['title', 'level', 'categoryId', 'isPremium', 'isPublished', 'instructor'],
        showProperties: [
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
          'isPublished',
          'createdAt',
          'updatedAt'
        ],
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
            reference: 'Category',
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
        },
        listProperties: ['title', 'category', 'slug', 'readTime', 'isPublished', 'updatedAt'],
        filterProperties: ['title', 'category', 'isPublished'],
        showProperties: [
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
          'isPublished',
          'createdAt',
          'updatedAt'
        ],
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
            type: 'mixed',
            description: 'Quick navigation links',
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
        },
        listProperties: ['email', 'username', 'firstName', 'lastName', 'role', 'createdAt'],
        filterProperties: ['email', 'username', 'role'],
        showProperties: ['email', 'username', 'firstName', 'lastName', 'role', 'avatar', 'bio', 'createdAt', 'updatedAt'],
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
              new: true, // Only visible when creating new user
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

    // Course Progress (Read-only mostly)
    {
      resource: CourseProgress,
      options: {
        navigation: {
          name: 'Analytics',
          icon: 'TrendingUp',
        },
        listProperties: ['userId', 'courseId', 'progressPercentage', 'lastAccessedAt'],
        filterProperties: ['userId', 'courseId', 'progressPercentage'],
        showProperties: ['userId', 'courseId', 'completedSections', 'progressPercentage', 'lastAccessedAt'],
        editProperties: ['progressPercentage'], // Limited editing
        properties: {
          userId: {
            reference: 'User',
            isTitle: true,
          },
          courseId: {
            reference: 'Course',
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
            isVisible: false, // Prevent manual creation
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
        },
        listProperties: ['userId', 'courseId', 'rating', 'createdAt'],
        filterProperties: ['userId', 'courseId', 'rating'],
        showProperties: ['userId', 'courseId', 'rating', 'comment', 'createdAt', 'updatedAt'],
        editProperties: ['rating', 'comment'],
        properties: {
          userId: {
            reference: 'User',
            isTitle: true,
          },
          courseId: {
            reference: 'Course',
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
        },
        listProperties: ['userId', 'courseId', 'status', 'enrolledAt', 'completedAt'],
        filterProperties: ['userId', 'courseId', 'status'],
        showProperties: ['userId', 'courseId', 'status', 'enrolledAt', 'completedAt'],
        editProperties: ['status', 'completedAt'],
        properties: {
          userId: {
            reference: 'User',
            isTitle: true,
          },
          courseId: {
            reference: 'Course',
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
            isVisible: false, // Prevent manual enrollment creation
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
  dashboard: {
    component: 'Dashboard', // You can create a custom dashboard later
  },
};

export default options;