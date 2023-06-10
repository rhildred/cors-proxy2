# cors-proxy2
[Cloudflare pages](https://developers.cloudflare.com/pages/platform/functions/) function or express app to run with [Stackblitz.com](https://stackblitz.com) and [github.com](https://github.com).

To use:

`npm install --save-dev @rhildred/cors-proxy2`

Consume in cloudflare pages function. For instance in `functions/corsproxy/[[corsproxy]].js`:

```javascript

CorsProxyResponse({ url: apiUrl });

export async function onRequest(context) {
    const apiUrl = context.request.url.replace(/^.*corsproxy/, "https://codeload.github.com");

    const oResponseFactory = new CorsProxyResponse({url:apiUrl});
    return await oResponseFactory.getResponse(context.request);
}
```
This code can also be consumed in express using the wrapper at [https://github.com/diy-pwa/cloudflare2express](https://github.com/diy-pwa/cloudflare2express).

This code is based on the [cors-proxy](https://github.com/isomorphic-git/cors-proxy) code from isomorphic-git. It is refactored to be exposed as a cloudflare pages function or in an express app.

I am consuming the cloudflare pages function in [diy-pwa](https://github.com/diy-pwa/diy-pwa) and [git-pwa](https://github.com/diy-pwa/git-pwa). These projects are for a [stackblitz](https://stackblitz.com) development environment for sales engineers to make progressive web apps. The pwa is for hosting .svg configuration models and complements for business to business products.