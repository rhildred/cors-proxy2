import express from 'express';
import origin from '../src/CorsProxyResponse.js';
import { workersAdapter } from 'cloudflare2express';
import dotenv from 'dotenv';

dotenv.config();

export default () => {
  const app = express();
  app.all(/\/proxy/, express.raw({
    inflate: true,
    limit: '50mb',
    type: () => true // this matches all content types for this route
  }), async (req, res) => {
    req.url = req.url.replace(/^.*proxy/, "https:/");
    workersAdapter(origin, req, res);
  });
  return app;
}