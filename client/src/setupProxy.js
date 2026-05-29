const { createProxyMiddleware } = require("http-proxy-middleware");

const target = process.env.REACT_APP_API_PROXY || "http://localhost:8001";

console.log("target", target)

module.exports = function setupProxy(app) {
  app.use(
    ["/auth", "/api"],
    createProxyMiddleware({
      target,
      xfwd: true,
    }),
  );
};
