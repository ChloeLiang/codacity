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

const styles = theme => ({
  link: {
    color: 'black',
    textDecoration: 'none',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '700px',
  },
  edit: {
    color: '#3F5EFB',
  },
  delete: {
    color: '#FC466B',
  },
  itemHover: {
    transition: 'all .3s',
    '&:hover': {
      backgroundColor: '#D8DEEE',
    },
  },
});

class SingleItem extends Component {
  state = {};
  render() {
    const { classes, url, id, text, onEdit, onDelete, count } = this.props;

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
            <IconButton aria-label="Delete" className={classes.delete}>
              <DeleteIcon onClick={e => onDelete(e, id)} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </NavLink>
    );
  }
}

export default withStyles(styles)(SingleItem);
