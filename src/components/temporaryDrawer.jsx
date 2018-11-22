import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToAppOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import PersonAddIcon from '@material-ui/icons/PersonAddOutlined';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import SearchIcon from '@material-ui/icons/SearchOutlined';

const styles = {
  list: {
    width: 250,
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#7F00FF',
  },
  link: {
    textDecoration: 'none',
  },
};

class TemporaryDrawer extends React.Component {
  renderNavItem = (text, url, icon) => {
    return (
      <NavLink className={this.props.classes.link} to={url}>
        <ListItem button key={text}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </NavLink>
    );
  };

  render() {
    const { classes, open, onToggle, user } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem>
            <Grid container direction="column">
              <Avatar className={classes.avatar}>
                {user && user.email[0]}
              </Avatar>
              {user && user.email}
            </Grid>
          </ListItem>

          {!user && (
            <React.Fragment>
              {this.renderNavItem('Login', '/login', <PersonIcon />)}
              {this.renderNavItem('Register', '/register', <PersonAddIcon />)}
            </React.Fragment>
          )}

          {user && (
            <React.Fragment>
              {this.renderNavItem('Logout', '/logout', <ExitToAppIcon />)}
              <Divider />
              {this.renderNavItem('Decks', '/decks', <FolderIcon />)}
              {this.renderNavItem('Cards', '/cards', <SearchIcon />)}
            </React.Fragment>
          )}
        </List>
      </div>
    );

    return (
      <div>
        <Drawer open={open} onClose={onToggle(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={onToggle(false)}
            onKeyDown={onToggle(false)}
          >
            {sideList}
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TemporaryDrawer);
