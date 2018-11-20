import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { withStyles } from '@material-ui/core/styles';
import Form from './form';

import auth from '../services/userService';

const styles = theme => ({
  root: {
    maxWidth: '400px',
    margin: '0 auto',
  },
  textField: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class LoginForm extends Form {
  state = {
    data: { email: '', password: '' },

    // 0 or more key-value pairs. Key is the name of the target field. Value is
    // an error message.
    errors: {},
  };

  schema = {
    email: Joi.string()
      .required()
      .label('Email'),
    password: Joi.string()
      .required()
      .label('Password'),
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      const { data } = this.state;
      await auth.login(data.email, data.password);

      // In App.js, componentDidMount is only executed once.
      // Reload the whole application to save the token after user logged in.
      window.location = '/decks';
    } catch (ex) {
      if (
        ex.response &&
        ex.response.status >= 400 &&
        ex.response.status < 500
      ) {
        console.log(ex.response.data);
      }
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('email', 'Email', 'text', {
            className: classes.textField,
            variant: 'outlined',
          })}
          {this.renderInput('password', 'Password', 'password', {
            className: classes.textField,
            variant: 'outlined',
          })}
          {this.renderButton('Login', {
            variant: 'contained',
            color: 'primary',
            type: 'submit',
          })}
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginForm);
