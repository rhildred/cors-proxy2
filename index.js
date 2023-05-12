'use strict'
const {send} = require('micro')
const origin = process.env.ALLOW_ORIGIN
const insecure_origins = (process.env.INSECURE_HTTP_ORIGINS || '').split(',')
const middleware = require('./middleware.js')({ origin, insecure_origins })

async function service (req, res) {
  middleware(req, res);
}

module.exports = service
