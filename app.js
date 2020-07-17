const Koa = require('koa');
const path = require('path');
const middleware = require('./middleware');
const utils = require('./util');
const ControllerLoader = require('./loader/controller');
const ServiceLoader = require('./loader/service');

class App extends Koa {
  constructor(options) {
    super();
    const { projectRoot, rootControllerPath, rootServicePath, rootViewPath } = options;
    if (!projectRoot) {
      throw new Error('projectRoot must specialfied')
    }

    this.rootControllerPath = rootControllerPath || path.join(projectRoot, 'controllers')
    this.rootServicePath = rootServicePath || path.join(projectRoot, 'services')
    this.rootViewPath = rootViewPath || path.join(projectRoot, 'views')

    this.options = options;

    this.initController();
    this.initService();
    this.initMiddleware();
  }

  createContext(req, res) {
    const context = super.createContext(req, res);
    // 注入全局方法
    this.injectUtil(context);

    // 注入Services
    this.injectService(context);
    return context
  }

  injectUtil(context) {
    utils.forEach(util => util(context));
  }

  injectService(context) {
    const serviceLoader = this.serviceLoader;

    Object.defineProperty(context, 'services', {
      get() {
        return serviceLoader.getServices(context)
      }
    })
  }

  initController() {
    this.controllerLoader = new ControllerLoader(this.rootControllerPath);
  }

  initService() {
    this.serviceLoader = new ServiceLoader(this.rootServicePath);
  }

  initMiddleware() {
    const { middlewares = [], routes = [], config } = this.options;

    // 初始化中间件
    this.use(middleware.init())
    this.use(middleware.views(this.rootViewPath, { map: { html: 'ejs' } }))

    if (config && config.proxy) {
      // proxy中间件要放在bodyParser之前!
      this.use(middleware.proxy(config.proxy))
    }

    this.use(middleware.bodyParser());
    this.use(middleware.route(routes, this.controllerLoader))

    // 初始化业务中间件
    middlewares.forEach(m => {
      if (typeof m === 'function') {
        this.use(m);
      } else {
        throw new Error('中间件必须是函数');
      }
    })
  }

}

module.exports = App;