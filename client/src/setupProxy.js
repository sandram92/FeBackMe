const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use(
    ["/auth", "/api"],
    createProxyMiddleware({
      target: "http://localhost:8001",
      changeOrigin: true,
    }),
  );
};