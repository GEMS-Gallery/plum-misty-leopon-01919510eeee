import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Grid, Card, CardContent, CardActions, IconButton } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { backend } from 'declarations/backend';

interface Project {
  id: bigint;
  title: string;
  category: string;
  description: string | null;
  author: string;
  stars: bigint;
}

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const result = await backend.getProjects();
      setProjects(result);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCategoryClick = async (category: string) => {
    setSelectedCategory(category);
    try {
      const result = await backend.getProjectsByCategory(category);
      setProjects(result);
    } catch (error) {
      console.error('Error fetching projects by category:', error);
    }
  };

  const handleStar = async (id: bigint, isStarred: boolean) => {
    try {
      if (isStarred) {
        await backend.unstarProject(id);
      } else {
        await backend.starProject(id);
      }
      fetchProjects();
    } catch (error) {
      console.error('Error starring/unstarring project:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            GEM's Showcase
          </Typography>
          <Button color="inherit">Start Building</Button>
          <Button color="inherit">Learn</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Button
              onClick={() => handleCategoryClick('Corporate')}
              variant={selectedCategory === 'Corporate' ? 'contained' : 'outlined'}
              fullWidth
              sx={{ mb: 1 }}
            >
              Corporate
            </Button>
            <Button
              onClick={() => handleCategoryClick('Creative')}
              variant={selectedCategory === 'Creative' ? 'contained' : 'outlined'}
              fullWidth
              sx={{ mb: 1 }}
            >
              Creative
            </Button>
            <Button
              onClick={() => handleCategoryClick('Technology')}
              variant={selectedCategory === 'Technology' ? 'contained' : 'outlined'}
              fullWidth
              sx={{ mb: 1 }}
            >
              Technology
            </Button>
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              Projects
            </Typography>
            <Grid container spacing={3}>
              {projects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={Number(project.id)}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{project.title}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {project.category}
                      </Typography>
                      <Typography variant="body2">
                        {project.description || 'No description available'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Author: {project.author}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton
                        onClick={() => handleStar(project.id, Number(project.stars) > 0)}
                        color="primary"
                      >
                        {Number(project.stars) > 0 ? <Star /> : <StarBorder />}
                      </IconButton>
                      <Typography>{Number(project.stars)}</Typography>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default App;
