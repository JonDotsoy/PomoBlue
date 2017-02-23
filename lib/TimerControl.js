/* global Date */
const {SubcribeStore, DISPATCH} = require('./SubcribeStore')
const {STOPPED, NOT_STARTED, PAUSED, RUNNING, COMPLETED} = require('./types')

const log = global.logTC = global.logTC ? global.logTC : require('debug')('TimerControl')
const logChr = global.logChr = global.logChr ? global.logChr : require('debug')('TimerControl:ChronometerTimerControl')
const logTout = global.logTout = global.logTout ? global.logTout : require('debug')('TimerControl:TimeoutTimerControl')

class ChronometerTimerControl extends SubcribeStore {
  constructor () {
    super()

    this.status = NOT_STARTED
    this.originalTimeStarted = null
    this.elapsedTMP = null
    this.timeStopped = null
    this.timeStarted = null
  }

  /**
   * @return   {Object}
   * @property {?Date}  timeStarted
   */
  getStatus () {
    return {
      status: this.status,
      timeStarted: this.timeStarted,
      elapsed: this.getElapsed(),
      timeStopped: this.timeStopped
    }
  }

  isPaused () { return this.status === PAUSED }
  isStopped () { return this.status === STOPPED }
  isRunning () { return this.status === RUNNING }
  isNotStarted () { return this.status === NOT_STARTED }

  getElapsed () {
    if (this.isNotStarted()) return null

    this.elapsedTMP = (this.timeStopped || Date.now()) - this.timeStarted

    return this.elapsedTMP
  }

  start () {
    this.originalTimeStarted = Date.now()
    this.timeStarted = Date.now()

    this.elapsedTMP = 0

    this.status = RUNNING
    this[DISPATCH]()
  }

  stop () {
    this.timeStopped = Date.now()
    this.timeStarted = this.originalTimeStarted
    this.elapsedTMP = null

    this.status = STOPPED
    this[DISPATCH]()
  }
}

class TimeoutTimerControl extends SubcribeStore {
  constructor () {
    super()

    logTout('Create a new TimeoutTimerControl Object')

    this.currentTimeout = null
    this.currentChronometer = null
    this.status = NOT_STARTED
  }

  getStatus () {
    return {
      status: this.status,
      elapsed: this.getElapsed()
    }
  }

  isNotStarted () { return this.status === NOT_STARTED }

  getElapsed () {
    if (this.isNotStarted()) return null

    return this.currentChronometer.getElapsed()
  }

  start (msToEnd, cb) {
    if (this.status !== NOT_STARTED) throw new Error('Has already been ripped off')
    this.currentChronometer = new ChronometerTimerControl()
    this.currentChronometer.start()

    this.currentTimeout = setTimeout(() => {
      this.stop()

      if (cb) cb()
    }, msToEnd)

    this.status = RUNNING
    this[DISPATCH]()
  }

  stop () {
    if (this.status === COMPLETED) throw new Error('Is current stopped')

    this.currentChronometer.stop()
    clearTimeout(this.currentTimeout)

    this.status = COMPLETED
    this[DISPATCH]()
  }
}

class TimerControl extends SubcribeStore {
  constructor () {
    super()

    this.status = NOT_STARTED
    this.elapsedAccumulated = 0
    this.currentChronometer = null
  }

  getStatus () {
    return {
      status: this.status,
      elapsed: this.getElapsed()
    }
  }

  isStopped () { return this.status === STOPPED }
  isRunning () { return this.status === RUNNING }
  isNotStarted () { return this.status === NOT_STARTED }
  isPaused () { return this.status === PAUSED }

  getElapsed () {
    if (this.isNotStarted()) return null
    if (this.isPaused() || this.isStopped()) return this.elapsedAccumulated

    return this.elapsedAccumulated + this.currentChronometer.getElapsed()
  }

  start () {
    if (!this.isNotStarted()) throw new Error('Already started')

    this.currentChronometer = new ChronometerTimerControl()
    this.currentChronometer.start()

    this.status = RUNNING
    this[DISPATCH]()
  }

  pause () {
    if (!this.isRunning()) throw new Error('It is required to be initiated')

    this.currentChronometer.stop()
    this.elapsedAccumulated += this.currentChronometer.getElapsed()

    this.status = PAUSED
    this[DISPATCH]()
  }

  continue () {
    if (!this.isPaused()) throw new Error('It is required to be paused')

    this.currentChronometer = new ChronometerTimerControl()
    this.currentChronometer.start()

    this.status = RUNNING
    this[DISPATCH]()
  }

  stop () {
    if (!this.isRunning()) throw new Error('It is required to be initiated')

    if (this.isRunning()) {
      this.currentChronometer.stop()
      this.elapsedAccumulated += this.currentChronometer.getElapsed()
    }

    this.currentChronometer = null

    this.status = STOPPED
    this[DISPATCH]()
  }
}

exports = module.exports
exports.TimerControl = TimerControl
exports.TimeoutTimerControl = TimeoutTimerControl
exports.ChronometerTimerControl = ChronometerTimerControl

