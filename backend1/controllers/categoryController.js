const db = require('../models');
const Category = db.Category;
const SubCategory = db.SubCategory;
const {op} = require('sequelize');


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { isActive: true },
            attributes: ['id', 'name', 'slug', 'description', 'icon', 'image', 'displayOrder'],
            include: [{
                model: SubCategory,
                as: 'subcategories',
                where: { isActive: true },
                required: false,
                attributes: ['id', 'name', 'slug', 'description', 'icon', 'image', 'displayOrder', 'propertyType']
            }],
            order: [
                ['displayOrder', 'ASC'],
                ['name', 'ASC'],
                [{ model: SubCategory, as: 'subcategories' }, 'displayOrder', 'ASC']
            ]
        });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories'
        });
    }
};

exports.getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        
        const category = await Category.findOne({
            where: { slug, isActive: true },
            include: [{
                model: SubCategory,
                as: 'subcategories',
                where: { isActive: true },
                required: false
            }]
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category'
        });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description, icon, image, displayOrder, metaTitle, metaDescription } = req.body;
        
        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Check if slug already exists
        const existingCategory = await Category.findOne({ where: { slug } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category with similar name already exists'
            });
        }

        const category = await Category.create({
            name,
            slug,
            description,
            icon,
            image,
            displayOrder: displayOrder || 0,
            metaTitle,
            metaDescription
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category'
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon, image, displayOrder, isActive, metaTitle, metaDescription } = req.body;
        
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // If name is changing, update slug
        let slug = category.slug;
        if (name && name !== category.name) {
            slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        await category.update({
            name: name || category.name,
            slug,
            description: description !== undefined ? description : category.description,
            icon: icon !== undefined ? icon : category.icon,
            image: image !== undefined ? image : category.image,
            displayOrder: displayOrder !== undefined ? displayOrder : category.displayOrder,
            isActive: isActive !== undefined ? isActive : category.isActive,
            metaTitle: metaTitle !== undefined ? metaTitle : category.metaTitle,
            metaDescription: metaDescription !== undefined ? metaDescription : category.metaDescription
        });

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category'
        });
    }
};


// Delete category (Admin only)
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if category has properties
        const propertyCount = await db.Property.count({ where: { categoryId: id } });
        if (propertyCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${propertyCount} properties are associated with it.`
            });
        }

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        await category.destroy();

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category'
        });
    }
};

// Get subcategories by category
exports.getSubcategoriesByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        
        const subcategories = await SubCategory.findAll({
            where: { 
                categoryId,
                isActive: true 
            },
            attributes: ['id', 'name', 'slug', 'description', 'icon', 'minBedrooms', 'maxBedrooms', 'propertyType'],
            order: [['displayOrder', 'ASC'], ['name', 'ASC']]
        });

        res.json({
            success: true,
            data: subcategories
        });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching subcategories'
        });
    }
};

// Create subcategory (Admin only)
exports.createSubcategory = async (req, res) => {
    try {
        const { 
            categoryId, 
            name, 
            description, 
            icon, 
            image, 
            displayOrder, 
            minBedrooms, 
            maxBedrooms, 
            allowCommercial 
        } = req.body;
        
        // Generate slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Check if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if slug already exists in this category
        const existingSubcategory = await SubCategory.findOne({ 
            where: { categoryId, slug } 
        });
        if (existingSubcategory) {
            return res.status(400).json({
                success: false,
                message: 'Subcategory with similar name already exists in this category'
            });
        }

        const subcategory = await SubCategory.create({
            categoryId,
            name,
            slug,
            description,
            icon,
            image,
            displayOrder: displayOrder || 0,
            minBedrooms: minBedrooms || 0,
            maxBedrooms: maxBedrooms || 10,
            allowCommercial: allowCommercial || false
        });

        res.status(201).json({
            success: true,
            message: 'Subcategory created successfully',
            data: subcategory
        });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating subcategory'
        });
    }
};
