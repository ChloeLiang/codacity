import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from '@material-ui/core/styles';
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
import NotFound from './components/notFound';
import auth from './services/userService';

import 'react-toastify/dist/ReactToastify.css';

const theme = createMuiTheme({
  palette: {
    // primary: { main: '#3F5EFB' },
    // secondary: { main: '#FC466B' },
    primary: { main: '#7F00FF' },
    secondary: { main: '#E100FF' },
  },
  typography: {
    fontFamily: "'Fira Mono', 'monospace'",
  },
});

const styles = theme => ({
  root: {
    height: '100vh',
    flexWrap: 'nowrap',
    background: 'linear-gradient(to bottom, #F2F2F2, #fdeff9)',
  },
  container: {
    flexGrow: 1,
    overflow: 'auto',
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
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
        <MuiThemeProvider theme={theme}>
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
                <Route path="/not-found" component={NotFound} />
                <Redirect from="/" exact to="/decks" />
                <Redirect to="/not-found" />
              </Switch>
            </div>
          </Grid>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
