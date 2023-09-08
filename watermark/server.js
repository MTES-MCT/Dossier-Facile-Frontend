const express = require("express");
const history = require("connect-history-api-fallback");

const app = express();
app.use(history());

const CSP_DOMAIN =  process.env.VITE_CSP_DOMAIN || '*.filigrane.beta.gouv.fr';

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; " +
      `script-src 'self' ${CSP_DOMAIN}  blob:; ` +
      "style-src 'self'; " +
      "img-src 'self' data:; " +
      "font-src 'self' data:; " +
      "object-src 'none'; " +
      `connect-src https://sentry.incubateur.net ${CSP_DOMAIN} blob:; ` +
      "frame-src *.dossierfacile.fr; " +
      "child-src *.dossierfacile.fr"
  );
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return next();
});

const directory = "/" + (process.env.STATIC_DIR || "dist");
app.use(express.static(__dirname + directory));

app.use(express.static(__dirname + directory));

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on", port);
});
