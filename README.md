# cors-proxy2
[Cloudflare worker ](https://developers.cloudflare.com/pages/platform/functions/) to run with [Stackblitz.com](https://stackblitz.com) and [github.com](https://github.com).

To use:

`npm install --save-dev @rhildred/cors-proxy2`

put the url in the path. For instance:

```javascript
const res = await request(app).get("/corsproxy/github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip");
```

Consume in cloudflare pages function. For instance in `functions/corsproxy/[[corsproxy]].js`:

```javascript
import { CorsProxyResponse } from '@rhildred/cors-proxy2';

export async function onRequest(context){
    context.env.url = context.request.url.replace(/^.*corsproxy/, "https:/");
    return CorsProxyResponse.fetch(context.request, context.env);
}

```

or as a worker I think. You will need to use a bundler.

```javascript
import { CorsProxyResponse } from '@rhildred/cors-proxy2';
export default { 
    fetch(req, env){
        env.url = req.url.replace(/^.*corsproxy/, "https:/");
        return CorsProxyResponse.fetch(req, env);
    }
};
```

This code is based on the [cors-proxy](https://github.com/isomorphic-git/cors-proxy) code from isomorphic-git. It is refactored to be exposed as a cloudflare worker or pages function.

I am super excited about the tests for this cloudflare pages function/worker. Particularly this one:

```
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from './expressFixture.js';
import git from 'isomorphic-git';
import fs from 'fs';
import http from 'isomorphic-git/http/web';


...

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

```
It is exciting to me for 2 reasons. It is self contained. It consumes the actual proxy using the main use case. To use with isomorphic git.

I am consuming the cloudflare pages function in [diy-pwa](https://github.com/diy-pwa/diy-pwa) and [git-pwa](https://github.com/diy-pwa/git-pwa). These projects are for a [stackblitz](https://stackblitz.com) development environment for sales engineers to make progressive web apps. The pwa is for hosting .svg configuration models and complements for business to business products.