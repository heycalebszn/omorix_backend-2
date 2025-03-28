import { PRODUCT_STATUS } from '../constants/constant.js';
export const parseMultipartArrays = (req, res, next) => {
    // Parse categoryIds from JSON string to array
    if (req.body.categoryIds && typeof req.body.categoryIds === 'string') {
        try {
            req.body.categoryIds = JSON.parse(req.body.categoryIds);
        } catch (e) {
            // If it's not valid JSON, try to handle it as a comma-separated string
            if (req.body.categoryIds.includes(',')) {
                req.body.categoryIds = req.body.categoryIds.split(',').map(id => id.trim());
            } else {
                // If it's a single value, convert it to an array with one element
                req.body.categoryIds = [req.body.categoryIds];
            }
        }
    }

    // Parse variants from JSON string to array
    if (req.body.variants && typeof req.body.variants === 'string') {
        try {
            req.body.variants = JSON.parse(req.body.variants);
        } catch (e) {
            console.error('Error parsing variants:', e);
            req.body.variants = [];
        }
    }
    // Convert isActive boolean to the appropriate enum value
    if (req.body.isActive !== undefined) {
        // Convert string 'true'/'false' to boolean
        const isActiveBool = req.body.isActive === 'true' || req.body.isActive === true;
        // Map boolean to enum value
        req.body.isActive = isActiveBool ? PRODUCT_STATUS.ACTIVE : PRODUCT_STATUS.INACTIVE;
    }

    next();
};

// 
// export const parseMultipartArrays = (req, res, next) => {
//     // Parse categoryIds and variants (your existing code)

//     // Convert isActive boolean to the appropriate enum value

// };