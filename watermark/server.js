import express from "express";
import history from "connect-history-api-fallback";

const app = express();
app.use(history());

const CSP_DOMAIN = process.env.VITE_CSP_DOMAIN || "*.filigrane.beta.gouv.fr";

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; " +
      `script-src 'self' ${CSP_DOMAIN} 'unsafe-inline' 'unsafe-eval' stats.beta.gouv.fr blob:; ` +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' stats.beta.gouv.fr data:; " +
      "font-src 'self' data:; " +
      "object-src 'none'; " +
      `connect-src https://sentry.incubateur.net stats.beta.gouv.fr ${CSP_DOMAIN} blob:; ` +
      "frame-src *.dossierfacile.fr; " +
      "manifest-src https://filigrane.beta.gouv.fr; " +
      "child-src *.dossierfacile.fr 'self'"
  );
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return next();
});

const directory = "/" + (process.env.STATIC_DIR || "dist");
app.use(express.static(import.meta.dirname + directory));

app.use(express.static(import.meta.dirname + directory));

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Listening on", port);
});
