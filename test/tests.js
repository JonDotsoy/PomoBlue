/* global describe, it, Date */
const expect = require('expect.js')
const {mockDateNow} = require('./utilsTests/mockDateNow')
const {timeOutAsync} = require('./utilsTests/timeOutAsync')

function ms100 (cb, ...args) {
  setTimeout(cb, 100, ...args)
}

false && describe('Class ChronometerTimerControl', function () {
  it('Case 1', () => {
    mockDateNow.initialize(/*10*/)
    const {ChronometerTimerControl} = require('../lib/TimerControl')
    const chronometerTimerControl = new ChronometerTimerControl()

    // > chronometerTimerControl.getStatus().elapsed
    // null
    expect(chronometerTimerControl.getStatus().elapsed).to.be(null)

    // > chronometerTimerControl.getStatus().status
    // 'not started'
    expect(chronometerTimerControl.getStatus().status).to.be('not started')

    // > sleep 10
    mockDateNow.addProgress(10)

    // > chronometerTimerControl.start()
    chronometerTimerControl.start()

    // > chronometerTimerControl.getStatus().status
    // 'running'
    expect(chronometerTimerControl.getStatus().status).to.be('running')

    // > sleep 100
    mockDateNow.addProgress(100)

    // > chronometerTimerControl.getStatus().elapsed
    // 100
    expect(chronometerTimerControl.getStatus().elapsed).to.be(100)

    // > chronometerTimerControl.stop()
    chronometerTimerControl.stop()

    // > chronometerTimerControl.getStatus().status
    // 'stopped'
    expect(chronometerTimerControl.getStatus().status).to.be('stopped')

    // > sleep 100
    mockDateNow.addProgress(100)

    // > chronometerTimerControl.getStatus().elapsed
    // 100
    expect(chronometerTimerControl.getStatus().elapsed).to.be(100)

    // > sleep 100
    mockDateNow.addProgress(100)

    // > chronometerTimerControl.getStatus().elapsed
    // 100
    expect(chronometerTimerControl.getStatus().elapsed).to.be(100)

    mockDateNow.restore()
  })
})

false && describe('Class TimeoutTimerControl', function () {
  let log = () => {}

  before(() => {
    require('debug').enable('TimerControl:TimeoutTimerControl')
    require('debug').enable('TimerControl:TimeoutTimerControl:test')
    log = require('debug')('TimerControl:TimeoutTimerControl:test')
  })

  it('Case 1', (done) => {
    const {TimeoutTimerControl} = require('../lib/TimerControl')
    const timeoutTimerControl = new TimeoutTimerControl()

    timeoutTimerControl.subscribe(() => {
      if (timeoutTimerControl.getStatus().status === 'completed') {
        // > timeoutTimerControl.getStatus().elapsed
        // 100
        expect(timeoutTimerControl.getStatus().elapsed > 90).to.be.ok()
        expect(timeoutTimerControl.getStatus().elapsed < 110).to.be.ok()
        done()
      }
    })

    // > timeoutTimerControl.getStatus().elapsed
    // null
    expect(timeoutTimerControl.getStatus().elapsed).to.be(null)

    // > timeoutTimerControl.getStatus().elapsed
    // null
    expect(timeoutTimerControl.getStatus().status).to.be('not started')

    timeoutTimerControl.start(100)
  }, 200)

  it('Case 2', (done) => {
    const {TimeoutTimerControl} = require('../lib/TimerControl')
    const timeoutTimerControl = new TimeoutTimerControl()

    let isLoadDefaultEnd = false

    setTimeout(() => {
      timeoutTimerControl.stop()
    }, 10)

    setTimeout(() => {
      expect(isLoadDefaultEnd).not.to.be.ok()

      // > timeoutTimerControl.getStatus().state
      // 'stopped'
      expect(timeoutTimerControl.getStatus().status).to.be('completed')

      done()
    }, 21)

    timeoutTimerControl.start(30, () => {
      isLoadDefaultEnd = true
    })
  })
})

false && describe('Class TimerControl', function () {
  let log = () => {}

  before(() => {
    require('debug').enable('TimerControl')
    require('debug').enable('TimerControl:test')
    log = require('debug')('TimerControl:test')
  })

  it('Case 1', (done) => {
    const {TimerControl} = require('../lib/TimerControl')
    const timerControl = new TimerControl()

    expect(() => { timerControl.pause() }).to.throwError()
    expect(() => { timerControl.continue() }).to.throwError()
    expect(() => { timerControl.stop() }).to.throwError()

    expect(timerControl.getStatus().status).to.be('not started')

    timerControl.start()

    expect(() => { timerControl.start() }).to.throwError()
    expect(() => { timerControl.continue() }).to.throwError()

    expect(timerControl.getStatus().status).to.be('running')

    timerControl.pause()

    expect(() => { timerControl.start() }).to.throwError()
    expect(() => { timerControl.pause() }).to.throwError()

    expect(timerControl.getStatus().status).to.be('paused')

    ms100(() => {
      timerControl.continue()
      expect(() => { timerControl.continue() }).to.throwError()

      expect(timerControl.getStatus().status).to.be('running')

      expect(timerControl.getStatus().elapsed / 100 | 0).to.be(0)

      ms100(() => {
        expect(timerControl.getStatus().elapsed / 100 | 0).to.be(1)

        ms100(() => {
          expect(timerControl.getStatus().elapsed / 100 | 0).to.be(2)

          timerControl.pause()

          ms100(() => {
            expect(timerControl.getStatus().elapsed / 100 | 0).to.be(2)
            timerControl.continue()

            ms100(() => {
              expect(timerControl.getStatus().elapsed / 100 | 0).to.be(3)
              timerControl.stop()

              expect(() => { timerControl.stop() }).to.throwError()
              expect(() => { timerControl.start() }).to.throwError()
              expect(() => { timerControl.continue() }).to.throwError()
              expect(() => { timerControl.pause() }).to.throwError()

              expect(timerControl.getStatus().status).to.be('stopped')

              done()
            })
          })
        })
      })
    })
  })
})

describe('Class PomodoroTime', function () {
  it('Case 1', () => {
    const {PomodoroTime} = require('..')
    const pomodoroTime = new PomodoroTime()

    
  })
})
