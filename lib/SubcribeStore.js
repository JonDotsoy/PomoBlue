const DISPATCH = Symbol('dispatch')
const SUBSCRIPTIONS = Symbol('subscriptions')

class SubcribeStore {
  constructor () {
    this[SUBSCRIPTIONS] = []
  }

  getStatus () { return {} }

  /**
   * Dispatch all subriptions function
   */
  [DISPATCH] () { this[SUBSCRIPTIONS].forEach(fn => fn()) }

  /**
   * Subribe a function
   * @param {Function}  fn - Subribe a function
   * @return {Function}    - Unsubcribe function
   */
  subscribe (fn) {
    this[SUBSCRIPTIONS].push(fn)

    return () => { this[SUBSCRIPTIONS] = this[SUBSCRIPTIONS].filter(cfn => cfn !== fn) }
  }
}

exports = module.exports
exports.SubcribeStore = SubcribeStore
exports.DISPATCH = DISPATCH
exports.SUBSCRIPTIONS = SUBSCRIPTIONS

