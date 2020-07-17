const fsOptions = { encoding: 'utf-8' }
const fs = require('fs')

const readFile = (file, staticServer) => {
  let result = fs.readFileSync(file, fsOptions)
  const mapping = {}
  if (result) {
    result = JSON.parse(result)
    Object.keys(result).forEach((key) => {
      const item = result[key]
      let value;
      value = staticServer.replace(/\/$/, '') + (item.indexOf('/') === 0 ? item : '/' + item)
      mapping[key] = value;
    })
  }
  return mapping
}

const bundleChunkMap = ({ staticServer, staticResourceMappingPath }) => {
  let mapping = {}
  const getMapping = () => {
    return mapping
  }
  if (fs.existsSync(staticResourceMappingPath)) {
    mapping = readFile(staticResourceMappingPath, staticServer)
    fs.watchFile(staticResourceMappingPath, () => {
      // if the json file is not correct, use the previous version.
      try {
        mapping = readFile(staticResourceMappingPath, staticServer)
      } catch (ex) {

      }
    })
  }
  return (ctx, next) => {
    let mapping = getMapping()
    // 放在ctx.state上,ctx.render会自动注入
    ctx.state.bundle= mapping
    return next();
  }
}

module.exports = bundleChunkMap;