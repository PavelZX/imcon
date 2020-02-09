import { createStore, applyMiddleware, compose } from 'redux'
import thunk                                     from 'redux-thunk'
import logger                                    from 'redux-logger'
import { routerMiddleware }                      from 'react-router-redux'

import history                                   from '../utils/history'
import rootReducer                               from './reducers'
import realtime                                  from '../middleware/realtime'
import api                                       from '../middleware/api'
import auth                                      from '../middleware/auth'
import permission                                from '../middleware/permission'

// Build the middleware for intercepting and dispatching navigation actions

export default function configureStore () {
  const middleware = [routerMiddleware(history), thunk, logger,
    auth,
    api,
    permission,
    realtime
  ]
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const composedEnhancers = composeEnhancers(applyMiddleware(...middleware))
  return createStore(rootReducer, composedEnhancers)
}
