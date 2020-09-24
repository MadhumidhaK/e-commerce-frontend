import { Box, Card, CardActionArea,  CircularProgress, makeStyles } from '@material-ui/core';
import React from 'react';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import {  useSelector } from 'react-redux';
import { url } from '../../constants/apiURL';
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
    },
});

const Home = function (){
    const classes = useStyles();
    const categories = useSelector(state => state.categories);

    return (
        <div className="mt-1">
            Select any category to view the products
            <Box flexDirection="row" flexWrap="wrap">
                    {categories.length < 1 ? <CircularProgress /> : categories.map((category, index) =>{
                            return (
                                <Link to={'/category/'+category.name} key={index}>
                                    <Card key={index} className={classes.root + " card-style"}>
                                        <CardActionArea>
                                            <CardMedia
                                            className={classes.media + " card-media"}
                                            image={url + "/" + category.categoryImage.replace("\\", "/")}
                                            title={category.name}
                                            />
                                        </CardActionArea>
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {category.title}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Link>
                        )
                    }) }
            </Box>
        </div>
    )
}

export default Home;