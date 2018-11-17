import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

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

class RegisterForm extends Component {
  state = {
    data: { email: '', password: '' },
  };

  handleChange = ({ target: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  };

  handleSubmit = async e => {
    e.preventDefault();

    try {
      // response.data = {_id: "xx", email: "user@gmail.com"}
      // response.headers = { x-auth: xx }
      const response = await auth.register(this.state.data);
      auth.loginWithJwt(response.headers['x-auth']);
      window.location = '/';
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
        <h1>Register</h1>
        <form onSubmit={this.handleSubmit}>
          <TextField
            onChange={this.handleChange}
            className={classes.textField}
            variant="outlined"
            type="email"
            label="Email"
            name="email"
            autoComplete="email"
            margin="normal"
            fullWidth
          />
          <TextField
            onChange={this.handleChange}
            className={classes.textField}
            variant="outlined"
            type="password"
            label="Password"
            name="password"
            fullWidth
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterForm);