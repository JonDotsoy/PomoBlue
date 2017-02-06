const timeOutAsync = (cb, timeout = 0, ...args) => new Promise((resolve, reject) => {
  setTimeout(() => {
    try {
      resolve(cb(...args))
    } catch (ex) {
      reject(ex)
    }
  }, timeout)
})

exports = module.exports
exports.timeOutAsync = timeOutAsync

