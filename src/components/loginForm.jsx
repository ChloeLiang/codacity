import React from 'react';
import PropTypes from 'prop-types';
import Joi from 'joi-browser';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Form from './form';

import auth from '../services/userService';

const styles = theme => ({
  root: {
    maxWidth: '450px',
    margin: '3em auto',
  },
  heading: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    // width: '100%',
  },
  textField: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class LoginForm extends Form {
  state = {
    data: { email: '', password: '' },

    // 0 or more key-value pairs.
    // Key is the name of the target field.
    // Value is an error message.
    // "submit" stores form submission error.
    errors: {},
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .label('Email'),
    password: Joi.string()
      .required()
      .label('Password'),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.email, data.password);

      // In App.js, componentDidMount is only executed once.
      // Reload the whole application to save the token after user logged in.
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
        <Typography variant="h4" className={classes.heading}>
          Login
        </Typography>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput('email', 'Email', 'text', {
            className: classes.textField,
          })}
          {this.renderInput('password', 'Password', 'password', {
            className: classes.textField,
          })}
          {this.renderButton('Login', {
            variant: 'contained',
            color: 'primary',
            type: 'submit',
            className: classes.button,
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
