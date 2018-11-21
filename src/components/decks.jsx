import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';

import Form from './form';
import UpdateDeckForm from './updateDeckForm';
import SingleItem from './singleItem';
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

  handleEdit = async (e, deckId) => {
    e.preventDefault();
    const isEditing = deckId;
    this.setState({ isEditing });
  };

  handleDelete = async (e, deckId) => {
    e.preventDefault();
    const originalDecks = this.state.decks;
    const decks = originalDecks.filter(d => d._id !== deckId);
    this.setState({ decks });

    try {
      const { data } = await deleteDeck(deckId);
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

  handleCancel = () => {
    this.setState({ isEditing: null });
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

    if (isEditing === deck._id) {
      return (
        <UpdateDeckForm
          key={deck._id}
          deck={deck}
          onUpdate={this.handleUpdate}
          onCancel={this.handleCancel}
        />
      );
    }

    return (
      <SingleItem
        key={deck._id}
        url={`/decks/${deck._id}/cards`}
        isInlineEdit={true}
        id={deck._id}
        text={deck.name}
        onEdit={this.handleEdit}
        onDelete={this.handleDelete}
      />
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
