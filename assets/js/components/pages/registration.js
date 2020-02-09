import React  from 'react'
import { connect }          from 'react-redux'
import { Link }             from 'react-router-dom'
import { Form, Button, Image } from 'semantic-ui-react'

import { setDocumentTitle, renderErrorFor } from '../../utils'
import Actions              from '../../redux/actions/registration'

class Registration extends React.Component {
  componentDidMount() {
    setDocumentTitle('Форма регистрации')
  }

  _handleSubmit = (e) => {
    e.preventDefault()

    const { dispatch } = this.props

    const data = {
      first_name: this.refs.firstName.value,
      last_name: this.refs.lastName.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      password_confirmation: this.refs.passwordConfirmation.value,
    }

    dispatch(Actions.signUp(data))
  }

  render() {
    const { error } = this.props

    return (
      <main>
        <Link to='/ic'>
          <Image src='/images/logo.png' size='small' centered/>
        </Link>
          
        <Form success onSubmit={this._handleSubmit}>
          <Form.Group widths={6}>
            <div><input ref="firstName" id="user_first_name" type="text" placeholder="Имя" required={true} />
            {renderErrorFor(error, 'first_name')}</div>
            <div><input ref="lastName" id="user_last_name" type="text" placeholder="Фамилия" required={true} />
            {renderErrorFor(error, 'last_name')}</div>
            <div><input ref="email" id="user_email" type="email" placeholder="Электронная почта" required={true} />
            {renderErrorFor(error, 'email')}</div>
            <div><input ref="password" id="user_password" type="password" placeholder="Пароль" required={true} />
            {renderErrorFor(error, 'password')}</div>
            <div><input ref="passwordConfirmation" id="user_password_confirmation" type="password" placeholder="Повторить пароль" required={true} />
            {renderErrorFor(error, 'password_confirmation')}</div>
            
          </Form.Group>
          <Button type="submit">Регистрация</Button>
        </Form>

        <Link to="/sign_in">Войти</Link>
      </main>
    )
  }
}

const mapStateToProps = (state) => ({
  error: state.registration.error,
})

export default connect(mapStateToProps)(Registration)
