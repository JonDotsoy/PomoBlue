// Mock DATE
const originalDateNow = Date.now

const mockDateNow = {
  defaultInitMockDateNow: 1486245000000,
  update: function (timeReturn = this.defaultInitMockDateNow) {
    // console.log('Update Date Now, now restore => ' + timeReturn)
    Date.now = () => timeReturn
  },
  initialize: function (initializeTime) { return this.update(initializeTime) },
  addProgress: function (ms) { this.update(Date.now() + ms) },
  restore: function () { Date.now = originalDateNow }
}

exports = module.exports
exports.mockDateNow = mockDateNow

