import React, { Component } from 'react';
import MainNav from './MainNav';
import base from '../base';

class App extends Component {

  constructor() {
    super();

    this.userLoggedIn = this.userLoggedIn.bind(this);
    this.userLoggedOut = this.userLoggedOut.bind(this);

    // getInitialState
    this.state = {
      user: null
    };
  }

  componentWillMount() {
    base.onAuth((user) => {
      if (user) {
        this.userLoggedIn({user});
      }
    })
  }

  componentWillUnmount() {
    // To do, remove binding
  }

  userLoggedIn(authData) {
    var user = {
      'uid': authData.user.uid,
      'displayName': authData.user.displayName,
      'email': authData.user.email,
      'photoURL': authData.user.photoURL
    }

    this.setState({
      user: user
    });
  }

  userLoggedOut() {
    base.unauth();
    this.setState({ user: null });
  }

  render() {
    return (
      <div className="app">
        <MainNav 
          userLoggedIn={this.userLoggedIn}
          userLoggedOut={this.userLoggedOut}
          user={this.state.user}
          />
        <p className="app-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
