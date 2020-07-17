const path = require('path');
const Loader = require('./loader');

const serviceMap = new Map();
const serviceClass = new Map();
const services = {};

class ServiceLoader extends Loader {
  constructor(servicePath) {
    super();
    this.loadFiles(servicePath).forEach(filepath => {
      const basename = path.basename(filepath);
      const extname = path.extname(filepath);
      const fileName = basename.substring(0, basename.indexOf(extname));

      if (serviceMap.get(fileName)) {
        throw new Error(`servies文件夹下有${fileName}文件同名!`)
      } else {
        serviceMap.set(fileName, filepath);
      }

      const _this = this;

      Object.defineProperty(services, fileName, {
        get() {
          if (serviceMap.get(fileName)) {
            if (!serviceClass.get(fileName)) {
              // 只有用到某个service才require这个文件
              const S = require(serviceMap.get(fileName));
              serviceClass.set(fileName, S);
            }
            const S = serviceClass.get(fileName);
            // 每次new一个新的Service实例
            return new S(_this.context);
          }
        }
      })

    });
  }

  getServices(context) {
    // 更新context
    this.context = context;
    return services;
  }

}

module.exports = ServiceLoader