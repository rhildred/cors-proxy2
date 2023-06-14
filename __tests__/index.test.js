import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from './expressFixture.js';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';

describe("tests proxy cloudflare worker", ()=>{
    it("gets .zip from github", async () =>{
        const app = createApp();
        const res = await request(app)
        .get("/proxy?url=https://github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip");
        if(res.status < 200 || res.status >= 300 ){
            console.log(res.body);
        }
        expect(res.status).toBe(200);
    }, 10000);
    it("gets a gzip encoding", async ()=>{
        const app = createApp();
        const res = await request(app).get("/proxy?url=https://github.com");
        if(res.status < 200 || res.status >= 300 ){
            console.log(res.body);
        }
        expect(res.status).toBe(200);
    });
    it.skip("gets a video", async ()=>{
        const app = createApp();
        const res = await request(app).get("/proxy?url=https://upos-bstar1-mirrorakam.akamaized.net/iupxcodeboss/93/uf/n230227a22gp1g8rbem9rq3vidahuf93-1-241210110000.m4s?e=ig8euxZM2rNcNbdlhoNvNC8BqJIzNbfqXBvEqxTEto8BTrNvN0GvT90W5JZMkX_YN0MvXg8gNEV4NC8xNEV4N03eN0B5tZlqNxTEto8BTrNvNeZVuJ10Kj_g2UB02J0mN0B5tZlqNCNEto8BTrNvNC7MTX502C8f2jmMQJ6mqF2fka1mqx6gqj0eN0B599M=&uipk=5&nbs=1&deadline=1686715247&gen=playurlv2&os=akam&oi=1920855523&trid=c1bf1e93872b47ad8cb6c01a621235b0i&mid=1394409533&platform=pc&upsig=fabf28ea04e53f286acde30e5829ea08&uparams=e,uipk,nbs,deadline,gen,os,oi,trid,mid,platform&hdnts=exp=1686715247~hmac=06101d08cfc579c548552c3a4f62a4e6f2604c505eeb9f546cc93ffd8c07de0e&bvc=vod&nettype=0&orderid=0,2&logo=00000000")
        if(res.status < 200 || res.status >= 300 ){
            console.log(res.body);
        }
        expect(res.status).toBe(200);
    });
    it.skip("clones a git repo", async ()=>{
        const app = createApp();
        const server = await app.listen(8080);
        await git.clone({
            corsProxy: 'http://127.0.0.1:8080/proxy',
            url: 'https://github.com/isomorphic-git/isomorphic-git',
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