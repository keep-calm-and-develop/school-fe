import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      border: '1px solid gray',
      borderRadius: '15px',
      padding: '8%',
    },
  },
  container: {
    width: '180%',
    marginRight: 90,
    '& > *': {
      marginTop: theme.spacing(1.2),
    },
    backgroundColor: '#f1fff6',
  },

  formContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  instructionImage: {
    marginRight: '20px',
  },
  image: {
    maxWidth: '500px',
  },
}));
