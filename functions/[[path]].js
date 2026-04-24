export async function onRequest(context) {
  const { request, next } = context;
  const acceptHeader = request.headers.get("Accept") || "";

  // Check if the agent prefers Markdown
  if (acceptHeader.includes("text/markdown")) {
    const url = new URL(request.url);
    
    // If requesting the homepage, serve index.md instead
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const mdUrl = new URL("/index.md", request.url);
      const response = await fetch(mdUrl.toString());
      
      if (response.ok) {
        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Content-Type", "text/markdown; charset=utf-8");
        newResponse.headers.set("x-markdown-negotiated", "true");
        return newResponse;
      }
    }
  }

  // Fallback to default behavior (serve HTML)
  return next();
}
