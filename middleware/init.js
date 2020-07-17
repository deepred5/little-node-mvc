const uuid = require('uuid');

module.exports = () => {
  return async (context, next) => {
    const id = uuid.v4().replace(/-/g, '')
    context.state.global = {
      __requestId: id
    }
    await next()
  }
}