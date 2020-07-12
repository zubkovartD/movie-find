import React from 'react';
import {API_KEY_3, API_URL, fetchAPI} from './../../Api/api'
import "bootstrap/dist/css/bootstrap.min.css";

export default class LoginForm extends React.Component {
    state = {
        username: "",
        password: "",
        errors: {},
        submitting: false
    };

    onChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        this.setState(prevState => ({
            [name]: value,
            errors: {
                ...prevState.errors,
                base: null,
                [name]: null
            }
        }))
    }

    handleBlur = () => {
        const errors = this.validateFields() 
        if (Object.keys(errors).length > 0) {
            this.setState(prevState => ({
                errors: {
                    ...prevState.errors,
                    ...errors
                }
            }))
        }
    }

    onSubmit =() => {
            this.setState({
                submitting: true
            })
            fetchAPI(`${API_URL}/authentication/token/new?api_key=${API_KEY_3}`)
                .then(data => {
                    return fetchAPI(`${API_URL}/authentication/token/validate_with_login?api_key=${API_KEY_3}`, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: this.state.username, 
                            password: this.state.password, 
                            request_token: data.request_token
                        })
                    })
                })
                .then(data => {
                    return fetchAPI(`${API_URL}/authentication/session/new?api_key=${API_KEY_3}`,{
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            request_token: data.request_token
                        })
                    })
                })
                .then(data => {
                    this.props.updateSessionId(data.session_id)
                    return fetchAPI(`${API_URL}/account?api_key=${API_KEY_3}&session_id=${data.session_id}`)
                })
                .then(user => {
                    console.log('session', user)
                    this.setState({
                        submitting: false
                    }, () => {
                        this.props.updateUser(user)
                    })
                })
                .catch(error => {
                    this.setState({
                        submitting: false,
                        errors: {
                            base: error.status_message
                        }
                    })
                })
    }

    validateFields = () => {
        const errors = {}

        if (this.state.username === '') {
            errors.username = 'Not empty'
        }

        return errors
    }

    onLogin = e => {
        e.preventDefault()
        const errors = this.validateFields() 
        if (Object.keys(errors).length > 0) {
            this.setState(prevState => ({
                errors: {
                    ...prevState.errors,
                    ...errors
                }
            }))
        } else {
            this.onSubmit()
        }
    }

    render() {
        const { username, password, errors, submitting } = this.state;
        return (
            <div className="form-login-container">
                <form className="form-login">
                    <h1 className="h3 mb-3 font-weight-normal text-center">
                        Авторизация
                    </h1>
                    <div className="form-group">
                        <label htmlFor="username">Пользователь</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Пользователь"
                            name="username"
                            value={username}
                            onChange={this.onChange}
                            onBlur={this.handleBlur}
                        />
                        {errors.username && (
                            <div className="invalid-feedback d-block">{errors.username}</div>
                        )}      
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Пароль"
                            name="password"
                            value={password}
                            onChange={this.onChange}
                        />
                    {errors.password && (
                            <div className="invalid-feedback d-block">{errors.password}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary btn-block"
                        onClick={this.onLogin}
                        disabled={submitting}
                    >
                        Вход
                    </button>
                {errors.base && (
                        <div className="invalid-feedback d-block text-center">{errors.base}</div>
                    )} 
                    </form>
                </div>
        );
    }
}