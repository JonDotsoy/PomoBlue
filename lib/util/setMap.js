// setMap
function setMap (obj, ..._mapping) {
  let mapping = _mapping.length > 1 ? _mapping : _mapping[0]

  return [obj, ...mapping].reduce((currentObj, [path, value]) => {
    if (typeof value === 'function') {
      return set(currentObj, path, value(get(currentObj, path)))
    } else {
      return set(currentObj, path, value)
    }
  })
}



exports = module.exports = {
  setMap
}


