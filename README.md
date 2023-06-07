# cors-proxy2
[Cloudflare pages](https://developers.cloudflare.com/pages/platform/functions/) function to run with [Stackblitz.com](https://stackblitz.com) and [github.com](https://github.com).

To use:

`npm install --save-dev @rhildred/cors-proxy2`

Consume in cloudflare pages function. For instance in `functions/corsproxy/[[corsproxy]].js`:

```javascript

import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    const apiUrl = context.request.url.replace(/^.*corsproxy/, "https://codeload.github.com");

    const oResponseFactory = new CorsProxyResponse({url:apiUrl});
    return await oResponseFactory.getResponse(context.request);
}

```

or in `functions/gitcorsproxy/[[gitcorsproxy]].js`

```javascript

import {CorsProxyResponse} from "@rhildred/cors-proxy2";

export async function onRequest(context) {
    const apiUrl = context.request.url.replace(/^.*gitcorsproxy/, "https:/");

    const oResponseFactory = new CorsProxyResponse({ url: apiUrl });
    return await oResponseFactory.getResponse(context.request);
}
```

This code is based on the [cors-proxy](https://github.com/isomorphic-git/cors-proxy) code from isomorphic-git. It is refactored to be exposed as a cloudflare pages function.

I am consuming the cloudflare pages function in [diy-pwa](https://github.com/diy-pwa/diy-pwa) and [git-pwa](https://github.com/diy-pwa/git-pwa). These projects are for a [stackblitz](https://stackblitz.com) development environment for sales engineers to make progressive web apps. The pwa is for hosting .svg configuration models and complements for business to business products.