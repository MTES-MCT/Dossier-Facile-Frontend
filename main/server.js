const express = require("express");
const history = require("connect-history-api-fallback");

const app = express();

app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; " +
      "script-src 'self' *.dossierfacile.fr https://www.google-analytics.com https://stats.data.gouv.fr https://www.googletagmanager.com *.inspectlet.com https://beacon-v2.helpscout.net 'unsafe-eval' 'unsafe-inline' ; " +
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com ; " +
      "img-src 'self' https://www.google-analytics.com *.helpscout.net *.cloudfront.net *.gitbook.com data:; " +
      "font-src 'self' fonts.gstatic.com fonts.google.com fonts.googleapis.com data:; object-src 'none'; " +
      "prefetch-src 'self'; " +
      "frame-src *.fls.doubleclick.net/" +
      "connect-src https://www.google-analytics.com  https://stats.data.gouv.fr *.inspectlet.com wss://ws.inspectlet.com https://stats.g.doubleclick.net https://sheets.googleapis.com *.helpscout.net wss://ws-helpscout.pusher.com https://sockjs-helpscout.pusher.com *.cloudfront.net *.dossierfacile.fr"
  );
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  return next();
});

const directory = "/" + (process.env.STATIC_DIR || "dist");
app.use(express.static(__dirname + directory));

app.use(history());

app.use(express.static(__dirname + directory));

// app.get("*", function(req, res) {
//   res.status(404);
//   res.sendFile(path.join(__dirname + directory, "404/index.html"));
//   return;
// });

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on", port);
});
