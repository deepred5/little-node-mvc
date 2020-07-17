module.exports = (context) => {
  Object.defineProperty(context, 'setData', {
    get() {
      return function (data) {
        Object.assign(context.state.global, data)
      }
    }
  })
}
