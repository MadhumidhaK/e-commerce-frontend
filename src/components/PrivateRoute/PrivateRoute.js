import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

const PrivateRoute = ({ component: Component, isVerifying, ...rest}) => {
    const auth = useSelector(state => state.auth);

    if(isVerifying){
        return  <CircularProgress /> 
    }
    return <Route {...rest} render={({location}) => {
        return auth.isLoggedIn ? ( <Component  />) : <Redirect to={{
            pathname: "/login",
            state: { from : location }
        }} />
    }} />
}

export default PrivateRoute;