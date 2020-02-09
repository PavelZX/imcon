import React                         from 'react'
import {Route, Redirect }            from 'react-router-dom'
import {connect}                     from 'react-redux'

const PrivateRoute = ({ component: Comp, currentUser, ...rest }) => ( 
        
        <Route {...rest} render={props => (
          
            currentUser
          ? (<Comp {...props} />)
          : (<Redirect to={{pathname: "/sign_in", state: {from: props.location}
        }}/>
      )
    )}/>
  )
  
   const mapStateToProps = (state) => {
    return {
        currentUser: state.session.currentUser,
    }
  }

  export default connect(mapStateToProps)(PrivateRoute)