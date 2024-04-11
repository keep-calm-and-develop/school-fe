import React, { useState, useEffect } from 'react'
import axios from 'axios'

import {
  Button,
  makeStyles,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import './../index.css'
import { useNavigate } from 'react-router-dom'
import TableComponent from './Table'
import * as Constants from './Constants'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
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
    maxWidth: '900px',
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

function SchoolForm() {
  const classes = useStyles()
  const [name, setName] = useState('')
  const [res, setRes] = useState({})
  const [modal, setModal] = useState(false)
  const [data, setData] = useState([])

  const navigate = useNavigate()
  useEffect(() => {
    const token = sessionStorage.getItem('token')
    fetchData()

    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `${Constants.REACT_APP_SERVER_URL}/api/school-data`,
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      setData(result.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCloseModal = () => {
    setModal(false)
  }
  const handleSubmit = (event) => {
    event.preventDefault()

    axios
      .post(
        `${Constants.REACT_APP_SERVER_URL}/api/school`,
        { name },
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      .then((response) => {
        setRes(response.data)
        setName('')
        setModal(true)
        fetchData()
      })
      .catch((error) => {
        setRes(error.response.data)
        setName('')
        setModal(true)
      })
  }

  return (
    <>
      <div className={classes.paper}>
        <Typography variant="h4" align="center">
          Add Your School
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="school_name"
            label="School Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {' '}
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    Add School
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>
        <br />
        <Typography variant="h4" align="center">
          School List
        </Typography>
        <>
          <>
            <Dialog open={modal} onClose={handleCloseModal}>
              <br />
              <div style={{ margin: '20px' }}>
                <Typography variant="h3" align="center">
                  {res.success ? 'Successfully added school' : 'Oops!'}
                </Typography>
                <br />
                <div>
                  <Typography
                    style={{ color: '#b50000' }}
                    variant="h6"
                    align="center"
                  >
                    {res.success
                      ? 'please make note of the below url.'
                      : 'please check school name'}
                  </Typography>
                </div>
                <br />
                <DialogContent>
                  <Typography variant="h5" align="center">
                    {res.success === true
                      ? `${window.location}/${res.school.id}`
                      : res.error}
                  </Typography>
                </DialogContent>
                <br />
                <DialogActions>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </DialogActions>
              </div>
            </Dialog>
          </>
        </>
        <div className={classes.root}>
          <TableComponent data={data} />
        </div>
      </div>
    </>
  )
}

export default SchoolForm
