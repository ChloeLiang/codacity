import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import { getDecks, saveDeck } from '../services/deckService';
import { getCurrentUser } from '../services/userService';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
  grow: {
    flexGrow: 1,
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
});

class Decks extends Component {
  state = {
    data: { name: '', _creator: getCurrentUser()._id },
    decks: [],
  };

  async componentDidMount() {
    const { data: decks } = await getDecks();
    this.setState({ decks });
  }

  handleChange = ({ target: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  };

  handleSaveDeck = async () => {
    const data = { ...this.state.data };
    data.name = '';
    this.setState({ data });

    const { data: deck } = await saveDeck(this.state.data);

    const decks = [...this.state.decks];
    decks.push(deck);

    this.setState({ decks });
  };

  render() {
    const { classes } = this.props;
    const { data, decks } = this.state;

    return (
      <React.Fragment>
        <Grid container justify="center">
          <TextField
            name="name"
            placeholder="Add a new deck"
            className={classes.grow}
            value={data.name}
            onChange={this.handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleSaveDeck}
          >
            Add Deck
          </Button>
        </Grid>
        <List>
          {decks.map(deck => (
            <NavLink
              key={deck._id}
              className={classes.link}
              to={`/decks/${deck._id}/cards`}
            >
              <ListItem button>
                <ListItemText primary={deck.name} />
              </ListItem>
            </NavLink>
          ))}
        </List>
      </React.Fragment>
    );
  }
}

Decks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Decks);
