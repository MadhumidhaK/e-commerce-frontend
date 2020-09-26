import { Box } from '@material-ui/core';
import React from 'react';
import Item from './Item';

const DisplayItems = ({ items }) => {
        return (
            <Box flexDirection="row" flexWrap="wrap" className="cart-items">    
                {items.map((item, index) => {
                    return (
                        <Item key={index} item={item}/>
                    )
                })}
            </Box>
        )
}

export default DisplayItems;