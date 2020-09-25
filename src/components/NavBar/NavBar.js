import './NavBar.css';
import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import useDark from "../../styles/useDark";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Badge, Drawer, Menu, MenuItem, Tooltip } from '@material-ui/core';
import { CLEAR_CART, CLEAR_ORDER, CLEAR_USER_DATA, LOGGED_OUT } from '../../constants/actions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    sideNav: {
        color: "white",
         backgroundColor: "dimgrey",
         height: "100%",
         padding: "2rem"
    }
}));
  
export default function NavBar() {
const classes = useStyles();
const darkStyle = useDark();
const dispatch = useDispatch();
const auth = useSelector(state => state.auth);
const user = useSelector(state => state.user);
const cart = useSelector(state => state.cart);
const [anchorEl, setAnchorEl] = useState(null);
const [isResizing, setIsResizing ]= useState(false);
const [isMobile, setIsMobile] = useState(false);
window.addEventListener('resize', () => {
    setIsResizing(window.innerWidth);

});

useEffect(() => {
    if(window.innerWidth < 768){
        setIsMobile(true)
    }else{
        setIsMobile(false)
    }
}, [isResizing])

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    window.localStorage.removeItem('happy-shop');
    dispatch({
        type: LOGGED_OUT
    });
    dispatch({
        type: CLEAR_USER_DATA
    })
    dispatch({
        type: CLEAR_CART
    })
    dispatch({
        type: CLEAR_ORDER
    })
  }
  const [state, setState] = useState(false);
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState(open);
  };

if(!auth.isLoggedIn){
    return (
    <div className={classes.root}>
        <AppBar position="static" className={darkStyle.bgDark}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/">
                        Happy Shop
                    </Link>
                </Typography>
                <div className="ml-auto flex-row align-items-center">
                    <Button color="inherit"><NavLink to="/login">Login</NavLink></Button>
                    <Button color="inherit"><NavLink to="/signup">Sign Up</NavLink></Button>
                </div>
            </Toolbar>
            
        </AppBar>
    </div>
    );
}

if(isMobile){
    return (
    <div className={classes.root}>
        <AppBar position="static" className={darkStyle.bgDark}>
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer("left", true)}>
                    <MenuIcon />
                </IconButton>
                <Drawer anchor={"left"} open={state} onClose={toggleDrawer("left", false)}>
                    <div  className={classes.sideNav}>
                        <div onClick={toggleDrawer("left", false)}
                                onKeyDown={toggleDrawer("left", false)}  className="mt-4">
                            {user.isSeller && 
                                <>
                                    <NavLink to={"/brand/" + user.brand}>
                                        <p>Your Shop</p>
                                    </NavLink>
                                    <NavLink to="/add-product">
                                        <p>Add Product</p>
                                    </NavLink>
                                </>
                                }
                                <NavLink to="/user">
                                        <p>Profile</p>
                                </NavLink>
                                <NavLink to="/orders">
                                        <p>Orders</p>
                                </NavLink>
                                <p  onClick={() => {
                                        logout()
                                        handleProfileClose()
                                    }} className="m-0 p-0 cursor-pointer">
                                    Logout
                                </p>
                        </div>
                    </div>
                </Drawer>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/">
                            Happy Shop
                    </Link>
                </Typography>
                <div className="ml-auto flex-row align-items-center">
                    <Tooltip title="Cart">
                        <Badge badgeContent={cart.items.length} color="secondary" className="nav-bar__link">
                            <NavLink to="/cart"> <ShoppingCartIcon /></NavLink>
                        </Badge>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    </div>
    );
}

    return (
    <div className={classes.root}>
        <AppBar position="static" className={darkStyle.bgDark}>
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    <Link to="/">
                            Happy Shop
                    </Link>
                </Typography>
                <div className="ml-auto flex-row align-items-center">
                    <Tooltip title="Cart">
                        <Badge badgeContent={cart.items.length} color="secondary" className="nav-bar__link">
                            <NavLink to="/cart"> <ShoppingCartIcon /></NavLink>
                        </Badge>
                    </Tooltip>
                    {user.isSeller && 
                            <NavLink to={"/brand/" + user.brand}>
                            <p className="nav-bar__link">Your Shop</p>
                            </NavLink>
                    }
            
                    <AccountCircleIcon className="cursor-pointer" aria-controls="profile" 
                        aria-haspopup="true" onClick={handleProfileClick} />
                    <Menu
                        className="menu"
                        id="profile-menu"
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        elevation={0}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleProfileClose}
                    >
                        <MenuItem onClick={handleProfileClose} ><Link to="/user">Profile</Link></MenuItem>
                        <MenuItem onClick={handleProfileClose} ><Link to="/orders" >Orders</Link></MenuItem>
                        {user.isSeller &&  
                        <MenuItem onClick={handleProfileClose}>
                            <Link to="/add-product">Add Product</Link>
                        </MenuItem>}
                        <MenuItem onClick={() => {
                        logout();
                            handleProfileClose()
                        }}>Logout</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    </div>
    );
}