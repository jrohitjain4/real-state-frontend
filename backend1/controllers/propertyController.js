const db = require('../models');
const { Property, PropertyImage, PropertyFeature, Category, SubCategory, User } = db;
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');

exports.createProperty = async (req, res) => {
    let transaction;
    try {
        transaction = await db.sequelize.transaction();
        const userId = req.user.id;
        const {
            categoryId,
            subCategoryId,
            propertyConfiguration, // This matches your model
            title,
            description,
            price,
            priceUnit,
            negotiable,
            // Location
            address,
            locality,
            landmark,
            city,
            state,
            pincode,
            latitude,
            longitude,
            // Property details
            bedrooms,
            bathrooms,
            balconies,
            floorNumber,
            totalFloors,
            // Area
            superArea,
            builtUpArea,
            carpetArea,
            propertyType,
            property_for,
            plotArea,
            plotLength,
            plotBreadth,
            plotFacing,
            roadWidth,
            openSides,
            washrooms,
            frontage,
            totalArea,
            openArea,
            // PG fields
            sharingType,
            totalBeds,
            availableBeds,
            gateClosingTime,
            visitorPolicy,
            noticePeriod,
            // Additional fields
            zoning,
            approvedUse,
            features,
            // Ownership
            ownershipType

        } = req.body;

        console.log('🔍 Backend received ownershipType:', ownershipType);
        console.log('🔍 Full request body:', JSON.stringify(req.body, null, 2));

        // Clean up numeric fields - convert empty strings to null
        const cleanNumericField = (value) => {
            if (value === '' || value === undefined || value === null) return null;
            const num = parseFloat(value);
            return isNaN(num) ? null : num;
        };

        // Clean numeric fields from the request body
        const cleanedData = {
            ...req.body,
            bedrooms: cleanNumericField(req.body.bedrooms),
            bathrooms: cleanNumericField(req.body.bathrooms),
            balconies: cleanNumericField(req.body.balconies),
            totalFloors: cleanNumericField(req.body.totalFloors),
            superArea: cleanNumericField(req.body.superArea),
            builtUpArea: cleanNumericField(req.body.builtUpArea),
            carpetArea: cleanNumericField(req.body.carpetArea),
            price: cleanNumericField(req.body.price),
            maintenanceCharge: cleanNumericField(req.body.maintenanceCharge),
            plotArea: cleanNumericField(req.body.plotArea),
            plotLength: cleanNumericField(req.body.plotLength),
            plotBreadth: cleanNumericField(req.body.plotBreadth),
            roadWidth: cleanNumericField(req.body.roadWidth),
            washrooms: cleanNumericField(req.body.washrooms),
            totalArea: cleanNumericField(req.body.totalArea),
            openArea: cleanNumericField(req.body.openArea),
            totalBeds: cleanNumericField(req.body.totalBeds),
            availableBeds: cleanNumericField(req.body.availableBeds),
            noticePeriod: cleanNumericField(req.body.noticePeriod),
            frontage: cleanNumericField(req.body.frontage),
            latitude: cleanNumericField(req.body.latitude),
            longitude: cleanNumericField(req.body.longitude)
        };

        // Get propertyType from cleaned data
        const actualPropertyType = cleanedData.propertyType || propertyType;

        const validationErrors = validatePropertyFields(cleanedData, actualPropertyType);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Generate unique slug
        const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let counter = 1;

        while (await Property.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Create property using cleaned data
        const propertyData = {
            userId,
            categoryId: parseInt(categoryId),
            subCategoryId: parseInt(subCategoryId),
            propertyConfiguration,
            title,
            slug,
            description,
            price: cleanedData.price,
            priceUnit: priceUnit || 'total',
            negotiable: negotiable !== false,
            address,
            locality,
            landmark,
            city,
            state,
            pincode,
            latitude: cleanedData.latitude,
            longitude: cleanedData.longitude,
            status: 'active',
            propertyType: actualPropertyType,
            property_for: property_for || 'residential',
            ownershipType: ownershipType || 'owner'
        };



        switch(actualPropertyType) {
            case 'land':
            case 'commercial-land':
                Object.assign(propertyData, {
                    plotArea: cleanedData.plotArea,
                    plotLength: cleanedData.plotLength,
                    plotBreadth: cleanedData.plotBreadth,
                    plotFacing,
                    roadWidth: cleanedData.roadWidth,
                    openSides,
                    zoning,
                    approvedUse
                });
                break;
                
            case 'commercial':
                Object.assign(propertyData, {
                    washrooms: cleanedData.washrooms,
                    frontage: cleanedData.frontage,
                    superArea: cleanedData.superArea,
                    builtUpArea: cleanedData.builtUpArea,
                    carpetArea: cleanedData.carpetArea,
                    floorNumber,
                    totalFloors: cleanedData.totalFloors
                });
                break;
                
            case 'farmhouse':
                Object.assign(propertyData, {
                    bedrooms: cleanedData.bedrooms,
                    bathrooms: cleanedData.bathrooms,
                    totalArea: cleanedData.totalArea,
                    builtUpArea: cleanedData.builtUpArea,
                    openArea: cleanedData.openArea
                });
                break;
                
            case 'pg':
                Object.assign(propertyData, {
                    sharingType,
                    totalBeds: cleanedData.totalBeds,
                    availableBeds: cleanedData.availableBeds,
                    gateClosingTime,
                    visitorPolicy,
                    noticePeriod: cleanedData.noticePeriod
                });
                break;
                
            case 'studio':
                Object.assign(propertyData, {
                    bathrooms: cleanedData.bathrooms,
                    floorNumber,
                    totalFloors: cleanedData.totalFloors,
                    superArea: cleanedData.superArea,
                    carpetArea: cleanedData.carpetArea,
                    bedrooms: 0 // Studios have 0 bedrooms
                });
                break;
                
            default: // residential
                Object.assign(propertyData, {
                    bedrooms: cleanedData.bedrooms,
                    bathrooms: cleanedData.bathrooms,
                    balconies: cleanedData.balconies,
                    floorNumber,
                    totalFloors: cleanedData.totalFloors,
                    superArea: cleanedData.superArea,
                    builtUpArea: cleanedData.builtUpArea,
                    carpetArea: cleanedData.carpetArea
                });
        }
        const property = await Property.create(propertyData);


        // Create property features if provided
        if (features && Object.keys(features).length > 0) {
            try {
                await PropertyFeature.findOrCreate({
                    where: { propertyId: property.id },
                    defaults: {
                        propertyId: property.id,
                        ...features
                    },
                    // transaction
                });
            } catch (featureError) {
                console.error('Error creating property features:', featureError);
                // Don't fail the entire property creation if features fail
            }
        }

        // await transaction.commit();
        
        console.log('✅ Property created successfully:', {
            id: property.id,
            title: property.title,
            userId: property.userId,
            status: property.status
        });
        
        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: {
                id: property.id,
                slug: property.slug
            }
        });

    } catch (error) {
        // if (transaction) {
        //     try {
        //         await transaction.rollback();
        //     } catch (rollbackError) {
        //         console.error('Error rolling back transaction:', rollbackError);
        //     }
        // }
        
        console.error('=== PROPERTY CREATION ERROR ===');
        console.error('Error creating property:', error);
        console.error('Request body:', JSON.stringify(req.body, null, 2));
        console.error('Property type:', req.body.propertyType);
        console.error('User ID:', req.user?.id);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        console.error('=== END ERROR ===');
        
        // Ensure we always send a JSON response
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Error creating property',
                error: error.message
            });
        }
    }
};


