import { makeStyles } from '@material-ui/core/styles';


const useFormStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '80%',
        maxWidth: "360px",
        marginTop: "3rem"
      },
      green: {
          color: "green",
          backgroundColor: "orange"
      },
    },
  }));

export default useFormStyles;