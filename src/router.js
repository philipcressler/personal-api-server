import express from 'express';
import { githubWebhook, getAllGithubEvents } from './controllers/WebhooksController'
import { getRecentTwitterActivity } from './controllers/TwitterController';
// Middleware to require login/auth

// Constants for role types

const routes = (app) => {
  // Initializing route groups
  const apiRoutes = express.Router();
  const webhooksRoutes = express.Router();
  const clientRoutes = express.Router();
  //=========================
  // Webhook Routes
  //=========================

  // Set webhooks routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/webhooks', webhooksRoutes);

  // github route
  webhooksRoutes.post('/github', githubWebhook);


  //==========================
  // Client API Routes
  //==========================

  apiRoutes.use('/client', clientRoutes);

  clientRoutes.get('/github_events', getAllGithubEvents);
  clientRoutes.get('/twitter_events', getRecentTwitterActivity);
  // Set url for API group routes
  app.use('/api', apiRoutes);
};

export default routes;