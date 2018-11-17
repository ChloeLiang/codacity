import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import UserSettings from './userSettings';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  menuLink: {
    color: 'rgb(30, 30, 30)',
    textDecoration: 'none',
  },
};

class NavBar extends Component {
  render() {
    const { classes, user } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              <Link className={classes.link} to="/">
                CodeNinja
              </Link>
            </Typography>

            {!user && (
              <React.Fragment>
                <Button color="inherit">
                  <NavLink className={classes.link} to="/login">
                    Login
                  </NavLink>
                </Button>

                <Button color="inherit">
                  <NavLink className={classes.link} to="/register">
                    Register
                  </NavLink>
                </Button>
              </React.Fragment>
            )}

            {user && <UserSettings />}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
