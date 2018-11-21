import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import Form from './form';
import UpdateDeckForm from './updateDeckForm';
import { getDecks, saveDeck, deleteDeck } from '../services/deckService';
import { getCurrentUser } from '../services/userService';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
  grow: {
    width: 0,
    flexGrow: 1,
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
});

class Decks extends Form {
  state = {
    data: { name: '', _creator: getCurrentUser()._id },
    decks: [],
    errors: {},
    isEditing: null,
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().label('Name'),
    _creator: Joi.string()
      .required()
      .label('Creator'),
  };

  async componentDidMount() {
    const { data: decks } = await getDecks();
    this.setState({ decks });
  }

  mapToModel = deck => {
    return {
      _id: deck._id,
      name: deck.updated,
      _creator: deck._creator,
    };
  };

  handleEdit = async (e, deck) => {
    e.preventDefault();
    const isEditing = deck._id;
    this.setState({ isEditing });
  };

  handleDelete = async (e, deck) => {
    e.preventDefault();
    const originalDecks = this.state.decks;
    const decks = originalDecks.filter(d => d._id !== deck._id);
    this.setState({ decks });

    try {
      const { data } = await deleteDeck(deck._id);
      console.log(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error('This deck has already been deleted.');

        this.setState({ decks: originalDecks });
      }
    }
  };

  handleUpdate = async updatedDeck => {
    const isEditing = null;
    const decks = [...this.state.decks];
    const d = decks.filter(d => d._id === updatedDeck._id);
    d[0].name = updatedDeck.name;
    this.setState({ decks, isEditing });

    const { data: deck } = await saveDeck(updatedDeck);
    console.log('deck', deck);
  };

  doSubmit = async () => {
    const data = { ...this.state.data };
    data.name = '';
    this.setState({ data, isEditing: false });

    const { data: deck } = await saveDeck(this.state.data);

    const decks = [...this.state.decks];
    decks.push(deck);

    this.setState({ decks });
  };

  renderItem = deck => {
    const { isEditing } = this.state;
    const { classes } = this.props;

    if (isEditing === deck._id) {
      return (
        <UpdateDeckForm
          key={deck._id}
          deck={deck}
          onUpdate={this.handleUpdate}
        />
      );
    }

    return (
      <NavLink
        key={deck._id}
        className={classes.link}
        to={`/decks/${deck._id}/cards`}
      >
        <ListItem button>
          <ListItemText primary={deck.name} />
          <ListItemSecondaryAction>
            <IconButton aria-label="Edit">
              <EditIcon onClick={e => this.handleEdit(e, deck)} />
            </IconButton>
            <IconButton aria-label="Delete">
              <DeleteIcon onClick={e => this.handleDelete(e, deck)} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </NavLink>
    );
  };

  render() {
    const { classes } = this.props;
    const { decks } = this.state;

    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <Grid container justify="center">
            {this.renderInput('name', 'Add a new deck', 'text', {
              className: classes.grow,
            })}
            {this.renderButton('Add Deck', {
              variant: 'contained',
              color: 'primary',
              className: classes.button,
              type: 'submit',
            })}
          </Grid>
        </form>
        <List>{decks.map(deck => this.renderItem(deck))}</List>
      </React.Fragment>
    );
  }
}

Decks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Decks);
