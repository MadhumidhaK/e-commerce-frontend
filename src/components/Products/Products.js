import { Box,    CircularProgress ,makeStyles, Tooltip } from '@material-ui/core';
import React, { useEffect, useState} from 'react';
import AddIcon from '@material-ui/icons/Add';

import { url } from '../../constants/apiURL';
import { useHistory, Link, useParams, Redirect } from 'react-router-dom';
import { Alert, AlertTitle, Pagination } from '@material-ui/lab';
import useQuery from '../../hooks/useQuery';
import fetchData from '../../utils/fetchData';
import Product from './Product';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
    addIcon: {
        margin: "1rem 1rem 0 0",
        padding: "1rem",
        background: "#3f51b5",
        display: "flex",
        color: "white",
        borderRadius: "60%",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transform: "none",
        transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        boxShadow: "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
        '&:hover': {
            background: "#213082"
        }
    }
})

const Products = function (){
    const classes = useStyles();
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [pagesCount, setPagesCount] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(state => state.user);
    let query = useQuery();
    let currentPage = query.get("page");
    if(!currentPage || currentPage === 0){
        currentPage = 1;
    }
    
    
    const successCB = (response) => {
        setProducts(response.products)
        setPagesCount(response.pagesCount)
    }
    const errorCB = (response) => {
        setError(response.error)
    }
    
    const {filterBy, name} = useParams();

    useEffect(() => {
        const getData = async () => {
            await fetchData( url + "/product/"+ filterBy + "/" + name +"?page=" + currentPage,
                                                                 {}, successCB, errorCB);
            setIsLoading(false);
        }
        getData();
    },[currentPage])

    
    const handleChange = (event, value) => {
        setProducts([]);
        setIsLoading(true)
        history.push('?page='+ value);
      };

    if(error){
        if(error.message) setError(error.message)
    return (
        <Alert severity="error" className="message-style">
            <AlertTitle><strong>{error}</strong></AlertTitle>
            Please check again Later!
        </Alert>
    )
    }

    if(filterBy === 'brand' || filterBy === 'category'){
       
        if(isLoading){
            return (
            <>
            <CircularProgress />
            <div className="main"></div>
            <Pagination className="justify-content-center mb-1rem" count={pagesCount} page={parseInt(currentPage)} color="primary" onChange={handleChange} />
            </>)
        }
        if(currentPage > pagesCount){
            history.push('?page='+ (pagesCount))
        }
        if(parseInt(currentPage) === 0){
            history.push('?page=1')
        }
        return (
            <div style={{position: "relative"}}>
                    {filterBy === 'brand' && user.isSeller && user.brand === name ?
                    <Box>
                        <div style={{position: "fixed", zIndex: "50", marginLeft: "calc(100vw - 80px)"}}>
                            <Link to="/add-product" className="float-right">
                                <Tooltip title="Add Product">
                                    <div className={classes.addIcon}>
                                        <AddIcon />
                                    </div>
                                </Tooltip>
                            </Link>
                        </div>
                    </Box> : ""}
                
                <Box flexDirection="row" flexWrap="wrap">
                        {products.length < 1 ?  <CircularProgress />  :   products.map((product, index) => {
                            return (
                                <Product key={index} product={product} filterBy={filterBy} name={name} />
                            )
                        })}
                </Box>

                <Pagination className="justify-content-center  mb-1rem" count={pagesCount} color="primary" page={parseInt(currentPage)} onChange={handleChange} />
            </div>
        )
    }
    return <Redirect to="/404" />

}

export default Products;