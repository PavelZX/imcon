import React                   from 'react'
import { connect }             from 'react-redux'
import { Link }                from 'react-router-dom'
import { Form, Button, Image } from 'semantic-ui-react'

import { setDocumentTitle }    from '../../utils'
import Actions                 from '../../redux/actions/session'

class Session extends React.Component {
  componentDidMount() {
    setDocumentTitle('Форма входа')
  }
  
  _handleSubmit = (e) => {
    e.preventDefault()
    let {email, password} = this.refs
    const {dispatch} = this.props
    dispatch(Actions.signIn(email.value, password.value))
  }

  _renderError = () => {
    let { error } = this.props

    if (!error) return false

    return (
      <div className="error">
        {error}
      </div>
    );
  }

  render() {
    return (
      <main>

        <Link to='/ic'>
        <Image src='/images/logo.png' size='small' centered/>
          </Link>

        <Form id="sign_in_form" onSubmit={this._handleSubmit}>
        {this._renderError()}
          <Form.Group widths={2}>
            <input
                ref="email"
                type="email"
                id="user_email"
                placeholder="Email"
                required={true}
                defaultValue="john@caix.ru" />

            <input
                ref="password"
                type="password"
                id="user_password"
                placeholder="Password"
                required={true}
                defaultValue="12345678"/>

          </Form.Group>
          <Button type="submit">Войти</Button>
        </Form>
        <Link to="/sign_up">Создать аккаунт</Link>
      </main>

    );
  }
}

function mapStateToProps(state) {
  return {
    state: state.session
  }
}

export default connect(mapStateToProps)(Session)
