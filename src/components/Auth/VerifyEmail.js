import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import useButtonStyles from '../../styles/useButtonStyles';
import { Redirect, useParams } from 'react-router-dom';
import { validateEmail } from '../../utils/validateEmail';
import { useHistory } from "react-router-dom";
import { url } from '../../constants/apiURL';
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_ALERT, LOGGED_IN, OPEN_ALERT, SET_CART, SET_USER_DATA } from '../../constants/actions';
import { Alert } from '@material-ui/lab';
import { useForm } from '../../hooks/useForm';
import useFormStyles from '../../styles/useFormStyles';

const VerifyEmail = () => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const classes = useFormStyles();
    const buttonStyle = useButtonStyles();

    const history = useHistory();

    const {token} = useParams();

    const initialValues = {
      email: '',
      password: '',
      token: token
    }
    const validate = (changedObject) => {
      const errors = {}
      if(changedObject.param === "email"){
          if(!changedObject.value || !validateEmail(changedObject.value)){
              errors.email = "Please enter a valid email";
          }else{
              errors.email = "";
          }
      }
      if(changedObject.param === "password"){
          if(!changedObject.value){
              errors.password = "Please enter your password";
          }
          if(changedObject.value){
              errors.password = "";
          }
      }
      return errors;
  }
    const successCB = (response) => {
      
      dispatch({
        type: SET_USER_DATA,
        payload: {
          user: {
            ...response.user
          }
        }
      })
      dispatch({
        type: LOGGED_IN,
        payload: {
          authKey: response.token
        }
      });
      dispatch({
        type: SET_CART,
        payload:{
          cart: response.cart
        }
      })
     
      dispatch({
        type: OPEN_ALERT,
        payload: {
          open: true,
          title: "Your Email is verified Successfully!",
          alertText: "Do you wish to sell Products?",
          needCancel: true,
          cancelText: "No",
          okText: "Yes",
          handleOk: () => {
            history.push('/user');
            dispatch({
              type: CLOSE_ALERT
            })
          }
        }
      })
      window.localStorage.setItem('happy-shop', response.token);
      history.push("/");
    }
    
    const { handleChange, handleSubmit, values, errors, isLoading, responseStatusCode } = 
    useForm(initialValues, validate, successCB);

    if(auth.isLoggedIn){
    return <Redirect to="/" />
    }
        

  return (
    <Grid container>
      <Grid item xs>
         <form id="verify-form" className={classes.root}  noValidate autoComplete="off" onSubmit={(e) => {
            handleSubmit(e, url + "/user/verifyemail");
           }}>
            <Box display="flex" flexDirection="column" alignItems="center">
                {errors.error && <Alert severity="error" className="mt-1">{responseStatusCode === 410? 
                      <p>{errors.error}{" "}Click <span onClick={() => history.push("/request/verify")} className="small-link">
                        here</span> to request a new Link.</p>
                  :errors.error}</Alert>}
                <TextField required 
                    id="email"  
                    name="email" 
                    label="Email" 
                    value={values.email} 
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    />
                <TextField type="password" required  
                    id="password" 
                    name="password" 
                    label="Password" 
                    value={values.password} 
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    />
                {isLoading ?   <CircularProgress />  : 
                <Button variant="contained" className={buttonStyle.login} type="submit">
                        Verify
                </Button>}
            </Box>
        </form>
      </Grid>
  </Grid>
    )
}

export default VerifyEmail;