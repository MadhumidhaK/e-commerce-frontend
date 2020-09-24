import './ProductForm.css'
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { Box, Button, CircularProgress, FormControl, FormHelperText, Grid, Input, InputAdornment, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../hooks/useForm';
import { url } from '../../constants/apiURL';
import { OPEN_TOASTER } from '../../constants/actions';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import fetchData from '../../utils/fetchData';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(2),
        width: '90%',
      },
      green: {
          color: "green",
          backgroundColor: "orange"
      },
    },
  }));


export default function ProductForm() {
  const classes = useStyles();
  const user = useSelector(state => state.user);
  const auth = useSelector( state => state.auth);
  
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const {id} = useParams();
  const [image, setImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState();
  const [isProductLoading, setIsProductLoading] = useState(false);
  let initialValues =  {
    name:"",
    availableQuantity: "",
    category : "",
    price : "",
    description :"",
    productImage : "", 
   }
  const [categories, setCategories] = useState([]);   
  const validate = (changedObject) => {
        const errors = {}
        if(changedObject.param === "name"){
            if(!changedObject.value){
                errors.name = "Please enter Product Name.";
            }
            if(changedObject.value){
                errors.name = "";
            }
        }
        if(changedObject.param === "availableQuantity"){
            if(!changedObject.value){
                errors.availableQuantity = "Please enter available quantity.";
            }
            if(changedObject.value){
                errors.availableQuantity = "";
            }
        }
        if(changedObject.param === "price"){
            if(!changedObject.value){
                errors.price = "Please enter the price of the product.";
            }
            if(changedObject.value){
                errors.price = "";
            }
        }

        if(changedObject.param === "category"){
            if(!changedObject.value){
                errors.category = "Please select a category.";
            }
            if(changedObject.value){
                errors.category = "";
            }
        }
        if(changedObject.param === "description"){
            if(!changedObject.value){
                errors.description = "Please enter a description.";
            }
            if(changedObject.value){
                errors.description = "";
            }
        }
        return errors;
    }   


  const successCB = function(response){
       
        dispatch({
            type: OPEN_TOASTER,
            payload: {
                message: isEditing ? "Updated Product Successfully!" : "Added Product Successfully!",
                severity: "success"
            }
        })
        history.push('/brand/' + user.brand );
  }

  useFetch(url + "/product/categorieslist", {}, (response) => { setCategories(response.categories)})
  

  const { handleChange, handleSubmit, values, errors, isLoading, setValues } = 
                        useForm(initialValues, validate, successCB);

    useEffect(() => {
                console.log("location.pathname")
                console.log(location.pathname)
                if(location.pathname === "/edit-product/" + id){
                        setIsEditing(true);
                        setIsProductLoading(true);
                        fetchData(url+ "/product/p/"+id, {}, 
                        (response) => {
                            setValues({
                                name: response.product.name,
                                availableQuantity: response.product.availableQuantity,
                                category : response.product.category._id,
                                price : response.product.price,
                                description :response.product.description 
                            });
                            setIsProductLoading(false);
                        }, (response) => {
                            setError(response.error);
                            setIsProductLoading(false);
                        })
                }else{
                    setIsEditing(false)
                }
}, []);

if(isProductLoading){
    return <CircularProgress />
}

if(error){
    return (
        <Alert severity="error" className="message-style">
            <AlertTitle><strong>{error}</strong></AlertTitle>
        </Alert>
        )
}
  return (
    <Grid container>
        <Grid item xs>
                <form noValidate id='add-product'  autoComplete="off" onSubmit={(e) => {
                    if(isEditing){
                        return handleSubmit(e, url + "/product/update/" + id, {
                            "Authorization": auth.authKey
                        }, "PATCH")
                    }
                    return handleSubmit(e, url + "/product/add", {
                        "Authorization": auth.authKey
                    }, "POST", true)
                }}>
                <Box display="flex" flexDirection="column" alignItems="center" className={classes.root + " w-100"}>
                <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" className="w-100">
                    {!isEditing && <Box className="image-container">
                    {values.productImage ? 
                    <img src={image} className="product-image" alt="image"></img> : <div style={{ height: '100px'}}></div>}
                        <input
                        accept="image/*"
                        onChange={(e) => {
                            if(e.target.files[0]){
                                handleChange(e);
                                setImage(URL.createObjectURL(e.target.files[0]))
                            }
                        }}
                        name="productImage"
                        style={{ display: 'none' }}
                        id="productImage"
                        type="file"
                        />
                        <label htmlFor="productImage">
                        <Button variant="contained" component="span" className={classes.button}>
                            <small>Product Image</small>
                        </Button>
                        </label> 
                    </Box>}
                    <Box display="flex" flexDirection="column" alignItems="center"  className="form">
                    <TextField 
                        label="Name" 
                        multiline       
                        name={"name"}
                        id={"name"}
                        value={values.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                    />  
                  <FormControl style={{width: '90%'}} error={!!errors.category}>
                        <InputLabel id="categoryLabel">Category</InputLabel>
                        <Select
                        labelId="categoryLabel"
                        id="category"
                        name="category"
                        onChange={handleChange}
                        value={values.category}
                        >
                        <MenuItem>
                            <em>None</em>
                        </MenuItem>
                        {categories.map((category, index) => {
                            return <MenuItem key={index} value={category._id}>
                                    {category.title}
                            </MenuItem>
                        })}
                        </Select>
                    {!!errors.category && <FormHelperText >{errors.category}</FormHelperText>}
                    </FormControl>
                    <TextField
                        id="description"
                        label="Description"
                        name="description"
                        multiline
                        // rows={4}
                        value={values.description}
                        // variant="filled"
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        />

                    <Box display="flex" flexDirection="row" alignItems="center" style={{width: "90%"}}>
                   <TextField 
                        style={{width: "50%", marginLeft: 0}}
                        type="number"
                        label="Available Quantity" 
                        name={"availableQuantity"}
                        id={"availableQuantity"}
                        value={values.availableQuantity}
                        onChange={handleChange}
                        error={!!errors.availableQuantity}
                        helperText={errors.availableQuantity}
                    />
                    <FormControl style={{width: "50%"}}  error={!!errors.price} >
                    <InputLabel htmlFor="price">Price</InputLabel>

                    <Input 
                        type="number"
                        label="Price" 
                        name={"price"}
                        id={"price"}
                        value={values.price}
                        onChange={handleChange}
                        startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                    />
                    {!!errors.price && <FormHelperText >{errors.price}</FormHelperText>}
                    </FormControl>
                   </Box>
                    
                    
                    </Box>
                    </Box>
                     
                    
                    { isLoading ?  <CircularProgress /> :<Button type="submit" className="mt-1" variant="contained" color="primary">
                        Update
                    </Button> }
                    </Box>
                </form>
                </Grid>
      </Grid>
  );
}
