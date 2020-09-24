import './Auth.css';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import useButtonStyles from '../../styles/useButtonStyles';
import { validateEmail } from '../../utils/validateEmail';
import { useForm } from '../../hooks/useForm';
import { LOGGED_IN, SET_CART, SET_USER_DATA } from '../../constants/actions';
import { url } from '../../constants/apiURL';
import useFormStyles from '../../styles/useFormStyles';


const Login = () => {
    const classes = useFormStyles();
    const buttonStyle = useButtonStyles();
    const history = useHistory();
    const location = useLocation();
    const { from } = location.state || { from: { pathname: "/" } };
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    console.log(auth)

    const initialValues = {
      email: "",
      password: ""
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
      return history.replace(from);
    }

    const validate = (changedObject) => {
      const errors = {}
      if(changedObject.param === "email"){
          if(!changedObject.value || !validateEmail(changedObject.value)){
              errors.email = "Please enter a valid email.";
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
      return errors;
    }

    const { handleChange, handleSubmit, values, errors, isLoading } = 
                        useForm(initialValues, validate, successCB);

    if(auth.isLoggedIn){
      return <Redirect to={from.pathname} />
    }
  return (
    <Grid container>
        <Grid item xs>
         <form id="login-form" className={classes.root} noValidate autoComplete="off" onSubmit={(e) => {
          handleSubmit(e,url + "/user/login");
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
                {isLoading ?   <CircularProgress />  : 
                <Button variant="contained" className={buttonStyle.login} type="submit">
                        Login
                </Button>}
            </Box>
        </form>
        <Link to="/request/reset"><small className="text-dark text-center small-link display-block m-2">Forgot Password?</small></Link>
                <Link to="/signup">
                  <small className="text-dark text-center display-block m-2">
                  Don't have an account? Create one <span className="text-blue small-link">here</span>. 
                  </small>
                </Link>
        </Grid>
        </Grid>
    )
}

export default Login;