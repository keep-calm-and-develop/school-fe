import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as Constants from './Constants'
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  makeStyles,
  Container,
} from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  button: {
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const Login = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [passwd, setPasswd] = useState('')
  const [error, setError] = useState('')
  //   const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${Constants.REACT_APP_SERVER_URL}/api/login`,
        {
          username,
          passwd,
        },
      )
      localStorage.setItem('token', response.data.token)
      navigate('/school')
    } catch (error) {
      setError('Invalid username or password')
    }
  }

  return (
    <>
      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={passwd}
                onChange={(event) => setPasswd(event.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <p style={{ textAlign: 'center', color: 'red' }}>
                {error ? error : ''}
              </p>
            </form>
          </div>
          <Box mt={8}>
            <Typography variant="body2" color="textSecondary" align="center">
              {'© '}
              {new Date().getFullYear()}
              {' Your Website'}
            </Typography>
          </Box>
        </Container>
      </>
    </>
  )
}

export default Login
