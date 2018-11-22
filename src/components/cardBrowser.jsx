import React, { Component } from 'react';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SingleItem from './singleItem';
import { getCardsInDeck, deleteCard } from '../services/cardService';
import { getDecks } from '../services/deckService';

const styles = theme => ({
  grow: {
    flexGrow: 1,
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      flex: '1 0 auto',
      margin: '1em 0',
      width: '100%',
    },
  },
});

class CardBrowser extends Component {
  state = {
    cards: [],
    decks: [],
    selectedDeck: '',
    searchQuery: '',
  };

  schema = {
    _deck: Joi.string()
      .required()
      .label('Deck'),
    search: Joi.string(),
  };

  async componentDidMount() {
    const { data: decks } = await getDecks();
    let cards = [];
    let selectedDeck;

    if (decks[0]) {
      selectedDeck = decks[0]._id;
      const { data } = await getCardsInDeck(decks[0]._id);
      cards = data;
    }

    this.setState({ decks, cards, selectedDeck });
  }

  handleChange = async e => {
    const selectedDeck = e.target.value;
    let { data: cards } = await getCardsInDeck(selectedDeck);
    cards = cards || [];
    this.setState({ selectedDeck, cards });
  };

  handleEdit = (e, cardId) => {
    e.preventDefault();
    this.props.history.push(`/cards/${cardId}`);
  };

  handleDelete = async (e, cardId) => {
    e.preventDefault();
    const originalCards = this.state.cards;
    const cards = originalCards.filter(c => c._id !== cardId);
    this.setState({ cards });

    try {
      const { data: card } = await deleteCard(cardId);
      console.log(card);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error('This movie has already been deleted.');
      }

      this.setState({ cards: originalCards });
    }
  };

  handleSearch = e => {
    const searchQuery = e.target.value;
    this.setState({ searchQuery });
  };

  getFilteredCards = () => {
    const { selectedDeck, searchQuery, cards: allCards } = this.state;
    let filtered = allCards;
    if (searchQuery) {
      filtered = allCards.filter(
        c =>
          c.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.back.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (selectedDeck && selectedDeck._id) {
      filtered = allCards.filter(c => c._deck === selectedDeck._id);
    }

    return filtered;
  };

  render() {
    const { decks, selectedDeck, searchQuery } = this.state;
    const { classes } = this.props;
    const cards = this.getFilteredCards();

    return (
      <React.Fragment>
        {decks.length > 0 && (
          <Grid container>
            <FormControl variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
                htmlFor="_deck"
              >
                Deck
              </InputLabel>
              <Select
                value={selectedDeck}
                onChange={this.handleChange}
                input={
                  <OutlinedInput labelWidth={35} name="_deck" id="_deck" />
                }
              >
                {decks.map(deck => (
                  <MenuItem key={deck._id} value={deck._id}>
                    {deck.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              onChange={this.handleSearch}
              value={searchQuery}
              variant="outlined"
              type="text"
              label="Search"
              name="search"
              className={classes.grow}
            />
          </Grid>
        )}
        <List className={classes.list}>
          {cards.map(card => (
            <SingleItem
              key={card._id}
              url={`/cards/${card._id}`}
              id={card._id}
              text={card.front}
              count={0}
              onEdit={this.handleEdit}
              onDelete={this.handleDelete}
            />
          ))}
        </List>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(CardBrowser);
