import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  CategoryRounded,
  FolderRounded
} from '@mui/icons-material';
import { categoryAPI } from '../../api/category';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

export default function CategoriesMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryAPI.getAllCategories();
      setCategories(data.categories || data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (category: Category) => {
    console.log('Category clicked:', category);
    // Add navigation logic here if needed
  };

  const handleSubcategoryClick = (subcategory: Subcategory) => {
    console.log('Subcategory clicked:', subcategory);
    // Add navigation logic here if needed
  };

  if (loading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" size="small">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography 
        variant="subtitle2" 
        sx={{ 
          px: 2, 
          py: 1, 
          color: 'text.secondary',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontSize: '0.75rem'
        }}
      >
        Categories
      </Typography>
      
      <List dense>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleCategoryClick(category)}
                sx={{ 
                  borderRadius: 1,
                  mb: 0.5,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CategoryRounded fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={category.name}
                  secondary={category.description}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    noWrap: true
                  }}
                />
                {category.subcategories && category.subcategories.length > 0 && (
                  <Chip 
                    label={category.subcategories.length} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '0.7rem',
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
            
            {category.subcategories && category.subcategories.length > 0 && (
              <Collapse 
                in={expandedCategories[category.id]} 
                timeout="auto" 
                unmountOnExit
              >
                <List component="div" disablePadding dense>
                  {category.subcategories.map((subcategory) => (
                    <ListItem key={subcategory.id} disablePadding>
                      <ListItemButton
                        onClick={() => handleSubcategoryClick(subcategory)}
                        sx={{ 
                          pl: 4,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <FolderRounded fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={subcategory.name}
                          primaryTypographyProps={{
                            variant: 'caption',
                            fontWeight: 400
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
      
      {categories.length === 0 && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No categories found
          </Typography>
        </Box>
      )}
    </Box>
  );
}
