const express = require("express");
const history = require("connect-history-api-fallback");

const app = express();
app.use(history());

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; " +
      "script-src 'self' *.dossierfacile.fr blob:; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' https://www.google-analytics.com https://fonts.gstatic.com https://voxusagers.numerique.gouv.fr https://hn.inspectlet.com *.helpscout.net *.cloudfront.net *.gitbook.com data:; " +
      "font-src 'self' data:; " +
      "object-src 'none'; " +
      "prefetch-src 'self'; " +
      "connect-src *.dossierfacile.fr https://dossierfacile-filigrane-preprod.osc-fr1.scalingo.io blob:; " +
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
