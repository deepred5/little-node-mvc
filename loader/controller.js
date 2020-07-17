const path = require('path');
const Loader = require('./loader');

const controllerMap = new Map();
const controllerClass = new Map();

class ControllerLoader extends Loader {
  constructor(controllerPath) {
    super();
    this.loadFiles(controllerPath).forEach(filepath => {
      const basename = path.basename(filepath);
      const extname = path.extname(filepath);
      const fileName = basename.substring(0, basename.indexOf(extname));
      
      if (controllerMap.get(fileName)) {
        throw new Error(`controller文件夹下有${fileName}文件同名!`)
      } else {
        controllerMap.set(fileName, filepath);
      }
    })
  }

  getClass(name) {
    if (controllerMap.get(name)) {
      if (!controllerClass.get(name)) {
        const c = require(controllerMap.get(name));
        // 只有用到某个controller才require这个文件
        controllerClass.set(name, c);
      }
      return controllerClass.get(name);
    } else {
      throw new Error(`controller文件夹下没有${name}文件`)
    }
  }

}

module.exports = ControllerLoader