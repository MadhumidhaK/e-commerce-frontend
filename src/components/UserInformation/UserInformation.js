import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Box, Button, CircularProgress, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { url } from '../../constants/apiURL';
import { OPEN_TOASTER, SET_USER_DATA } from '../../constants/actions';
import { useHistory } from 'react-router-dom';
import useFormStyles from '../../styles/useFormStyles';



export default function UserInformation() {
  const classes = useFormStyles();
  const user = useSelector(state => state.user);
  const auth = useSelector( state => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();

   const initialValues = {
       firstName: user.firstName,
       lastName: user.lastName,
       isSeller: user.isSeller,
       brandName: user.brandName    
   }

    const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "brandName"){
            if(!changedObject.value){
                errors.brandName = "Please enter your Brand Name.";
            }
            if(changedObject.value){
                errors.brandName = "";
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


  const successCB = function(response){
        dispatch({
            type: SET_USER_DATA,
            payload: {
                user: {
                    ...response.user
                }   
            }
        })
        dispatch({
            type: OPEN_TOASTER,
            payload: {
                message: "Updated Successfully!",
                severity: "success"
            }
        })
        history.push('/')
  }

  const { handleChange, handleSubmit, values,errors, isLoading } = 
                        useForm(initialValues, validate, successCB);

  return (
    <Grid container>
        <Grid item xs>
                <form noValidate  className={classes.root} autoComplete="off" onSubmit={(e) => {
                    return handleSubmit(e, url + "/user/update", {
                        "Authorization": auth.authKey
                    })
                }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <TextField 
                        label="First Name"
                        name={"firstName"}
                        id={"firstName"}
                        value={values.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                    />
                    <TextField 
                        label="Last Name" 
                        name={"lastName"}
                        id={"lastName"}
                        value={values.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                    />
                    {user.isSeller ? 
                        ""
                    :<div  className="d-flex justify-content-center flex-column justify-space-around align-items-center">
                    <FormLabel component="legend" className="mt-1 m-2">Do you wish to sell your products in Happy Shop?</FormLabel>
                    <RadioGroup aria-label="isSeller" id="isSeller" name="isSeller" value={values.isSeller} onChange={handleChange}>
                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                        <FormControlLabel value={false} control={<Radio />} label="No" />
                    </RadioGroup>
                    <small style={{color: "red"}}>This action can't be reversed.</small>
                    </div>}
                    {values.isSeller && <TextField 
                        label="Brand Name" 
                        name={"brandName"}
                        id={"brandName"}
                        value={values.brandName}
                        onChange={handleChange}
                        error={!!errors.brandName}
                        helperText={errors.brandName}
                    />}
                        { isLoading ?  <CircularProgress /> :<Button type="submit" variant="contained" color="primary">
                                Update
                        </Button> }
                    </Box>
                </form>
            </Grid>
      </Grid>
  );
}
