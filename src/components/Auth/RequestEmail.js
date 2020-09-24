import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import { Redirect,  useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useButtonStyles from '../../styles/useButtonStyles';
import { validateEmail } from '../../utils/validateEmail';
import { useForm } from '../../hooks/useForm';
import { url } from '../../constants/apiURL';
import { Alert, AlertTitle } from '@material-ui/lab';
import useFormStyles from '../../styles/useFormStyles';


const RequestEmailVerification = () => {
    const auth = useSelector(state => state.auth);
    const [ isEmailSent, setIsEmailSent ] = useState(false);
    const initialValues = {
        email: ""
    }
    const classes = useFormStyles();
    const buttonStyle = useButtonStyles();
    const { action } = useParams();

    let isVerification;
    

    const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "email"){
            if(!changedObject.value || !validateEmail(changedObject.value)){
                errors.email = "Please enter a valid email";
            }else{
                errors.email = "";
            }
        }
        return errors;
    }


    const cb = (response) => {
        console.log(response);
        setIsEmailSent({
            isEmailSent: true
        });
    }

    const { handleChange, handleSubmit, values, errors, isLoading } = useForm(initialValues, validate, cb)

    if(action === "verify"){
        isVerification = true
    }else if(action === "reset"){
        isVerification = false
    }else{
        return <Redirect to="/404" />
    }


    if(auth.isLoggedIn){
        return <Redirect to="/" />
    }

    if(isEmailSent){
        return (
            <Alert severity="success" className="message-style">
                <AlertTitle><strong>Hello!</strong></AlertTitle>
                {action === "verify" ?
                        `New verification link has been sent to your registered mail. Please verify your account.
                            Link will expire in an hour.` :
                        `New password reset request link has been sent to your registered mail. Please reset your password.
                            Link will expire in an hour.`   
                    }
            </Alert>
        )
    }
    

    return(
        <Grid container>
      <Grid item xs>
        <form id="reset-form" className={classes.root} noValidate autoComplete="off" onSubmit={(e) => {
            handleSubmit(e, url+"/user" + (action === "verify" ? "/requestverifyemail" : "/forgotpassword"));
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



export default RequestEmailVerification;