function validatePropertyFields(data, propertyType) {
    const errors = [];
    
    switch(propertyType) {
        case 'land':
        case 'commercial-land':
            if (!data.plotArea) errors.push('Plot area is required');
            break;
            
        case 'commercial':
            if (!data.superArea) errors.push('Super area is required');
            break;
            
        case 'farmhouse':
            if (!data.totalArea) errors.push('Total area is required');
            break;
            
        case 'pg':
            if (!data.totalBeds) errors.push('Total beds is required');
            if (!data.availableBeds) errors.push('Available beds is required');
            if (!data.sharingType) errors.push('Sharing type is required');
            break;
            
        case 'studio':
            if (!data.superArea) errors.push('Super area is required');
            break;
            
        default: // residential
            if (!data.superArea) errors.push('Super area is required');
            if (!data.bedrooms && data.bedrooms !== 0) errors.push('Bedrooms is required');
    }
    
    return errors;
}

exports.uploadPropertyImages = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const { imageType = 'other', isPrimary = false } = req.body;

        console.log('🖼️ Image upload request:', {
            propertyId,
            userId: req.user?.id,
            imageType,
            isPrimary
        });

        // Check if property exists and belongs to user
        const property = await Property.findOne({
            where: { 
                id: propertyId,
                userId: req.user.id
            }
        });

        console.log('🔍 Property lookup result:', property ? 'Found' : 'Not found');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found or unauthorized'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No images uploaded'
            });
        }

        // If marking as primary, unset other primary images
        if (isPrimary) {
            await PropertyImage.update(
                { isPrimary: false },
                { where: { propertyId } }
            );
        }

        // Save image records
        const imageRecords = [];
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const imageUrl = `/uploads/properties/${file.filename}`;
            
            const imageRecord = await PropertyImage.create({
                propertyId,
                imageUrl,
                imageType,
                isPrimary: isPrimary && i === 0, // Only first image as primary
                order: i
            });
            
            imageRecords.push(imageRecord);
        }

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            data: imageRecords
        });

    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading images'
        });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const {
            categoryId,
            subCategoryId,
            city,
            minPrice,
            maxPrice,
            bedrooms,
            propertyFor,
            property_for,
            furnishingStatus,
            possessionStatus,
            search,
            page = 1,
            limit = 12,
            sortBy = 'createdAt',
            sortOrder = 'DESC'
        } = req.query;

        // Build where clause
        const where = {
            status: { [Op.in]: ['active', 'pending'] }
        };

        if (categoryId) where.categoryId = parseInt(categoryId);
        if (subCategoryId) where.subCategoryId = parseInt(subCategoryId);
        if (city) where.city = { [Op.iLike]: `%${city}%` };
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = minPrice;
            if (maxPrice) where.price[Op.lte] = maxPrice;
        }
        if (bedrooms) where.bedrooms = bedrooms;
        if (propertyFor) where.propertyFor = propertyFor;
        if (property_for) where.property_for = property_for;
        if (furnishingStatus) where.furnishingStatus = furnishingStatus;
        if (possessionStatus) where.possessionStatus = possessionStatus;

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { locality: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // Calculate offset
        const offset = (page - 1) * limit;

        // console.log('🔍 Property filtering debug:', {
        //     queryParams: req.query,
        //     whereClause: where
        // });

        // Fetch properties
        const { count, rows } = await Property.findAndCountAll({
            where,
            attributes: { exclude: [] }, // Include all attributes including ownershipType
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: SubCategory,
                    as: 'subcategory',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: PropertyImage,
                    as: 'images',
                    required: false,
                    attributes: ['imageUrl', 'isPrimary', 'order']
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'profileCompleted']
                },
                {
                    model: PropertyFeature,
                    as: 'features',
                    attributes: ['parking', 'lift', 'powerBackup', 'security']
                }
            ],
            order: [[sortBy, sortOrder]],
            limit: parseInt(limit),
            offset: parseInt(offset),
            distinct: true
        });

        res.json({
            success: true,
            data: {
                properties: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties'
        });
    }
};

