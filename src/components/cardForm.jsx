import React from 'react';
import Joi from 'joi-browser';
import { getDecks } from '../services/deckService';
import Form from './form';
import { getCurrentUser } from '../services/userService';
import { saveCard, getCard } from '../services/cardService';

class CardForm extends Form {
  state = {
    data: { front: '', back: '', _deck: '', _creator: getCurrentUser()._id },
    decks: [],
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    front: Joi.string()
      .required()
      .label('Front'),
    back: Joi.string()
      .required()
      .label('Back'),
    _deck: Joi.string()
      .required()
      .label('Deck'),
    _creator: Joi.string()
      .required()
      .label('Creator'),
  };

  mapToModel = card => {
    return {
      _id: card._id,
      front: card.front,
      back: card.back,
      _deck: card._deck,
      _creator: card._creator,
    };
  };

  async populateDecks() {
    const { data: decks } = await getDecks();
    const data = { ...this.state.data };
    data._deck = decks[0]._id;
    this.setState({ decks, data });
  }

  async populateCard() {
    try {
      const cardId = this.props.match.params.id;
      if (cardId === 'new') return;

      const { data: card } = await getCard(cardId);
      this.setState({ data: this.mapToModel(card) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace('/not-found');
    }
  }

  async componentDidMount() {
    await this.populateDecks();
    await this.populateCard();
  }

  doSubmit = async () => {
    const data = { ...this.state.data };
    const card = { ...this.state.data };
    data.front = '';
    data.back = '';
    this.setState({ data });

    await saveCard(card);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect('_deck', 'Deck', this.state.decks)}
          {this.renderInput('front', 'Front', 'text', {
            multiline: true,
            variant: 'outlined',
            margin: 'normal',
          })}
          {this.renderInput('back', 'Back', 'text', {
            multiline: true,
            variant: 'outlined',
            margin: 'normal',
          })}
          {this.renderButton('Save', {
            variant: 'contained',
            color: 'primary',
            type: 'submit',
          })}
        </form>
      </div>
    );
  }
}

export default CardForm;
