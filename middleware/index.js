const init = require('./init');
const route = require('./route');
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const proxy = require('./proxy');
const healthcheck = require('./healthcheck');

module.exports = {
  init,
  route,
  views,
  bodyParser,
  proxy,
  healthcheck
}