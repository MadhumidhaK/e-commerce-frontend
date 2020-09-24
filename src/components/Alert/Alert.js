import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_ALERT } from '../../constants/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide() {
  const alert = useSelector(state => state.alert);
  const dispatch = useDispatch();

  // const handleClickOpen = () => {
  //   setAlertState({
  //       ...alertState,
  //       open: true
  //   });
  // };

  const handleClose = () => {
    dispatch({
      type: CLOSE_ALERT
    })
  };

  return (
    <div>
      <Dialog
        open={alert.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{alert.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {alert.alertText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          { alert.needCancel && <Button onClick={alert.handleCancel ? alert.handleCancel : handleClose} color="primary">
            {alert.cancelText ? alert.cancelText : "Cancel"}
          </Button>
          }
          <Button onClick={alert.handleOk ? alert.handleOk : handleClose } color="primary">
          {alert.okText ? alert.okText : "Ok"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
