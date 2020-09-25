import './Auth.css';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Box, Button, CircularProgress, Grid } from '@material-ui/core';
import useButtonStyles from '../../styles/useButtonStyles';
import { useForm } from '../../hooks/useForm';
import { validateEmail } from '../../utils/validateEmail';
import {Alert, AlertTitle } from '@material-ui/lab';
import { url } from '../../constants/apiURL';
import { Link } from 'react-router-dom';
import useFormStyles from '../../styles/useFormStyles';


const Signup = () => {
  const classes = useFormStyles();
  const buttonStyle = useButtonStyles();
  const [signedUp, setSignedUp] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    firstName: '',
    lastName:'',
    confirmPassword: ''
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

      if(changedObject.param === "confirmPassword"){
          if(!changedObject.value){
              errors.confirmPassword = "Please confirm your password.";
          }
          if(changedObject.value){
              errors.confirmPassword = "";
          }
      }

      if(changedObject.param === "firstName"){
          if(!changedObject.value){
              errors.firstName = "Please enter your first name.";
          }
          if(changedObject.value){
              errors.firstName = "";
          }
      }

      if(changedObject.param === "lastName"){
          if(!changedObject.value){
              errors.lastName = "Please enter your last name.";
          }
          if(changedObject.value){
              errors.lastName = "";
          }
      }

      return errors;
  }

  const successCB = (response) => {
    setSignedUp(true);
  }

  const { handleChange, handleSubmit, values ,errors, isLoading } = useForm(initialValues, validate, successCB)
  
  if(signedUp){
    return (
      <Alert severity="success" className="message-style">
        <AlertTitle><strong>Welcome!</strong></AlertTitle>
          Welcome to HappyShop, your account has been registered. Please verify your account using the verification
          link sent to your registered email.
      </Alert>
    )
  }
  return (
    <Grid container>
        <Grid item xs>
         <form id="login-form" className={classes.root}  noValidate autoComplete="off" onSubmit={(e) => {
          return handleSubmit(e, url+ "/user/signup");
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
                <TextField required 
                  id="firstName"  
                  name="firstName" 
                  label="First Name" 
                  value={values.firstName} 
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  />
                <TextField required 
                  id="lastName"  
                  name="lastName" 
                  label="Last Name"
                  value={values.lastName} 
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  />
                <TextField required
                  type="password"   
                  id="password" 
                  name="password" 
                  label="Password" 
                  value={values.password} 
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  />
                <TextField required 
                  type="password"   
                  id="confirmPassword" 
                  name="confirmPassword" 
                  label="Confirm Password" 
                  value={values.confirmPassword} 
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  />
               { isLoading ?  <CircularProgress /> : <Button variant="contained" className={buttonStyle.login} type="submit">
                        Sign up
                </Button>}
            </Box>
        </form>
        <Link to="/login">
            <small className="text-dark text-center display-block m-2">
            Already have an account? Login <span className="text-blue small-link">here</span>. 
            </small>
        </Link>
      </Grid>
    </Grid>
    )
}

export default Signup;