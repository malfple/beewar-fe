import config from './config/config'

const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app) {
  app.use('/api', createProxyMiddleware({
    target: config.BEServer,
    changeOrigin: true,
  }))
}
