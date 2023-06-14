import express from 'express';
import origin from '../src/CorsProxyResponse.js';
import { workersAdapter } from 'cloudflare2express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

export default () => {
  const app = express();
  app.all(/\/corsproxy/, express.raw({
    inflate: true,
    limit: '50mb',
    type: () => true // this matches all content types for this route
  }), async (req, res) => {
    const apiUrl = req.url.replace(/^.*corsproxy/, "https:/");
    workersAdapter(origin, req, res, {fetch:fetch, url: apiUrl});
  });
  return app;
}