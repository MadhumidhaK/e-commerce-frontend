import { Box } from '@material-ui/core';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { url } from '../../constants/apiURL';
import Item from './Item';

const DisplayItems = ({ items }) => {
        return (
            <Box flexDirection="row" flexWrap="wrap" className="cart-items">    
                {items.map((item, index) => {
                    const product = item.product
                    console.log(url + "/" + product.productImage)
                    return (
                        <Item key={index} item={item}/>
                    )
                })}
        </Box>
        )
}

export default DisplayItems;