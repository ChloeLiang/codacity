import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import { getDecks, saveDeck } from '../services/deckService';
import ListItemLink from './listItemLink';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
  grow: {
    flexGrow: 1,
  },
});

class Decks extends Component {
  state = {
    data: { name: '', _creator: this.props.user },
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
            <ListItemLink key={deck._id} href={`/decks/${deck._id}`}>
              <ListItemText primary={deck.name} />
            </ListItemLink>
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
