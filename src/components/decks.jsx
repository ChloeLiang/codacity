import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Form from './form';
import UpdateDeckForm from './updateDeckForm';
import SingleItem from './singleItem';
import Spinner from './spinner';
import { getDecks, saveDeck, deleteDeck } from '../services/deckService';
import { getCards } from '../services/cardService';
import { getCurrentUser } from '../services/userService';

const styles = theme => ({
  button: {
    alignSelf: 'flex-end',
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
  addButton: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'inline-block',
    },
  },
  list: {
    padding: '2em 0',
  },
});

class Decks extends Form {
  state = {
    data: { name: '', _creator: getCurrentUser()._id },
    decks: [],
    cards: [],
    errors: {},
    isEditing: null,
    isLoading: true,
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
    const { data: cards } = await getCards();
    this.setState({ decks, cards, isLoading: false });
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
      await deleteDeck(deckId);
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

  renderItem = (d, index) => {
    const { isEditing } = this.state;
    const { deck, count } = d;

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
        id={deck._id}
        text={deck.name}
        count={count}
        onEdit={this.handleEdit}
        onDelete={index === 0 ? null : this.handleDelete}
      />
    );
  };

  getDecksAndCounts = () => {
    return this.state.decks.map(d => {
      return {
        deck: d,
        count: this.state.cards.filter(
          c => c._deck === d._id && moment().isSameOrAfter(c.next)
        ).length,
      };
    });
  };

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;
    const decks = this.getDecksAndCounts();

    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <Grid container justify="center">
            {this.renderInput('name', 'Add a new deck', 'text', {
              className: classes.grow,
            })}
            {this.renderButton('Add', {
              variant: 'contained',
              color: 'primary',
              className: classes.button,
              type: 'submit',
            })}
          </Grid>
        </form>
        <List className={classes.list}>
          <Spinner open={isLoading} />
          {decks.map((d, index) => this.renderItem(d, index))}
        </List>
        <NavLink to="/cards/new">
          <Button
            variant="fab"
            color="primary"
            aria-label="Add"
            className={classes.addButton}
          >
            <AddIcon />
          </Button>
        </NavLink>
      </React.Fragment>
    );
  }
}

Decks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Decks);
