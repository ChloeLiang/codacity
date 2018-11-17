import React, { Component } from 'react';

import { Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import NavBar from './components/navBar';
import LoginForm from './components/loginForm';

import './App.css';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <NavBar />
        <Switch>
          <Route path="/login" component={LoginForm} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
