import React from 'react';
import Joi from 'joi-browser';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Form from './form';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing.unit,
  },
  grow: {
    width: 0,
    flexGrow: 1,
  },
});

class UpdateDeckForm extends Form {
  state = {
    data: {
      _id: this.props.deck._id,
      name: this.props.deck.name,
      _creator: this.props.deck._creator,
    },
    errors: {},
  };

  schema = {
    _id: Joi.string().required(),
    name: Joi.string()
      .required()
      .label('Name'),
    _creator: Joi.string().required(),
  };

  doSubmit = () => {
    const { onUpdate } = this.props;
    onUpdate(this.state.data);
  };

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container justify="center">
          {this.renderInput('name', 'New name', 'text', {
            className: classes.grow,
          })}
          {this.renderButton('Save', {
            variant: 'contained',
            color: 'primary',
            className: classes.button,
            type: 'submit',
          })}
        </Grid>
      </form>
    );
  }
}

export default withStyles(styles)(UpdateDeckForm);
