import React, { Component } from 'react';
import Joi from 'joi-browser';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Form extends Component {
  state = { data: {}, errors: {} };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleChange = ({ target: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) {
      errors[input.name] = errorMessage;
    }

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  renderInput = (name, label, type, rest) => {
    return (
      <TextField
        {...rest}
        onChange={this.handleChange}
        type={type}
        label={label}
        name={name}
        fullWidth
      />
    );
  };

  renderButton = (label, rest) => {
    return <Button {...rest}>{label}</Button>;
  };
}

export default Form;
