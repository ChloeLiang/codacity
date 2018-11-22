import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import TemporaryDrawer from './temporaryDrawer';
import UserSettings from './userSettings';

const styles = theme => ({
  root: {
    // background: 'linear-gradient(45deg, #FC466B 30%, #3F5EFB 90%)',
    background: 'linear-gradient(45deg, #7F00FF 30%, #E100FF 90%)',
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
  menuButton: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
    },
  },
  navItem: {
    display: 'inline-block',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
});

class NavBar extends Component {
  state = {
    open: false,
  };

  toggleDrawer = open => () => {
    this.setState({
      open,
    });
  };

  render() {
    const { classes, user } = this.props;

    return (
      <AppBar position="static" className={classes.root}>
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={this.toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <TemporaryDrawer
            open={this.state.open}
            onToggle={this.toggleDrawer}
            user={user}
          />
          <Typography variant="h6" color="inherit" className={classes.grow}>
            <Link className={classes.link} to="/">
              CodeNinja
            </Link>
          </Typography>

          {!user && (
            <React.Fragment>
              <NavLink
                className={`${classes.navItem} ${classes.link}`}
                to="/login"
              >
                <Button color="inherit">Login</Button>
              </NavLink>

              <NavLink
                className={`${classes.navItem} ${classes.link}`}
                to="/register"
              >
                <Button color="inherit">Register</Button>
              </NavLink>
            </React.Fragment>
          )}

          {user && (
            <React.Fragment>
              <NavLink
                className={`${classes.navItem} ${classes.link}`}
                to="/decks"
              >
                <Button color="inherit">Decks</Button>
              </NavLink>
              <NavLink
                className={`${classes.navItem} ${classes.link}`}
                to="/cards"
              >
                <Button color="inherit">Cards</Button>
              </NavLink>
              <NavLink
                className={`${classes.navItem} ${classes.link}`}
                to="/cards/new"
              >
                <Button color="inherit">Add Card</Button>
              </NavLink>
              <UserSettings display={classes.navItem} />
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
