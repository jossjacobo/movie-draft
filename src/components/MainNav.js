import React from 'react';
import logo from '../css/images/logo.svg';
import userLogo from '../css/images/joss-icon.png';
import base from '../base';
import PropTypes from 'prop-types';

class MainNav extends React.Component {

  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  handleLogin(e) {
    const provider = e.target.dataset.social;
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  onMouseEnter(e) {
    e.target.classList.remove("hidden-overflow");
  }

  onMouseLeave(e) {
    e.target.classList.add("hidden-overflow");
  }

  authHandler(error, authData) {
    if (error) {
      console.log(error);
      return;
    }
    this.props.userLoggedIn(authData);
  }

  renderDropdown() {
    if (this.props.user) {
      return (
        <ul className="nav-login">
          <li className="login-button" onClick={this.props.userLoggedOut}>Log Out</li>
        </ul>
      )
    } else {
      return (
        <ul className="nav-login">
          <li className="login-button" data-social="google" onClick={this.handleLogin}>Google</li>
          <li className="login-button" data-social="github" onClick={this.handleLogin}>GitHub</li>
          <li className="login-button" data-social="facebook" onClick={this.handleLogin}>Facebook</li>
          <li className="login-button" data-social="twitter" onClick={this.handleLogin}>Twitter</li>
        </ul>
      )
    }
  }

  render() {
    return (
      <div className='main-nav-wrapper'>
        <nav className="main-nav">
          <img src={logo} className="app-logo" alt="logo" />

          <h1 className="app-title">
            Welcome {this.props.user ? `${this.props.user.displayName}!` : 'to Movie Draft'}
          </h1>

          <div className="hidden-overflow"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}>

            <img
              src={this.props.user ? this.props.user.photoURL : userLogo}
              alt="User Logo"
              className="round-image"
            />

            <div className="dropdown">
              {this.renderDropdown()}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

MainNav.propTypes = {
  userLoggedIn: PropTypes.func.isRequired,
  userLoggedOut: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default MainNav;