import express from 'express';
import CorsProxyResponse from './CorsProxyResponse.js';
export default () => {
    const app = express();
    app.all(/^\/.*corsproxy/, async (req, res) => {
        const apiUrl = req.url.replace(/^.*corsproxy/, "https:/");
        const oResponseFactory = new CorsProxyResponse({ url: apiUrl });
        const oResponse = await oResponseFactory.getExpressResponse(req);
        res.set(oResponse.headersHash);
        res.send(oResponse.body);
    });
    return app;
}