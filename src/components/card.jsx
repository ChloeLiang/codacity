import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { getCardsInDeck } from '../services/cardService';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  grow: {
    flexGrow: 1,
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
  },
  back: {
    borderTop: '1px solid rgba(124, 124, 124, .5)',
    paddingTop: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  buttons: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Card extends Component {
  state = {
    index: 0,
    cards: [],
    isAnswered: false,
  };

  async componentDidMount() {
    const deckId = this.props.match.params.id;
    const { data: cards } = await getCardsInDeck(deckId);
    console.log(cards);
    this.setState({ cards });
  }

  handleAnswer = () => {
    this.setState({ isAnswered: true });
  };

  handleSpacedRepetition = () => {
    console.log('update card repetition');
    const index = this.state.index + 1;
    this.setState({ index, isAnswered: false });
  };

  render() {
    const { classes } = this.props;
    const { index, cards, isAnswered } = this.state;
    const hasCard = cards.length !== 0;

    return (
      <React.Fragment>
        {hasCard && index <= cards.length - 1 && (
          <React.Fragment>
            <Grid container direction="column" className={classes.grow}>
              <ReactMarkdown source={cards[index].front} />
              {isAnswered && (
                <ReactMarkdown
                  className={classes.back}
                  source={cards[index].back}
                />
              )}
            </Grid>
            <Grid
              container
              justify="center"
              spacing={16}
              className={classes.buttons}
            >
              {!isAnswered && (
                <Button
                  onClick={this.handleAnswer}
                  variant="contained"
                  color="primary"
                >
                  Show Answer
                </Button>
              )}
              {isAnswered && (
                <React.Fragment>
                  <Button
                    onClick={this.handleSpacedRepetition}
                    variant="contained"
                    color="primary"
                  >
                    Blackout
                  </Button>
                  <Button
                    onClick={this.handleSpacedRepetition}
                    variant="contained"
                    color="primary"
                  >
                    Hard
                  </Button>
                  <Button
                    onClick={this.handleSpacedRepetition}
                    variant="contained"
                    color="primary"
                  >
                    Normal
                  </Button>
                  <Button
                    onClick={this.handleSpacedRepetition}
                    variant="contained"
                    color="primary"
                  >
                    Good
                  </Button>
                  <Button
                    onClick={this.handleSpacedRepetition}
                    variant="contained"
                    color="primary"
                  >
                    Easy
                  </Button>
                </React.Fragment>
              )}
            </Grid>
          </React.Fragment>
        )}
        {hasCard && index >= cards.length && (
          <Typography variant="h6">
            Congratulations! You have finished this deck for today.
          </Typography>
        )}
      </React.Fragment>
    );
  }
}

Card.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Card);
