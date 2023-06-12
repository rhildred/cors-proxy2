# cors-proxy2
[Cloudflare worker ](https://developers.cloudflare.com/pages/platform/functions/) to run with [Stackblitz.com](https://stackblitz.com) and [github.com](https://github.com).

To use:

`npm install --save-dev @rhildred/cors-proxy2`

put the url in the query string. For instance:

```javascript
        const res = await request(app)
        .get("/proxy?url=https://github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip");


```

Consume in cloudflare pages function. For instance in `functions/corsproxy/[[corsproxy]].js`:

```javascript
import { CorsProxyResponse } from '@rhildred/cors-proxy2';

export async function onRequest(context){
    return CorsProxyResponse.fetch(context.request, context.env);
}

```
or as a worker I think
```javascript
import { CorsProxyResponse } from '@rhildred/cors-proxy2';
export { CorsProxyResponse as default };
```

This code is based on the [cors-proxy](https://github.com/isomorphic-git/cors-proxy) code from isomorphic-git. It is refactored to be exposed as a cloudflare worker or pages function.

I am consuming the cloudflare pages function in [diy-pwa](https://github.com/diy-pwa/diy-pwa) and [git-pwa](https://github.com/diy-pwa/git-pwa). These projects are for a [stackblitz](https://stackblitz.com) development environment for sales engineers to make progressive web apps. The pwa is for hosting .svg configuration models and complements for business to business products.