exports.getPropertyBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const property = await Property.findOne({
            where: { slug, status: 'active' },
            attributes: { exclude: [] }, // Include all attributes including ownershipType
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: SubCategory,
                    as: 'subcategory',
                    attributes: ['id', 'name', 'slug']
                },
                {
                    model: PropertyImage,
                    as: 'images',
                    attributes: ['id', 'imageUrl', 'imageType', 'isPrimary', 'caption'],
                    order: [['isPrimary', 'DESC'], ['order', 'ASC']]
                },
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt']
                },
                {
                    model: PropertyFeature,
                    as: 'features'
                }
            ]
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Increment view count
        await property.increment('viewCount');

        res.json({
            success: true,
            data: property
        });

    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching property'
        });
    }
};

exports.getMyProperties = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, page = 1, limit = 10 } = req.query;

        const where = { userId };
        if (status) where.status = status;

        const offset = (page - 1) * limit;

        const { count, rows } = await Property.findAndCountAll({
            where,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                },
                {
                    model: SubCategory,
                    as: 'subcategory',
                    attributes: ['name']
                },
                {
                    model: PropertyImage,
                    as: 'images',
                    where: { isPrimary: true },
                    required: false,
                    attributes: ['imageUrl']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.json({
            success: true,
            data: {
                properties: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    limit: parseInt(limit)
                }
            }
        });

    } catch (error) {
        console.error('Error fetching user properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user properties'
        });
    }
};

