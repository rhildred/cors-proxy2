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
  
  export default class {
    constructor(options) {
      if (typeof (options) != "undefined") {
        Object.assign(this, options);
      }
    }
    /**
  * readRequestBody reads in the incoming request body
  * Use await readRequestBody(..) in an async function to get the string
  * @param {Request} request the incoming request to read from
  */
    async readRequestBody(request) {
      const contentType = request.headers.get("content-type");
      if (contentType.includes("application/json")) {
        return JSON.stringify(await request.json());
      } else if (contentType.includes("application/text")) {
        return request.text();
      } else if (contentType.includes("text/html")) {
        return request.text();
      } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
      } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        return await request.arrayBuffer();
      }
    }
  
    async getResponse(req) {
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
      if(req.method == "OPTIONS"){
        res = new Response();
      }else{
        let f = null;
        try{
          f = await fetch(
            this.url,
            {
              method: req.method,
              redirect: 'manual',
              headers,
              body: (req.method !== 'GET' && req.method !== 'HEAD') ? await this.readRequestBody(req) : undefined
            }
          )
        }catch(e){
          console.log(e.toString());
          console.log("");
          console.log(JSON.stringify(req));
          console.log("");
          headers.forEach(function(value, name) {
            console.log(name + ": " + value);
          });
        
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