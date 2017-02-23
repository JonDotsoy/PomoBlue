/* global describe, it, Date */
const {it, describe} = require('mocha')
const expect = require('expect.js')

describe('PomodoroTime', function () {
  it('Initial', () => {
    const {PomodoroTimeReducer} = require('../lib/PomodoroTimeReducer')

    const nextState = PomodoroTimeReducer(void (0), {})

    expect(nextState.sessions).to.be.a('array')
    expect(nextState).to.have.property('initialAt')
  })

  it('add session', () => {
    const {PomodoroTimeReducer} = require('../lib/PomodoroTimeReducer')

    const initialState = {
      initialAt: new Date(2016, 0, 1, 15, 0, 0), // 1/1/2016 15:00:00
      status: 'RUNNING',
      defaultPatron: {
        shortBreak: 5 * 60 * 1000,
        longBreak: 15 * 60 * 1000,
        simplePomodoro: 25 * 60 * 1000
      },
      sessions: [
      ]
    }

    const nextState = PomodoroTimeReducer(initialState, {
      type: 'ADD_SESSION',
      initialAt: new Date(2016, 0, 1, 15, 0, 0) // 1/1/2016 15:00:00
    })

    expect(nextState).not.to.be(initialState)
    expect(nextState).to.have.property('initialAt')
    expect(nextState.sessions).to.be.a('array').length(1)
    expect(nextState.sessions[0].initialAt.toJSON()).to.be(/* 1/1/2016 15:00:00 */(new Date(2016, 0, 1, 15, 0, 0)).toJSON())
    expect(nextState.sessions[0].finalAt.toJSON()).to.be(/* 1/1/2016 17:10:00 */(new Date(2016, 0, 1, 17, 10, 0)).toJSON())
  })

  it('Pause in session', async () => {
    const {PomodoroTimeReducer} = require('../lib/PomodoroTimeReducer')

    const initialState = {
      initialAt: new Date(2016, 0, 1, 15, 0, 0), // 1/1/2016 15:00:00
      status: 'RUNNING',
      currentSession: 0,
      defaultPatron: {
        shortBreak: 5 * 60 * 1000,
        longBreak: 15 * 60 * 1000,
        simplePomodoro: 25 * 60 * 1000
      },
      sessions: [
        {
          initialAt: new Date(2016, 0, 1, 15, 0, 0),
          finalAt: new Date('1/1/2016 17:10:00'),
          history: []
        }
      ]
    }

    const pausedState = PomodoroTimeReducer(initialState, {
      type: 'PAUSE_SESSION',
      pauseAt: new Date(2016, 0, 1, 15, 40, 0) // 1/1/2016 15:40:00
    })


    expect(pausedState).not.to.be(initialState)
    expect(pausedState.status).to.be('PAUSED')
    expect(pausedState.sessions[0].finalAt).to.be(null)
    expect(pausedState.sessions[0].history[0].type).to.be('PAUSE')
    expect(pausedState.sessions[0].history[0].pauseAt.toJSON()).to.be( (new Date(2016, 0, 1, 15, 40)).toJSON() )


    const continuedState = PomodoroTimeReducer(pausedState, {
      type: 'CONTINUE_SESSION',
      continueAt: new Date(2016, 0, 1, 15, 50, 0) // 1/1/2016 15:50:00
    })


    console.log( JSON.stringify(continuedState, null, 2) )

    expect(continuedState).not.to.be(pausedState)
    expect(continuedState.status).to.be('RUNNING')
    expect( continuedState.sessions[0].finalAt.toJSON() ).to.be(
      (new Date(2016, 0, 1, 17, 20))
    ) // 1/1/2016 17:20:00

  })
})

