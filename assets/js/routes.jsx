import React, { Fragment } from 'react'
import { Redirect, Route } from 'react-router-dom'

import Forest              from './containers/forest'

import Registration        from './components/pages/registration'
import Session             from './components/pages/session'

import PrivateRoute        from './components/auth'

import TreeShowView        from './components/tree/show'
import LeafletShowView      from './components/leaflet/show'

export default function Routes(store) {

  return (
    <Fragment>
      <Route path="/sign_in" component={Session} />
      <Route path="/sign_up" component={Registration} />
      <Route exact path="/" render={() => <Redirect to="/sign_in"/>} />
        <PrivateRoute path="/ic" component={Forest}/>
        <PrivateRoute path="/ic/tree/:id" render={({match})=>
        <TreeShowView params={match.params}>
          <PrivateRoute path="leaflet/:id" component={LeafletShowView}/>
        </TreeShowView>} />
    </Fragment>
  )
}
