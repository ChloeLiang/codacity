import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
});

class PositionedSnackbar extends Component {
  state = {
    vertical: 'bottom',
    horizontal: 'center',
  };

  render() {
    const { vertical, horizontal } = this.state;
    const {
      classes,
      messageInfo,
      open,
      onClose,
      onExited,
      onUndo,
    } = this.props;
    return (
      <div>
        <Snackbar
          key={messageInfo.key}
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={6000}
          onClose={onClose}
          onExited={onExited}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{messageInfo.message}</span>}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={() => onUndo(messageInfo.data)}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(PositionedSnackbar);
