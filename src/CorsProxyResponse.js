import { readRequestBody } from "diy-pwa";

const allowHeaders = [
    'Accept-Encoding',
    'Accept-Language',
    'Accept',
    'Access-Control-Allow-Origin',
    'Authorization',
    'Cache-Control',
    'Content-Length',
    'Content-Type',
    'DNT',
    'Git-Protocol',
    'Pragma',
    'Range',
    'Referer',
    'User-Agent',
    'X-Authorization',
    'X-Http-Method-Override',
    'X-Requested-With',
];
const exposeHeaders = [
    'Accept-Ranges',
    'Age',
    'Cache-Control',
    'Content-Length',
    'Content-Language',
    'Content-Type',
    'Date',
    'Etag',
    'Expires',
    'Last-Modified',
    'Location',
    'Pragma',
    'Server',
    'Transfer-Encoding',
    'Vary',
    'X-Github-Request-ID',
    'X-Redirected-URL',
];
const allowMethods = [
    'POST',
    'GET',
    'OPTIONS'
];

export default {

    async fetch(req, env) {
        const proxyUrl = new URL(req.url, 'http://dummy').searchParams.get("url");
        let headers = new Headers();
        for (let h of allowHeaders) {
            if (req.headers.get(h)) {
                headers.append(h, req.headers.get(h));
            }
        }

        // GitHub uses user-agent sniffing for git/* and changes its behavior which is frustrating
        if (!headers.get('user-agent') || !headers.get('user-agent').startsWith('git/')) {
            headers.append('user-agent', 'git/@isomorphic-git/cors-proxy');
        }

        let res = null;
        if (req.method == "OPTIONS") {
            res = new Response();
        } else {
            let f = null;
            if(env.fetch){
                f = await env.fetch(
                    proxyUrl,
                    {
                        compress: false,
                        method: req.method,
                        headers,
                        body: (req.method !== 'GET' && req.method !== 'HEAD') ? await readRequestBody(req) : undefined
                    }
                )
            } else {
                f = await fetch(
                    proxyUrl,
                    {
                        method: req.method,
                        headers,
                        body: (req.method !== 'GET' && req.method !== 'HEAD') ? await readRequestBody(req) : undefined
                    }
                )

            }
            // Recreate the response so you can modify the headers
            res = new Response(f.body, f);
            res.statusCode = f.status
            // Set headers
            for (let h of exposeHeaders) {
                if (h === 'content-length') continue
                if (f.headers.has(h)) {
                    res.headers.set(h, f.headers.get(h))
                }
            }
            if (f.redirected) {
                res.headers.set('x-redirected-url', f.url)
            }
            // Append to/Add Vary header so browser will cache response correctly
            res.headers.append("Vary", "Origin");
        }
        res.headers.set("Access-Control-Allow-Origin", "*");
        res.headers.set("Access-Control-Allow-Methods", allowMethods.join());
        res.headers.set("Access-Control-Allow-Headers", allowHeaders.join());
        res.headers.set("Access-Control-Expose-Headers", exposeHeaders.join());
        res.headers.set("Access-Control-Max-Age", "86400");
        return res;
    }
}