import React from 'react';
import Joi from 'joi-browser';
import { getDecks } from '../services/deckService';
import Form from './form';
import { getCurrentUser } from '../services/userService';
import { saveCard } from '../services/cardService';

class CardForm extends Form {
  state = {
    data: { front: '', back: '', _deck: '', _creator: getCurrentUser()._id },
    decks: [],
    errors: {},
  };

  schema = {
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

  async populateDecks() {
    const { data: decks } = await getDecks();
    const data = { ...this.state.data };
    data._deck = decks[0]._id;
    this.setState({ decks, data });
  }

  async componentDidMount() {
    await this.populateDecks();
  }

  doSubmit = async () => {
    const data = { ...this.state.data };
    const card = { ...this.state.data };
    data.front = '';
    data.back = '';
    this.setState({ data });

    const { data: result } = await saveCard(card);
    console.log(result);
  };

  render() {
    return (
      <div>
        <h1>New Card</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect('_deck', 'Deck', this.state.decks)}
          {this.renderInput('front', 'Front', 'text', {
            multiline: true,
            rows: '4',
            variant: 'outlined',
            margin: 'normal',
          })}
          {this.renderInput('back', 'Back', 'text', {
            multiline: true,
            rows: '4',
            variant: 'outlined',
            margin: 'normal',
          })}
          {this.renderButton('Add to deck', {
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
