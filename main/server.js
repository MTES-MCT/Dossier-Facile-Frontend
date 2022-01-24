var express = require("express");
var history = require('connect-history-api-fallback');

var app = express();
app.use(history());

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; script-src 'self' *.dossierfacile.fr https://www.google-analytics.com https://www.googletagmanager.com *.inspectlet.com ; style-src 'self' 'unsafe-inline'; img-src 'self' https://www.google-analytics.com *.helpscout.net data:; font-src 'self' fonts.google.com fonts.googleapis.com data:; object-src 'none'; prefetch-src 'self'; connect-src https://www.google-analytics.com *.inspectlet.com https://stats.g.doubleclick.net https://sheets.googleapis.com *.helpscout.net"
  );
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return next();
});

var directory = "/" + (process.env.STATIC_DIR || "dist");
app.use(express.static(__dirname + directory));

app.use("/robots.txt", express.static(__dirname + "robots.txt"));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on", port);
});
