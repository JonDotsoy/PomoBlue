const get = require('lodash/get')
const set = require('setimmutable')
const {ObjectPrototypeClone} = require('./util/Object.prototype.clone')
const {stimateLongSession} = require('./util/Pomodoro')
const {setMap} = require('./util/setMap')

const initialStateSimpleSession = {
  initialAt: null,
  finalAt: null,
  history: []
}

ObjectPrototypeClone(initialStateSimpleSession)

const initialStatePomodoroTimeReducer = {
  initialAt: null,
  status: null,
  defaultPatron: {
    shortBreak: 5 * 60 * 1000,
    longBreak: 15 * 60 * 1000,
    simplePomodoro: 25 * 60 * 1000
  },
  sessions: []
}

const PomodoroTimeReducer = function (state = initialStatePomodoroTimeReducer, action) {
  switch (action.type) {

    case 'CONTINUE_SESSION': {
      const {continueAt} = action
      const {currentSession} = state

      const newHistory = {
        type: 'CONTINUE',
        continueAt
      }

      return setMap(state, [
        [
          ['status'],
          'RUNNING'
        ],

        [
          // sessions.<sessionId>.history
          [ 'sessions', currentSession, 'history'],
          history => [...history, newHistory]
        ]
      ])
    }

    case 'PAUSE_SESSION': {
      const {pauseAt} = action
      const currentSession = get(state, ['currentSession'])

      const rtrn = Object.assign({}, state, {
        status: 'PAUSED',
        sessions: set(state.sessions, [currentSession], Object.assign({}, state.sessions[currentSession], {
          finalAt: null,
          history: [...state.sessions[currentSession].history, {
            type: 'PAUSE',
            pauseAt
          }]
        }))
      })

      return rtrn
    }

    case 'ADD_SESSION': {
      const simplePomodoroDuration = get(state, ['defaultPatron', 'simplePomodoro'], 25 * 60 * 1000)
      const shortBreakDuration = get(state, ['defaultPatron', 'shortBreak'], 5 * 60 * 1000)
      const longBreakDuration = get(state, ['defaultPatron', 'longBreak'], 15 * 60 * 1000)

      return set(state, ['sessions'], [...get(state, ['sessions']),
        initialStateSimpleSession.clone({
          initialAt: action.initialAt,
          finalAt:
            new Date(
              action.initialAt.getTime()
                + (4 * simplePomodoroDuration)
                + (3 * shortBreakDuration)
                + (1 * longBreakDuration)
            )
        })
      ])
    }

    default: { return state }
  }
}

exports = module.exports = {
  __esModule: true,
  default: PomodoroTimeReducer,
  PomodoroTimeReducer
}

