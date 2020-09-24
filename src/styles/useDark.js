import { makeStyles } from '@material-ui/core/styles';

const useDark = () => {
    return  makeStyles((theme) => ({
        bgDark: {
          backgroundColor: "black" ,
          color: "white"
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        title: {
          flexGrow: 1,
        },
      }))();
}


export default useDark;