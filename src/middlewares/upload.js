'use strict'

const multer = require('multer');
const path = require('path');
const { BadRequestError } = require('../core/error.response');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create different folders for different file types
        let uploadPath = 'uploads/';
        
        if (file.fieldname === 'product_images') {
            uploadPath += 'products/';
        } else if (file.fieldname === 'avatar') {
            uploadPath += 'avatars/';
        } else if (file.fieldname === 'documents') {
            uploadPath += 'documents/';
        } else {
            uploadPath += 'misc/';
        }
        
        // Create directory if it doesn't exist
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, extension);
        
        cb(null, `${baseName}-${uniqueSuffix}${extension}`);
    }
});

// Memory storage for cloud upload
const memoryStorage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Define allowed file types
    const allowedMimeTypes = {
        images: [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'image/webp'
        ],
        documents: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ],
        all: [
            'image/jpeg',
            'image/jpg',
            'image/png', 
            'image/gif',
            'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ]
    };
    
    // Check file type based on field name
    let allowed = allowedMimeTypes.all;
    
    if (file.fieldname === 'product_images' || file.fieldname === 'avatar') {
        allowed = allowedMimeTypes.images;
    } else if (file.fieldname === 'documents') {
        allowed = allowedMimeTypes.documents;
    }
    
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestError(`Invalid file type. Allowed types: ${allowed.join(', ')}`), false);
    }
};

// Base upload configuration
const baseUploadConfig = {
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB default
        files: 10 // Maximum 10 files
    }
};

// Memory upload configuration (for cloud storage)
const memoryUploadConfig = {
    storage: memoryStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10
    }
};

// Different upload configurations
const uploadConfigs = {
    // Single image upload (for avatars, single product image)
    single: multer({
        ...baseUploadConfig,
        limits: {
            fileSize: 2 * 1024 * 1024, // 2MB for single images
            files: 1
        }
    }),
    
    // Multiple product images
    productImages: multer({
        ...baseUploadConfig,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB per file
            files: 5 // Maximum 5 product images
        }
    }),
    
    // Documents upload
    documents: multer({
        ...baseUploadConfig,
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB for documents
            files: 3
        }
    }),
    
    // Memory storage for cloud upload
    memory: multer(memoryUploadConfig)
};

// Upload middleware functions
const uploadMiddlewares = {
    // Single file upload
    singleImage: (fieldName = 'image') => {
        return (req, res, next) => {
            const upload = uploadConfigs.single.single(fieldName);
            upload(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return next(new BadRequestError('File too large. Maximum size is 2MB.'));
                        }
                        if (err.code === 'LIMIT_FILE_COUNT') {
                            return next(new BadRequestError('Too many files. Maximum is 1 file.'));
                        }
                        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                            return next(new BadRequestError(`Unexpected field: ${err.field}`));
                        }
                    }
                    return next(err);
                }
                next();
            });
        };
    },
    
    // Multiple product images
    productImages: (req, res, next) => {
        const upload = uploadConfigs.productImages.array('product_images', 5);
        upload(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return next(new BadRequestError('File too large. Maximum size is 5MB per file.'));
                    }
                    if (err.code === 'LIMIT_FILE_COUNT') {
                        return next(new BadRequestError('Too many files. Maximum is 5 files.'));
                    }
                }
                return next(err);
            }
            next();
        });
    },
    
    // Document upload
    documents: (req, res, next) => {
        const upload = uploadConfigs.documents.array('documents', 3);
        upload(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return next(new BadRequestError('File too large. Maximum size is 10MB per file.'));
                    }
                    if (err.code === 'LIMIT_FILE_COUNT') {
                        return next(new BadRequestError('Too many files. Maximum is 3 files.'));
                    }
                }
                return next(err);
            }
            next();
        });
    },
    
    // Mixed upload (for forms with different file types)
    mixed: (fields) => {
        return (req, res, next) => {
            const upload = multer(baseUploadConfig).fields(fields);
            upload(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return next(new BadRequestError('File too large. Check file size limits.'));
                        }
                        if (err.code === 'LIMIT_FILE_COUNT') {
                            return next(new BadRequestError('Too many files uploaded.'));
                        }
                    }
                    return next(err);
                }
                next();
            });
        };
    }
};

// Utility functions
const uploadUtils = {
    // Clean up uploaded files on error
    cleanupFiles: (files) => {
        if (!files) return;
        
        const fs = require('fs');
        const filesToClean = Array.isArray(files) ? files : [files];
        
        filesToClean.forEach(file => {
            if (file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
    },
    
    // Get file info
    getFileInfo: (file) => {
        if (!file) return null;
        
        return {
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
            url: `/uploads/${file.filename}` // Adjust based on your static file serving
        };
    },
    
    // Validate file size
    validateFileSize: (size, maxSize) => {
        return size <= maxSize;
    },
    
    // Validate file type
    validateFileType: (mimetype, allowedTypes) => {
        return allowedTypes.includes(mimetype);
    }
};

module.exports = {
    uploadMiddlewares,
    uploadConfigs,
    uploadUtils,
    storage,
    memoryStorage,
    fileFilter
};
