import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';

import NavBar from './components/navBar';
import LoginForm from './components/loginForm';
import RegisterFrom from './components/registerForm';
import Logout from './components/logout';
import auth from './services/userService';

import './App.css';

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar user={user} />
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterFrom} />
          <Route path="/logout" component={Logout} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
