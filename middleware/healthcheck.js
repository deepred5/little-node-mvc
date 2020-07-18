var reg = /\/do_not_delete\/health_check(\/)?$/
module.exports = () => {
  return async (context, next) => {
    if (reg.test(context.path)) {
      context.status = 200
      context.set('Content-Type', 'text/html')
      context.body = 'health_check'
    } else {
      await next()
    }
  }
}
