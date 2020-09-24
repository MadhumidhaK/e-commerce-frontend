import { makeStyles } from '@material-ui/core/styles';

const useButtonStyles = () => {
    return  makeStyles((theme) => ({
        login: {
          backgroundColor: "green" ,
          color: "white",
          '&:hover': {
            backgroundColor: '#1b5e20',
            borderColor: '#0062cc',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            backgroundColor: '#1b5e20',
            borderColor: '#005cbf',
          },
        },
        orderBtn: {
          backgroundColor: "yellow" ,
          color: "black",
          '&:hover': {
            backgroundColor: '#eeee3b',
            borderColor: '#0062cc',
            boxShadow: 'none',
          },
          '&:active': {
            boxShadow: 'none',
            backgroundColor: '#eeee3b',
            borderColor: '#005cbf',
          },
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        title: {
          flexGrow: 1,
        },
      }))();
}


export default useButtonStyles;