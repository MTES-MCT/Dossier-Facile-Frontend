var express = require("express");
var history = require('connect-history-api-fallback');

var app = express();
app.use(history());

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self' *.dossierfacile.fr https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.gstatic.com https://beacon-v2.helpscout.net *.inspectlet.com 'unsafe-inline' 'unsafe-eval'; style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; img-src 'self' https://www.google-analytics.com https://fonts.gstatic.com https://voxusagers.numerique.gouv.fr data:; font-src 'self' fonts.google.com https://fonts.gstatic.com fonts.googleapis.com data:; object-src 'none'; prefetch-src 'self'; connect-src https://www.google-analytics.com *.inspectlet.com https://stats.g.doubleclick.net https://sso-preprod.dossierfacile.fr *.cloudfront.net *.dossierfacile.fr 'unsafe-eval' https://beacon-v2.helpscout.net; frame-src https://www.google.com"
  );
  res.setHeader("X-Frame-Options", "deny");
  return next();
});

var directory = "/" + (process.env.STATIC_DIR || "dist");
app.use(express.static(__dirname + directory));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on", port);
});
