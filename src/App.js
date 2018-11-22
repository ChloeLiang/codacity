import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import NavBar from './components/navBar';
import LoginForm from './components/loginForm';
import RegisterFrom from './components/registerForm';
import Logout from './components/logout';
import Decks from './components/decks';
import CardForm from './components/cardForm';
import Card from './components/card';
import CardBrowser from './components/cardBrowser';
import ProtectedRoute from './components/protectedRoute';
import auth from './services/userService';

import 'react-toastify/dist/ReactToastify.css';

const styles = theme => ({
  root: {
    height: '100vh',
    flexWrap: 'nowrap',
  },
  container: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      width: '80%',
      margin: '0 auto',
    },
    [theme.breakpoints.up('lg')]: {
      width: '70%',
      margin: '0 auto',
    },
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
        <ToastContainer />
        <CssBaseline />
        <Grid
          container
          direction="column"
          alignItems="stretch"
          className={classes.root}
        >
          <NavBar user={user} />
          <div className={classes.container}>
            <Switch>
              <Route path="/login" component={LoginForm} />
              <Route path="/register" component={RegisterFrom} />
              <Route path="/logout" component={Logout} />
              <ProtectedRoute path="/cards/:id" component={CardForm} />
              <ProtectedRoute path="/cards" component={CardBrowser} />
              <ProtectedRoute path="/decks/:id/cards" component={Card} />
              <ProtectedRoute path="/decks" component={Decks} />} />
              <Redirect from="/" exact to="/decks" />
            </Switch>
          </div>
        </Grid>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
