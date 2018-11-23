import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  container: {
    textAlign: 'center',
  },
});

function CircularIndeterminate(props) {
  const { classes, open } = props;
  return (
    <React.Fragment>
      {open && (
        <div className={classes.container}>
          <CircularProgress className={classes.progress} />
        </div>
      )}
    </React.Fragment>
  );
}

CircularIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
