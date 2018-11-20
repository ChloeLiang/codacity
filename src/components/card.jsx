import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { getCardsInDeck, saveCard, deleteCard } from '../services/cardService';

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
    marginLeft: theme.spacing.unit,
  },
  button: {
    marginLeft: theme.spacing.unit,
  },
  link: {
    textDecoration: 'none',
  },
});

class Card extends Component {
  state = {
    index: 0,
    cards: [],
    isLoading: true,
    isAnswered: false,
  };

  async componentDidMount() {
    const deckId = this.props.match.params.id;
    let { data: cards } = await getCardsInDeck(deckId);
    cards = cards.filter(card => moment().isSameOrAfter(card.next));
    console.log(cards);
    this.setState({ cards, isLoading: false });
  }

  handleAnswer = () => {
    this.setState({ isAnswered: true });
  };

  getUpdatedCard = (card, quality) => {
    // The number of times a user sees a flashcard.
    let repetition = card.repetition;

    // The easiness factor or EFactor or EF. It is multiplier used to increase
    // the "space" in spaced repetition. The range is from 1.3 to 2.5.
    let easiness = card.easiness;

    // The length of time (in days) between repetitions.
    // It is the "space" of spaced repetition.
    let interval = card.interval;

    // Quality is how difficult a flashcard is. The scale is from 0 to 5.
    easiness = Math.max(
      1.3,
      easiness + 0.1 - (5.0 - quality) * (0.08 + (5.0 - quality) * 0.02)
    );

    if (quality < 3) {
      repetition = 0;
    } else {
      repetition += 1;
    }

    if (repetition <= 1) {
      interval = 1;
    } else if (repetition === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easiness);
    }

    console.log('interval:', interval);
    console.log('now', moment().format());
    const nextPracticeDate = moment()
      .add(interval, 'day')
      .format();
    console.log(nextPracticeDate);

    const udpatedCard = { ...card };
    udpatedCard.repetition = repetition;
    udpatedCard.easiness = easiness;
    udpatedCard.interval = interval;
    udpatedCard.next = nextPracticeDate;

    return udpatedCard;
  };

  mapToModel = card => {
    return {
      _id: card._id,
      front: card._front,
      back: card._back,
      easiness: card.easiness,
      interval: card.interval,
      repetition: card.repetition,
      next: card.next,
      _deck: card._deck,
      _creator: card._creator,
    };
  };

  handleSpacedRepetition = async quality => {
    let { index, cards } = this.state;
    const next = this.getUpdatedCard(cards[index], quality);
    index = index + 1;
    this.setState({ index, isAnswered: false });

    const { data } = await saveCard(this.mapToModel(next));
    console.log(data);
  };

  handleDelete = async () => {
    let { cards, index } = this.state;
    const cardId = cards[index]._id;
    index = index + 1;
    this.setState({ index, isAnswered: false });
    const { data } = await deleteCard(cardId);
    console.log('deleted', data);
  };

  render() {
    const { classes } = this.props;
    const { index, cards, isLoading, isAnswered } = this.state;

    return (
      <React.Fragment>
        {!isLoading && index <= cards.length - 1 && (
          <React.Fragment>
            <Grid container>
              <NavLink
                to={`/cards/${cards[index]._id}`}
                className={classes.link}
              >
                <Button variant="outlined" color="primary">
                  Edit
                </Button>
              </NavLink>
              <Button
                onClick={this.handleDelete}
                variant="outlined"
                color="secondary"
                className={classes.button}
              >
                Delete
              </Button>
            </Grid>
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
                    onClick={() => this.handleSpacedRepetition(0)}
                    variant="contained"
                    color="primary"
                  >
                    Blackout
                  </Button>
                  <Button
                    onClick={() => this.handleSpacedRepetition(1)}
                    variant="contained"
                    color="primary"
                  >
                    Hard
                  </Button>
                  <Button
                    onClick={() => this.handleSpacedRepetition(2)}
                    variant="contained"
                    color="primary"
                  >
                    Normal
                  </Button>
                  <Button
                    onClick={() => this.handleSpacedRepetition(3)}
                    variant="contained"
                    color="primary"
                  >
                    Good
                  </Button>
                  <Button
                    onClick={() => this.handleSpacedRepetition(4)}
                    variant="contained"
                    color="primary"
                  >
                    Easy
                  </Button>
                  <Button
                    onClick={() => this.handleSpacedRepetition(5)}
                    variant="contained"
                    color="primary"
                  >
                    Perfect
                  </Button>
                </React.Fragment>
              )}
            </Grid>
          </React.Fragment>
        )}
        {!isLoading && index >= cards.length && (
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
