import { describe, it, expect } from 'vitest';
import createApp from '../src/ExpressProxy.js';
import request from 'supertest';

describe("tests for ExpressProxyResponse", () => {

    it('cors headers', async () => {
        const app = createApp();
        const res = await request(app).get("/corsproxy/codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main");
        expect(res.status).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe("*");
    });
    it('cors OPTIONS headers', async () => {
        const app = createApp();
        const res = await request(app).options("/corsproxy/codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main");
        expect(res.status).toBe(200);
        expect(res.headers['access-control-allow-origin']).toBe("*");
    });

    it('content-type', async () => {
        const app = createApp();
        const res = await request(app).get("/corsproxy/codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main");
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain("application/zip");
    });

    it('same thing should work at gitcorsproxy', async () => {
        const app = createApp();
        const res = await request(app).get("/gitcorsproxy/codeload.github.com/diy-pwa/coming-soon/zip/refs/heads/main");
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain("application/zip");
    });
});
