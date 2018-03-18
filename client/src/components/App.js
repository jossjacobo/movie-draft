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
      user: null,
      notes: null
    };
  }

  componentWillMount() {
    base.onAuth((user) => {
      if (user) {
        this.userLoggedIn({ user });
      }
    })
  }

  componentWillUnmount() {
    // To do, remove binding
  }

  componentDidMount() {
    // Sample fetch for the proxied api at http://localhost:3001
    fetch('/api/notes')
      .then((res, err) => {
        if (err) {
          console.log(err);
          return;
        }
        return res.status === 200 && res.json();
      })
      .then(notes => {
        this.setState({ ...this.state, notes });
      });
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
        <h3>Notes</h3>
        <div className="app-intro">
          <ul>
            {this.state.notes && this.state.notes.map(note => {
              return (
                <li key={note._id}>
                  {note.title}
                  {note.text}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
