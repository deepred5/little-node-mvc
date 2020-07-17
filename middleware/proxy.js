const c2k = require('koa2-connect')
const { createProxyMiddleware } = require('http-proxy-middleware');
const pathToRegexp = require('path-to-regexp');

// https://github.com/eggjs/egg/issues/916#issuecomment-373891756
module.exports = (options) => {
  const proxyArr = options.map((item) => {
    return {
      fn: c2k(createProxyMiddleware(item.config)),
      match: item.match,
    }
  })

  return async (context, next) => {
    const url = context.request.path;
    const matchProxy = proxyArr.find((item) => {
      return pathToRegexp(item.match).exec(url)
    });

    if (matchProxy) {
      matchProxy.fn(context, next);
    } else {
      await next()
    }
  }
}