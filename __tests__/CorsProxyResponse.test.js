import { describe, it, expect } from 'vitest';
import CorsProxyResponse from '../src/CorsProxyResponse.js';

describe("tests for CorsProxyResponse", () => {

    it('cors headers', async () => {
        const oResponseFactory = new CorsProxyResponse({url:"https://codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main"});
        const oResponse = await oResponseFactory.getResponse({method:'GET', headers: new Headers()});
        expect(oResponse.headers.get('Access-Control-Allow-Origin')).not.toBe(null);
    });
    it('cors OPTIONS headers', async () => {
        const oResponseFactory = new CorsProxyResponse({url:"https://codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main"});
        const oResponse = await oResponseFactory.getResponse({method:'OPTIONS', headers: new Headers()});
        expect(oResponse.headers.get('Access-Control-Allow-Origin')).not.toBe(null);
    });

    it('content-type', async () => {
        const oResponseFactory = new CorsProxyResponse({url:"https://codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main"});
        const oResponse = await oResponseFactory.getResponse({method:'GET', headers:new Headers()});
        expect(oResponse.headers.get('content-type')).toBe("application/zip");
    });
});