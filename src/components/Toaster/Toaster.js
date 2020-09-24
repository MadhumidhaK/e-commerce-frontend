import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_TOASTER } from '../../constants/actions';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function Toaster() {
  const classes = useStyles();
  const toaster = useSelector(state => state.toaster);
  const dispatch = useDispatch();


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch({
        type: CLOSE_TOASTER
    });
  };

  return (
    <div className={classes.root}>
      <Snackbar open={toaster.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={toaster.severity}>
          {toaster.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
