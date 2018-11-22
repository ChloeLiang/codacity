import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CodeBlock from './codeBlock';
import { getCardsInDeck, saveCard, deleteCard } from '../services/cardService';

const styles = theme => ({
  grow: {
    flexGrow: 1,
    padding: '1em 0 5em 0',
  },
  back: {
    borderTop: '1px solid rgba(124, 124, 124, .5)',
    paddingTop: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
  },
  buttons: {
    position: 'fixed',
    bottom: '0',
    [theme.breakpoints.down('sm')]: {
      left: 0,
    },
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
    [theme.breakpoints.up('lg')]: {
      width: '70%',
    },
  },
  blackout: {
    backgroundColor: '#880e4f',
    borderRadius: '0px',
    flex: '0 0 calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 6)',
    },
  },
  hard: {
    backgroundColor: '#ad1457',
    borderRadius: '0px',
    flex: '0 0 calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 6)',
    },
  },
  normal: {
    backgroundColor: '#d81b60',
    borderRadius: '0px',
    flex: '0 0 calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 6)',
    },
  },
  good: {
    backgroundColor: '#e91e63',
    borderRadius: '0px',
    flex: '0 0 calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 6)',
    },
  },
  easy: {
    backgroundColor: '#ec407a',
    borderRadius: '0px',
    flex: '0 0 calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 6)',
    },
  },
  perfect: {
    backgroundColor: '#f06292',
    borderRadius: '0px',
    flex: '0 0 calc(100% / 3)',
    [theme.breakpoints.up('sm')]: {
      flex: '0 0 calc(100% / 6)',
    },
  },
  answer: {
    backgroundColor: '#7F00FF',
    borderRadius: '0px',
    width: '100%',
  },
  link: {
    textDecoration: 'none',
  },
  leftSpace: {
    marginLeft: theme.spacing.unit,
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

  getParams = (card, quality) => {
    // The number of times a user sees a flashcard.
    let repetition = card.repetition;

    // The easiness factor or EFactor or EF. It is multiplier used to increase
    // the "space" in spaced repetition. The range is from 1.3 to 2.5.
    let easiness = card.easiness;

    // The length of time (in days) between repetitions.
    // It is the "space" of spaced repetition.
    let interval = card.interval;

    // Quality is how difficult a flashcard is. The scale is from 0 to 5.
    // 0 is blackout. 5 is perfect.
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

    return {
      repetition,
      easiness,
      interval,
    };
  };

  getUpdatedCard = (card, quality) => {
    const { repetition, easiness, interval } = this.getParams(card, quality);

    console.log('interval:', interval);
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

  renderButton = (quality, text, style) => {
    const { cards, index } = this.state;

    return (
      <Button
        onClick={() => this.handleSpacedRepetition(quality)}
        variant="contained"
        color="primary"
        className={style}
      >
        {this.getParams(cards[index], quality).interval + ' d'}
        <br />
        {text}
      </Button>
    );
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
                <Button variant="contained" color="primary">
                  Edit
                </Button>
              </NavLink>
              <Button
                onClick={this.handleDelete}
                variant="contained"
                color="secondary"
                className={classes.leftSpace}
              >
                Delete
              </Button>
            </Grid>
            <Grid container direction="column" className={classes.grow}>
              <ReactMarkdown
                source={cards[index].front}
                renderers={{ code: CodeBlock }}
              />
              {isAnswered && (
                <ReactMarkdown
                  className={classes.back}
                  source={cards[index].back}
                  renderers={{ code: CodeBlock }}
                />
              )}
            </Grid>
            <Grid container justify="center" className={classes.buttons}>
              {!isAnswered && (
                <Button
                  onClick={this.handleAnswer}
                  variant="contained"
                  color="primary"
                  className={classes.answer}
                >
                  Show Answer
                </Button>
              )}
              {isAnswered && (
                <React.Fragment>
                  {this.renderButton(0, 'Blackout', classes.blackout)}
                  {this.renderButton(1, 'Hard', classes.hard)}
                  {this.renderButton(2, 'Normal', classes.normal)}
                  {this.renderButton(3, 'Good', classes.good)}
                  {this.renderButton(4, 'Easy', classes.easy)}
                  {this.renderButton(5, 'Perfect', classes.perfect)}
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
