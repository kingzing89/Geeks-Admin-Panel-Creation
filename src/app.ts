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
import { Course, CourseSection  } from './../models/Course.js';
import { CourseProgress } from './../models/CourseProgress.js';
import { CourseReview } from './../models/CourseReview.js';
import { Documentation } from './../models/Documentation.js';
import { Enrollment } from './../models/Enrollment.js';
import { User } from './../models/User.js';
import { Purchase } from './../models/Purchase.js'; // Add the new Purchase model

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
      Purchase: Purchase.modelName, // Add Purchase to verification
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
      // Categories Management - Updated Configuration
      {
        resource: Category,
        options: {
          navigation: {
            name: 'Content Management',
            icon: 'Grid',
            show: true,
          },
          id: 'categories',
          listProperties: ['title', 'slug', 'description', 'bgColor', 'order', 'createdAt'],
          filterProperties: ['title', 'slug', 'bgColor'],
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
              type: 'select',
              availableValues: [
                { value: 'LightBlue', label: 'Light Blue' },
                { value: 'SoftGreen', label: 'Soft Green' },
                { value: 'PaleRose', label: 'Pale Rose' },
                { value: 'LavenderGray', label: 'Lavender Gray' },
                { value: 'WarmBeige', label: 'Warm Beige' },
                { value: 'SoftPink', label: 'Soft Pink' },
                { value: 'PaleIndigo', label: 'Pale Indigo' },
                { value: 'MintGreen', label: 'Mint Green' },
                { value: 'Peach', label: 'Peach' },
                { value: 'SoftTeal', label: 'Soft Teal' },
              ],
              description: 'Select subtle background color for the category',
            },
            icon: {
              type: 'select',
              availableValues: [
                { value: 'Code', label: 'Code' },
                { value: 'Database', label: 'Database' },
                { value: 'Brain', label: 'Brain' },
                { value: 'Globe', label: 'Globe' },
                { value: 'Server', label: 'Server' },
                { value: 'Laptop', label: 'Laptop' },
                { value: 'Users', label: 'Users' },
                { value: 'BookOpen', label: 'BookOpen' },
                { value: 'Award', label: 'Award' },
              ],
              description: 'Select icon for the category',
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
            show: true,
          },
          id: 'courses',
          listProperties: [
            'title',
            'categoryId',
            'level',
            'rating',
            'studentCount',
            'isPremium',
            'isPublished',
            'createdAt',
          ],
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
            'isPublished',
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
              type: 'select',
              availableValues: [
                { value: 'LightBlue', label: 'Light Blue' },
                { value: 'SoftGreen', label: 'Soft Green' },
                { value: 'PaleRose', label: 'Pale Rose' },
                { value: 'LavenderGray', label: 'Lavender Gray' },
                { value: 'WarmBeige', label: 'Warm Beige' },
                { value: 'SoftPink', label: 'Soft Pink' },
                { value: 'PaleIndigo', label: 'Pale Indigo' },
                { value: 'MintGreen', label: 'Mint Green' },
                { value: 'Peach', label: 'Peach' },
                { value: 'SoftTeal', label: 'Soft Teal' },
              ],
              description: 'Select subtle background color for the category',
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

      // Course section resources
      {
        resource: CourseSection,
        options: {
          navigation: {
            name: 'Content Management',
            icon: 'FileText',
            show: true,
          },
          id: 'course-sections',
          listProperties: ['title', 'courseId', 'order', 'createdAt'],
          filterProperties: ['title', 'courseId'],
          editProperties: ['title', 'content', 'courseId', 'order'],
          showProperties: ['title', 'content', 'courseId', 'order', 'createdAt', 'updatedAt'],
          properties: {
            title: {
              isTitle: true,
              description: 'Section title',
            },
            content: {
              type: 'textarea',
              description: 'Section content (supports Markdown formatting: # Headers, ## Subheaders, - Bullets, **Bold**, etc.)',
              props: {
                rows: 15, 
              },
            },
            courseId: {
              reference: 'courses',
              description: 'Course this section belongs to',
            },
            order: {
              type: 'number',
              description: 'Display order within the course (1, 2, 3...)',
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
              guard: 'Are you sure you want to delete this course section? This action cannot be undone.',
            },
          },
          sort: {
            sortBy: 'order',
            direction: 'asc',
          },
        },
      },

      {
        resource: Documentation,
        options: {
          navigation: {
            name: 'Documentation',
            icon: 'Book',
            show: true,
          },
          id: 'documentation',
          listProperties: ['title', 'category', 'slug', 'readTime', 'price', 'isPublished', 'updatedAt'],
          filterProperties: ['title', 'category', 'isPublished', 'price'],
          editProperties: [
            'title',
            'slug',
            'category',
            'description',
            'content',
            'readTime',
            'keyFeatures',
            'codeExamples',
            'documentSections',
            'proTip',
            // New pricing fields
            'price',
            'currency',
            'stripePriceId',
            'isPublished',
          ],
          showProperties: [
            'title',
            'slug',
            'category',
            'description',
            'content',
            'readTime',
            'keyFeatures',
            'codeExamples',
            'documentSections',
            'proTip',
            // New pricing fields
            'price',
            'currency', 
            'stripePriceId',
            'isPublished',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            title: {
              isTitle: true,
              description: 'Documentation title',
            },
            slug: {
              description: 'URL slug (lowercase, no spaces, used in URL: /docs/your-slug)',
            },
            category: {
              reference: 'categories',
              description: 'Documentation category - select from existing categories',
            },
            description: {
              type: 'textarea',
              description: 'Brief description shown in cards and previews',
              props: {
                rows: 3,
              },
            },
            content: {
              type: 'textarea',
              description: 'Main documentation content (supports Markdown: # Headers, ## Subheaders, **Bold**, `code`, etc.)',
              props: {
                rows: 15,
              },
            },
            readTime: {
              description: 'Estimated reading time (e.g., "5 minutes", "10 min read")',
            },
            keyFeatures: {
              type: 'mixed',
              description: 'Array of key features/highlights (JSON format: ["Feature 1", "Feature 2", "Feature 3"])',
            },
            codeExamples: {
              type: 'mixed',
              description: 'Code examples array (JSON format: [{"title": "Example Title", "code": "console.log(\'Hello\');", "description": "Example description"}])',
            },
            documentSections: {
              reference: 'documentation',
              isArray: true,
              description: 'Related documentation sections - select existing documentation to reference as sections',
              props: {
                multiple: true,
              },
            },
            proTip: {
              type: 'textarea',
              description: 'Professional tip or advice shown in sidebar',
              props: {
                rows: 3,
              },
            },
            // New pricing fields
            price: {
              type: 'number',
              description: 'Price in USD (e.g., 29.99). Leave empty or set to 0 for free content.',
              props: {
                step: 0.01,
                min: 0,
                placeholder: '0.00',
              },
            },
            currency: {
              type: 'select',
              availableValues: [
                { value: 'usd', label: 'USD ($)' },
                { value: 'eur', label: 'EUR (€)' },
                { value: 'gbp', label: 'GBP (£)' },
                { value: 'cad', label: 'CAD ($)' },
                { value: 'aud', label: 'AUD ($)' },
              ],
              description: 'Currency for pricing. Defaults to USD if not specified.',
            },
            stripePriceId: {
              type: 'string',
              description: 'Stripe Price ID from your Stripe dashboard (starts with "price_"). Required for paid content.',
              props: {
                placeholder: 'price_1234567890abcdef',
              },
            },
            isPublished: {
              description: 'Make this documentation visible to users',
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
              guard: 'Are you sure you want to delete this documentation? This action cannot be undone.',
            },
            // Updated custom action for better section management
            manageHierarchy: {
              actionType: 'record',
              icon: 'GitBranch',
              label: 'View Hierarchy',
              handler: async (request, response, context) => {
                const { record, resource } = context;
                if (record) {
                  try {
                    // Get the mongoose model from the resource
                    const DocumentationModel = resource._decorated.model;
                    
                    // Populate both category and document sections to show complete info
                    const populatedRecord = await DocumentationModel.findById(record.id())
                      .populate('category', 'title slug')
                      .populate('documentSections', 'title slug category');
                    
                    const sections = populatedRecord?.documentSections || [];
                    const categoryInfo = populatedRecord?.category ? 
                      `Category: ${populatedRecord.category.title} (${populatedRecord.category.slug})` : 
                      'Category: Not assigned';
                    
                    const hierarchyInfo = sections.map((section, index) => 
                      `${index + 1}. ${section.title} (${section.slug})`
                    ).join('\n');
                    
                    const fullMessage = [
                      categoryInfo,
                      '',
                      sections.length > 0 
                        ? `Document Sections (${sections.length}):\n${hierarchyInfo}`
                        : 'No document sections configured for this documentation.'
                    ].join('\n');
                    
                    return {
                      notice: {
                        message: fullMessage,
                        type: 'success',
                      },
                    };
                  } catch (error) {
                    console.error('Error in manageHierarchy:', error);
                    return {
                      notice: {
                        message: `Error loading hierarchy: ${error.message}`,
                        type: 'error',
                      },
                    };
                  }
                }
                
                return {
                  notice: {
                    message: 'No record found',
                    type: 'error',
                  },
                };
              },
            },
            // Action to check for circular references
            validateHierarchy: {
              actionType: 'record',
              icon: 'CheckCircle',
              label: 'Validate Hierarchy',
              handler: async (request, response, context) => {
                const { record, resource } = context;
                if (record && record.params.documentSections) {
                  try {
                    // Get the mongoose model from the resource
                    const DocumentationModel = resource._decorated.model;
                    
                    const currentId = record.id();
                    const sectionIds = record.params.documentSections;
                    
                    // Check for self-reference
                    if (sectionIds.includes(currentId)) {
                      return {
                        notice: {
                          message: 'Circular reference detected: Document cannot reference itself as a section',
                          type: 'error',
                        },
                      };
                    }
                    
                    // Check for mutual references (A->B, B->A)
                    const sections = await DocumentationModel.find(
                      { _id: { $in: sectionIds } }, 
                      'documentSections title'
                    );
                    
                    const mutualRefs = [];
                    
                    for (const section of sections) {
                      if (section.documentSections && section.documentSections.some(id => id.toString() === currentId)) {
                        mutualRefs.push(section.title);
                      }
                    }
                    
                    if (mutualRefs.length > 0) {
                      return {
                        notice: {
                          message: `Mutual references detected with: ${mutualRefs.join(', ')}. This may cause navigation issues.`,
                          type: 'notice',
                        },
                      };
                    }
                    
                    return {
                      notice: {
                        message: 'Hierarchy validation passed. No circular references found.',
                        type: 'success',
                      },
                    };
                  } catch (error) {
                    console.error('Error in validateHierarchy:', error);
                    return {
                      notice: {
                        message: `Error during validation: ${error.message}`,
                        type: 'error',
                      },
                    };
                  }
                }
                
                return {
                  notice: {
                    message: 'No sections to validate',
                    type: 'notice',
                  },
                };
              },
            },
          },
          sort: {
            sortBy: 'updatedAt',
            direction: 'desc',
          },
        },
      },

      // Purchase Management - NEW SECTION
      {
        resource: Purchase,
        options: {
          navigation: {
            name: 'E-Commerce',
            icon: 'CreditCard',
            show: true,
          },
          id: 'purchases',
          listProperties: [
            'userId', 
            'documentId', 
            'amount', 
            'currency', 
            'status', 
            'purchaseDate', 
            'stripeSessionId'
          ],
          filterProperties: [
            'userId', 
            'documentId', 
            'status', 
            'currency', 
            'purchaseDate',
            'amount'
          ],
          editProperties: [
            'status', 
            'amount', 
            'currency'
          ],
          showProperties: [
            'userId',
            'documentId',
            'stripeSessionId',
            'stripePaymentIntentId',
            'amount',
            'currency',
            'status',
            'purchaseDate',
            'createdAt',
            'updatedAt',
          ],
          properties: {
            userId: {
              reference: 'users',
              isTitle: true,
              description: 'User who made the purchase',
            },
            documentId: {
              reference: 'documentation',
              description: 'Documentation that was purchased',
            },
            stripeSessionId: {
              description: 'Stripe checkout session ID',
              isVisible: { edit: false, new: false },
            },
            stripePaymentIntentId: {
              description: 'Stripe payment intent ID',
              isVisible: { edit: false, new: false },
            },
            amount: {
              type: 'number',
              description: 'Purchase amount (in dollars)',
              props: {
                step: 0.01,
                min: 0,
              },
            },
            currency: {
              type: 'select',
              availableValues: [
                { value: 'usd', label: 'USD ($)' },
                { value: 'eur', label: 'EUR (€)' },
                { value: 'gbp', label: 'GBP (£)' },
                { value: 'cad', label: 'CAD ($)' },
                { value: 'aud', label: 'AUD ($)' },
              ],
              description: 'Purchase currency',
            },
            status: {
              type: 'select',
              availableValues: [
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
                { value: 'failed', label: 'Failed' },
                { value: 'refunded', label: 'Refunded' },
              ],
              description: 'Purchase status',
            },
            purchaseDate: {
              description: 'Date when purchase was made',
              isVisible: { edit: false, new: false },
            },
            createdAt: {
              isVisible: { edit: false, new: false },
            },
            updatedAt: {
              isVisible: { edit: false, new: false },
            },
          },
          actions: {
            new: {
              isVisible: false, // Disable manual creation
            },
            edit: {
              // Only allow editing status and amounts for refunds/corrections
              isAccessible: true,
            },
            delete: {
              guard: 'Are you sure you want to delete this purchase record? This action cannot be undone and may affect user access.',
            },
            // Custom action to view user's all purchases
            viewUserPurchases: {
              actionType: 'record',
              icon: 'User',
              label: 'View All User Purchases',
              handler: async (request, response, context) => {
                const { record, resource } = context;
                if (record) {
                  try {
                    const PurchaseModel = resource._decorated.model;
                    const userId = record.params.userId;
                    
                    const userPurchases = await PurchaseModel.find({ userId })
                      .populate('documentId', 'title slug price')
                      .sort({ purchaseDate: -1 });
                    
                    const totalSpent = userPurchases
                      .filter(p => p.status === 'completed')
                      .reduce((sum, p) => sum + p.amount, 0);
                    
                    const purchaseList = userPurchases.map((p, index) => 
                      `${index + 1}. ${p.documentId?.title || 'Unknown'} - $${p.amount} (${p.status})`
                    ).join('\n');
                    
                    const message = [
                      `Total Purchases: ${userPurchases.length}`,
                      `Total Spent: $${totalSpent.toFixed(2)}`,
                      `Completed Purchases: ${userPurchases.filter(p => p.status === 'completed').length}`,
                      '',
                      'Purchase History:',
                      purchaseList || 'No purchases found'
                    ].join('\n');
                    
                    return {
                      notice: {
                        message: message,
                        type: 'success',
                      },
                    };
                  } catch (error) {
                    console.error('Error in viewUserPurchases:', error);
                    return {
                      notice: {
                        message: `Error loading user purchases: ${error.message}`,
                        type: 'error',
                      },
                    };
                  }
                }
                
                return {
                  notice: {
                    message: 'No record found',
                    type: 'error',
                  },
                };
              },
            },
          },
          sort: {
            sortBy: 'purchaseDate',
            direction: 'desc',
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
            show: true,
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
            show: true,
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
            show: true,
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
            show: true,
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