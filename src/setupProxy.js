const {createProxyMiddleware} = require('http-proxy-middleware')

const BE_SERVER_URL = process.env.REACT_APP_BE_SERVER_URL

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: BE_SERVER_URL,
    changeOrigin: true,
  }))
}
