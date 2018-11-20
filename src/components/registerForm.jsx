import React from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
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

class RegisterForm extends Form {
  state = {
    data: { email: '', password: '' },
    errors: {},
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .label('Email'),
    password: Joi.string()
      .required()
      .min(6)
      .label('Password'),
  };

  doSubmit = async () => {
    try {
      // response.data = {_id: "xx", email: "user@gmail.com"}
      // response.headers = { x-auth: xx }
      const response = await auth.register(this.state.data);
      auth.loginWithJwt(response.headers['x-auth']);
      window.location = '/decks';
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('email', 'Email', 'text', {
            className: classes.textField,
          })}
          {this.renderInput('password', 'Password', 'password', {
            className: classes.textField,
          })}
          {this.renderButton('Sign up', {
            variant: 'contained',
            color: 'primary',
            type: 'submit',
          })}
        </form>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterForm);
