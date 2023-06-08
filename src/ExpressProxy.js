import express from 'express';
import CorsProxyResponse from './CorsProxyResponse.js';
import { pipeline } from 'stream/promises';
import bodyParser from 'body-parser';
export default () => {
    const app = express();
    app.use(
        bodyParser.raw({
          inflate: true,
          limit: '50mb',
          type: () => true, // this matches all content types
        })
      );
    app.all(/^\/.*corsproxy/, async (req, res) => {
        const apiUrl = req.url.replace(/^.*corsproxy/, "https:/");
        const oResponseFactory = new CorsProxyResponse({ url: apiUrl });
        const oResponse = await oResponseFactory.getExpressResponse(req);
        res.set(oResponse.headersHash);
        if (oResponse.body) {
            await pipeline(oResponse.body, res);
        } else {
            // options doesn't have body
            res.end();
        }

    });
    return app;
}