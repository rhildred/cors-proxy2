import { describe, it, expect } from 'vitest';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';

describe("test isogit with my corsproxy", ()=>{
    it('clones from cloudflare', async () => {
        await git.clone({
            corsProxy: 'https://corsproxy-dqo.pages.dev/gitcorsproxy',
            url: 'https://github.com/isomorphic-git/isomorphic-git',
            ref: 'main',
            singleBranch: true,
            depth: 10,
            dir: 'test2',
            fs: fs,
            http
          });
          expect(true).toBe(true);
    }, 20000);
    it.skip('clones from cors-proxy', async () => {
        await git.clone({
            corsProxy: 'http://127.0.0.1:9999',
            url: 'https://github.com/isomorphic-git/isomorphic-git',
            ref: 'main',
            singleBranch: true,
            depth: 10,
            dir: 'test2',
            fs: fs,
            http
          });
          expect(true).toBe(true);
    }, 10000);
    it("tests options request", async ()=>{
        const res = await fetch("https://corsproxy-dqo.pages.dev/gitcorsproxy",{
            method: "OPTIONS"
        });
        expect(res.status).toBe(200);
    });
    it.skip("tests options request", async ()=>{
        const res = await fetch("http://127.0.0.1:8788/gitcorsproxy",{
            method: "OPTIONS"
        });
        expect(res.status).toBe(200);
    });
});