// Get property counts by category and subcategory
exports.getPropertyCounts = async (req, res) => {
    try {
        const { categoryId, subcategoryId } = req.query;
        
        const where = {
            status: { [Op.in]: ['active', 'pending'] }
        };
        
        if (categoryId) where.categoryId = categoryId;
        if (subcategoryId) where.subCategoryId = subcategoryId;
        
        const count = await Property.count({ where });
        
        res.json({
            success: true,
            data: {
                count: count,
                categoryId: categoryId,
                subcategoryId: subcategoryId
            }
        });
        
    } catch (error) {
        console.error('Error fetching property counts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching property counts'
        });
    }
};

exports.updateProperty = async (req, res) => {
        // const transaction = await db.sequelize.transaction();
    
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Check if property exists and belongs to user
        const property = await Property.findOne({
            where: { id, userId }
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found or unauthorized'
            });
        }

        // Update property fields
        const updatedData = { ...req.body };
        delete updatedData.id;
        delete updatedData.userId;
        delete updatedData.slug; // Don't update slug
        
        await property.update(updatedData, { transaction });

        // Update features if provided
        if (req.body.features) {
            const existingFeatures = await PropertyFeature.findOne({
                where: { propertyId: id }
            });

            if (existingFeatures) {
                await existingFeatures.update(req.body.features, { transaction });
            } else {
                await PropertyFeature.create({
                    propertyId: id,
                    ...req.body.features
                }, { transaction });
            }
        }

        // await transaction.commit();

        res.json({
            success: true,
            message: 'Property updated successfully',
            data: property
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error updating property:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating property'
        });
    }
};

exports.deleteProperty = async (req, res) => {
        // const transaction = await db.sequelize.transaction();
    
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const property = await Property.findOne({
            where: { id, userId }
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found or unauthorized'
            });
        }

        // Delete associated images from filesystem
        const images = await PropertyImage.findAll({
            where: { propertyId: id }
        });

        for (const image of images) {
            const imagePath = path.join(__dirname, '..', image.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete property (cascade will delete related records)
        await property.destroy({ transaction });

        // await transaction.commit();

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error deleting property:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting property'
        });
    }
};

exports.deletePropertyImage = async (req, res) => {
    try {
        const { imageId } = req.params;
        
        const image = await PropertyImage.findOne({
            where: { id: imageId },
            include: [{
                model: Property,
                where: { userId: req.user.id }
            }]
        });

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found or unauthorized'
            });
        }

        // Delete from filesystem
        const imagePath = path.join(__dirname, '..', image.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await image.destroy();

        res.json({
            success: true,
            message: 'Image deleted successfully'
        });

    }      catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting image'
        });
    }
};

exports.updatePropertyStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        property.status = status;
        
        

        await property.save();

        res.json({
            success: true,
            message: 'Property status updated successfully'
        });

    } catch (error) {
        console.error('Error updating property status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating property status'
        });
    }
};

exports.getSimilarProperties = async (req, res) => {
    try {
        const { id } = req.params;
        
        const property = await Property.findByPk(id);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Find similar properties
        const similarProperties = await Property.findAll({
            where: {
                id: { [Op.ne]: id }, // Not the same property
                status: 'active',
                categoryId: property.categoryId,
                city: property.city,
                price: {
                    [Op.between]: [
                        property.price * 0.8, // 20% less
                        property.price * 1.2  // 20% more
                    ]
                }
            },
            include: [
                {
                    model: PropertyImage,
                    as: 'images',
                    where: { isPrimary: true },
                    required: false,
                    attributes: ['imageUrl']
                }
            ],
            limit: 6,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            data: similarProperties
        });

    } catch (error) {
        console.error('Error fetching similar properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching similar properties'
        });
    }
};