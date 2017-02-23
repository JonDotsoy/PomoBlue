/**
 * @param {Number} simplePomodoro -
 * @param {Number} shortBreak     -
 * @param {Number} longBreak      -
 */
function stimateLongSession (simplePomodoro, shortBreak, longBreak) {
  return 0
    + (4 * (simplePomodoro | 0))
    + (3 * (shortBreak | 0))
    + (1 * (longBreak | 0))
}




exports = module.exports = {
  stimateLongSession
}

