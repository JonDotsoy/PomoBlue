/**
 * Added a prototype clone()
 *
 * !WARNING: This is a clone not a instance.
 *
 * @param {Object} obj - Object to clone.
 * @example
 * const MyModelObj = {a:3}
 * ObjectPrototypeClone(MyModelObj)
 * 
 * const MyClone = MyModelObj.clone()
 *
 * MyClone === MyModelObj // => false
 * MyModelObj // => { a: 3 }
 * MyClone // => { a: 3 }
 *
 * expect(MyClone).to.eql(MyModelObj)
 */
function ObjectPrototypeClone (obj) {
  Object.defineProperty(obj, 'clone',{
    enumerable: false,
    value: (...args) => Object.assign({}, obj, ...args)
  })

  return obj
}

exports = module.exports = {
  __esModule: true,
  default: ObjectPrototypeClone,
  ObjectPrototypeClone
}
