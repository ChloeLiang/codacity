import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import NavBar from './components/navBar';
import LoginForm from './components/loginForm';
import RegisterFrom from './components/registerForm';
import Logout from './components/logout';
import Decks from './components/decks';
import CardForm from './components/cardForm';
import auth from './services/userService';

const styles = theme => ({
  root: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
  },
});

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { classes } = this.props;
    const { user } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />
        <ToastContainer />
        <NavBar user={user} />
        <main className={classes.root}>
          <Switch>
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterFrom} />
            <Route path="/logout" component={Logout} />
            <Route path="/cards/new" component={CardForm} />
            />
            <Route path="/decks" component={Decks} />} />
            <Redirect from="/" exact to="/decks" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
