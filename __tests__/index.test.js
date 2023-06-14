import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import createApp from './expressFixture.js';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';

beforeEach(async()=>{
    await fs.promises.rm("test2", { recursive: true, force: true });
});
describe("tests proxy cloudflare worker", ()=>{
    it("gets .zip from github", async () =>{
        const app = createApp();
        const res = await request(app)
        .get("/corsproxy/github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip");
        if(res.status < 200 || res.status >= 300 ){
            console.log(res.body);
        }
        expect(res.status).toBe(200);
    }, 10000);
    it("gets a gzip encoding", async ()=>{
        const app = createApp();
        const res = await request(app).get("/corsproxy/github.com");
        if(res.status < 200 || res.status >= 300 ){
            console.log(res.body);
        }
        expect(res.status).toBe(200);
    });
    it("clones a git repo", async ()=>{
        const app = createApp();
        const server = await app.listen(8080);
        await git.clone({
            corsProxy: 'http://127.0.0.1:8080/corsproxy',
            url: 'https://github.com/rhildred/cors-proxy2',
            ref: 'main',
            singleBranch: true,
            depth: 10,
            dir: 'test2',
            fs: fs,
            http
        });  
        await server.close();
        expect(true).toBe(true);

    }, 20000);
})