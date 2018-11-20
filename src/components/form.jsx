import React, { Component } from 'react';
import Joi from 'joi-browser';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';

class Form extends Component {
  state = { data: {}, errors: {} };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) {
      return null;
    }

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }

    return errors;
  };

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
    } else {
      delete errors[input.name];
    }

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) {
      return;
    }

    this.doSubmit();
  };

  renderInput = (name, label, type, rest) => {
    const { data, errors } = this.state;
    const error = errors[name];

    return (
      <TextField
        {...rest}
        error={!!error}
        onChange={this.handleChange}
        value={data[name]}
        type={type}
        label={error || label}
        name={name}
        fullWidth
      />
    );
  };

  renderSelect = (name, label, options) => {
    const { data } = this.state;

    return (
      <FormControl variant="outlined">
        <InputLabel
          ref={ref => {
            this.InputLabelRef = ref;
          }}
          htmlFor={name}
        >
          {label}
        </InputLabel>
        <Select
          value={data._deck}
          onChange={this.handleChange}
          input={<OutlinedInput labelWidth={35} name={name} id={name} />}
        >
          {options.map(deck => (
            <MenuItem key={deck._id} value={deck._id}>
              {deck.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  renderButton = (label, rest) => {
    return (
      <Button disabled={!!this.validate()} {...rest}>
        {label}
      </Button>
    );
  };
}

export default Form;
