import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import { Redirect, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import useButtonStyles from '../../styles/useButtonStyles';
import { validateEmail } from '../../utils/validateEmail';
import { useForm } from '../../hooks/useForm';
import { LOGGED_IN, SET_CART, SET_USER_DATA } from '../../constants/actions';
import { url } from '../../constants/apiURL';
import useFormStyles from '../../styles/useFormStyles';


const ResetPassword = () => {
    const classes = useFormStyles();
    const buttonStyle = useButtonStyles();
    const history = useHistory();
    const {token} = useParams();
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    console.log(auth)

    const initialValues = {
      email: "",
      password: "",
      token: token
    }

    const successCB = (response) => {
      console.log(response);
      dispatch({
        type: SET_USER_DATA,
        payload: {
          user: {
            ...response.user
          }
        }
      })
      dispatch({
        type: SET_CART,
        payload:{
          cart: response.cart
        }
      })
      dispatch({
        type: LOGGED_IN,
        payload: {
          authKey: response.token
        }
      })
      window.localStorage.setItem('happy-shop', response.token);
      return history.push('/');
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
              errors.password = "Please enter your password.";
          }
          if(changedObject.value){
              errors.password = "";
          }
      }
      if(changedObject.param === "confirmPassword"){
        if(!changedObject.value){
            errors.confirmPassword = "Please confirm your password.";
        }
        if(changedObject.value){
            errors.confirmPassword = "";
        }
    }
      return errors;
    }

    const { handleChange, handleSubmit, values ,errors, isLoading } = 
                        useForm(initialValues, validate, successCB);

    if(auth.isLoggedIn){
      return <Redirect to="/" />
    }
  return (
    <Grid container>
      <Grid item xs>
         <form id="reset-form" className={classes.root} noValidate autoComplete="off" onSubmit={(e) => {
          handleSubmit(e,url + "/user/resetpassword");
      }}>
            <Box display="flex" flexDirection="column" alignItems="center">
                {errors.error && <Alert severity="error" className="mt-1">{errors.error}</Alert>}
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
                  <TextField type="password" required  
                  id="confirmPassword" 
                  name="confirmPassword" 
                  label="Confirm Password" 
                  value={values.confirmPassword} 
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  />
                {isLoading ?   <CircularProgress />  : 
                <Button variant="contained" className={buttonStyle.login} type="submit">
                        Submit
                </Button>}
            </Box>
        </form>
      </Grid>
    </Grid>
    )
}

export default ResetPassword;