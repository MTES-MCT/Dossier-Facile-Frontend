const express = require("express");
const history = require("connect-history-api-fallback");

const app = express();

app.use(history());

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' *.dossierfacile.fr https://www.google-analytics.com https://www.googletagmanager.com https://stats.data.gouv.fr https://www.google.com https://www.gstatic.com https://beacon-v2.helpscout.net *.inspectlet.com 'unsafe-inline' 'unsafe-eval' blob:; " +
      "style-src 'self' https://fonts.googleapis.com 'unsafe-inline'; " +
      "img-src 'self' https://www.google-analytics.com https://fonts.gstatic.com https://voxusagers.numerique.gouv.fr https://hn.inspectlet.com *.helpscout.net *.cloudfront.net *.gitbook.com data:; " +
      "font-src 'self' fonts.google.com https://fonts.gstatic.com fonts.googleapis.com data:; " +
      "object-src 'none'; " +
      "prefetch-src 'self'; " +
      "connect-src https://www.google-analytics.com https://stats.data.gouv.fr *.inspectlet.com wss://ws.inspectlet.com https://stats.g.doubleclick.net https://sso-preprod.dossierfacile.fr *.cloudfront.net *.dossierfacile.fr 'unsafe-eval' *.helpscout.net wss://ws-helpscout.pusher.com https://sockjs-helpscout.pusher.com blob:; " +
      "frame-src https://www.google.com *.dossierfacile.fr https://3689183.fls.doubleclick.net; " +
      "child-src *.dossierfacile.fr "
  );
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return next();
});

const directory = "/" + (process.env.STATIC_DIR || "dist");
app.use(express.static(__dirname + directory));

app.use("/robots.txt", express.static(__dirname + "robots.txt"));

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on", port);
});
