const express = require('express')
const history = require('connect-history-api-fallback')

const app = express()
app.use(history())

app.use(function (req, res, next) {
  res.setHeader('Content-Security-Policy', process.env.OWNER_CSP)
  res.setHeader('X-Frame-Options', 'deny')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  return next()
})

const directory = '/' + (process.env.STATIC_DIR || 'dist')
app.use(express.static(__dirname + directory))

app.use(express.static(__dirname + directory))

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log('Listening on', port)
})
