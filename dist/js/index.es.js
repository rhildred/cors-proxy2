const r = [
  "Accept-Encoding",
  "Accept-Language",
  "Accept",
  "Access-Control-Allow-Origin",
  "Authorization",
  "Cache-Control",
  "Content-Length",
  "Content-Type",
  "DNT",
  "Git-Protocol",
  "Pragma",
  "Range",
  "Referer",
  "User-Agent",
  "X-Authorization",
  "X-Http-Method-Override",
  "X-Requested-With"
], a = [
  "Accept-Ranges",
  "Age",
  "Cache-Control",
  "Content-Length",
  "Content-Language",
  "Content-Type",
  "Date",
  "Etag",
  "Expires",
  "Last-Modified",
  "Location",
  "Pragma",
  "Server",
  "Transfer-Encoding",
  "Vary",
  "X-Github-Request-ID",
  "X-Redirected-URL"
], d = [
  "POST",
  "GET",
  "OPTIONS"
];
class g {
  constructor(e) {
    typeof e < "u" && Object.assign(this, e);
  }
  /**
  * readRequestBody reads in the incoming request body
  * Use await readRequestBody(..) in an async function to get the string
  * @param {Request} request the incoming request to read from
  */
  async readRequestBody(e) {
    const n = e.headers.get("content-type");
    if (n.includes("application/json"))
      return JSON.stringify(await e.json());
    if (n.includes("application/text"))
      return e.text();
    if (n.includes("text/html"))
      return e.text();
    if (n.includes("form")) {
      const o = await e.formData(), t = {};
      for (const s of o.entries())
        t[s[0]] = s[1];
      return JSON.stringify(t);
    } else
      return await e.arrayBuffer();
  }
  async getResponse(e) {
    let n = new Headers();
    for (let t of r)
      e.headers.get(t) && n.append(t, e.headers.get(t));
    (!n.get("user-agent") || !n.get("user-agent").startsWith("git/")) && n.append("user-agent", "git/@isomorphic-git/cors-proxy");
    let o = null;
    if (e.method == "OPTIONS")
      o = new Response();
    else {
      let t = null;
      try {
        t = await fetch(
          this.url,
          {
            method: e.method,
            redirect: "manual",
            headers: n,
            body: e.method !== "GET" && e.method !== "HEAD" ? await this.readRequestBody(e) : void 0
          }
        );
      } catch (s) {
        console.log(s.toString()), console.log(""), console.log(JSON.stringify(e)), console.log(""), n.forEach(function(i, c) {
          console.log(c + ": " + i);
        });
      }
      o = new Response(t.body, t), o.statusCode = t.status;
      for (let s of a)
        s !== "content-length" && t.headers.has(s) && o.headers.set(s, t.headers.get(s));
      t.redirected && o.headers.set("x-redirected-url", t.url), o.headers.append("Vary", "Origin");
    }
    return o.headers.set("Access-Control-Allow-Origin", "*"), o.headers.set("Access-Control-Allow-Methods", d.join()), o.headers.set("Access-Control-Allow-Headers", r.join()), o.headers.set("Access-Control-Expose-Headers", a.join()), o.headers.set("Access-Control-Max-Age", "86400"), o;
  }
}
export {
  g as CorsProxyResponse
};
