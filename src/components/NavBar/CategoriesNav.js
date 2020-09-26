import './NavBar.css';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "90%",
    margin: "auto"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  bgGrey: {
    backgroundColor: "#dd8282"
  },
  nav: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
  },
  mobNav: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  expand: {
    padding: "0",
    margin: "0",
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

export default function CategoriesNav() {
  const classes = useStyles();
  const categories = useSelector(state => state.categories);
  const location = useLocation();
  const [isResizing, setIsResizing ]= useState(false);
  const [isMobile, setIsMobile] = useState(false);
  window.addEventListener('resize', () => {
      setIsResizing(window.innerWidth);

  });
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
      if(window.innerWidth < 768){
          setIsMobile(true)
      }else{
          setIsMobile(false)
      }
  }, [isResizing]);
  
  if(categories.length < 1 || location.pathname.split('/')[1] !== 'category'){
    return <></>
  }


  if(isMobile){
    return (
    <div className={classes.root}>
      <div position="static" className={classes.bgGrey + " cursor-pointer"} style={{borderRadius: "0 0 3px 3px"}} onClick={handleExpandClick}>
        <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon className="p-0 m-0"/>
        </IconButton>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div className={classes.mobNav}>
          
            {categories.map((category, index) => {
              return <NavLink to={"/category/" + category.name} className="category-nav__link" 
                style={{marginTop: "2px"}}
                key={index}>{category.title}</NavLink>
            })}
          </div>
        </Collapse>
      </div>
    </div>
    )
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.bgGrey}>
        <div className={classes.nav}>
        
          {categories.map((category, index) => {
            return <NavLink to={"/category/" + category.name} className="category-nav__link" key={index}>{category.title}</NavLink>
          })}
       
        </div>
      </AppBar>
    </div>
  );
}

