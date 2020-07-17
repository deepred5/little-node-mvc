const glob = require('glob');

class Loader {
  loadFiles(target) {
    const files = glob.sync(`${target}/**/*.js`)
    return files
  }
}

module.exports = Loader