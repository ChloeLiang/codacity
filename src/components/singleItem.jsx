import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Badge from '@material-ui/core/Badge';
import SimpleMenu from './simpleMenu';

const styles = theme => ({
  link: {
    color: 'black',
    textDecoration: 'none',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  edit: {
    color: '#7F00FF',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  delete: {
    color: '#E100FF',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  itemHover: {
    transition: 'all .3s',
    '&:hover': {
      backgroundColor: '#D8DEEE',
    },
  },
  menu: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'inline-block',
      padding: 0,
    },
  },
});

class SingleItem extends Component {
  state = {};
  render() {
    const { classes, url, id, text, onEdit, onDelete, count } = this.props;
    const options = [
      {
        id,
        text: 'Edit',
        action: onEdit,
      },
      {
        id,
        text: 'Delete',
        action: onDelete,
      },
    ];

    return (
      <NavLink className={classes.link} to={url}>
        <ListItem
          button
          className={classes.itemHover}
          disableRipple
          disableTouchRipple
        >
          {count > 0 && (
            <Badge
              color="primary"
              badgeContent={count}
              className={classes.badge}
            >
              <ListItemText primary={text} className={classes.text} />
            </Badge>
          )}
          {count <= 0 && (
            <ListItemText primary={text} className={classes.text} />
          )}
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit" className={classes.edit}>
              <EditIcon onClick={e => onEdit(e, id)} />
            </IconButton>
            {onDelete && (
              <IconButton aria-label="Delete" className={classes.delete}>
                <DeleteIcon onClick={e => onDelete(e, id)} />
              </IconButton>
            )}
            <SimpleMenu style={classes.menu} options={options} />
          </ListItemSecondaryAction>
        </ListItem>
      </NavLink>
    );
  }
}

export default withStyles(styles)(SingleItem);
