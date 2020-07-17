const Router = require('koa-router');
const koaCompose = require('koa-compose')
const a = require('../loader/controller');

module.exports = (routerConfig, loader) => {
  const router = new Router();

  if (routerConfig && routerConfig.length) {
    routerConfig.forEach((routerInfo) => {
      let { match, method = 'get', controller, middlewares } = routerInfo;
      let args = [match];

      if (method === '*') {
        method = 'all'
      }

      if ((middlewares && middlewares.length)) {
        args = args.concat(middlewares)
      };

      controller && args.push(async (context, next) => {
        // 找到controller
        const arr = controller.split('.');
        if (arr && arr.length) {
          const controllerName = arr[0];
          const controllerMethod = arr[1];
          const controllerClass = loader.getClass(controllerName);

          // controller每次请求都要重新new一个，因为每次请求context都是新的
          const controller = new controllerClass(context, next);
          if (controller && controller[controllerMethod]) {
            // await记得！！！
            await controller[controllerMethod](context, next);
          }
        } else {
          await next();
        }
      });


      if (router[method] && router[method].apply) {
        // apply的妙用
        // router.get('/tc', fn1, fn2, fn3);
        router[method].apply(router, args)
      }
    })
  }

  return koaCompose([router.routes(), router.allowedMethods()])
}