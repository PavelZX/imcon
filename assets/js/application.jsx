import "core-js/stable"
import "regenerator-runtime/runtime"
import 'semantic-ui-css/semantic.min.css'

import React               from 'react'
import ReactDOM            from 'react-dom'

import { Provider }        from 'react-redux'
import { Router }          from 'react-router'

import configureStore      from './redux/configureStore'
import history             from './utils/history'
import Routes              from './routes'

const store = configureStore()

ReactDOM.render(
<Provider store={store}>
  <Router history={history}>
    <Routes/>
  </Router>
</Provider>,
  document.getElementById('main_container')
)
