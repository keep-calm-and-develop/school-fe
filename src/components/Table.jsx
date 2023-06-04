import React, { useState } from 'react'
import * as Constants from './Constants'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const TableComponent = ({ data }) => {
  const [modal, setModal] = useState(false)
  const [res, setRes] = useState({})
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const fetchZip = async (school) => {
    await axios
      .get(
        `${Constants.REACT_APP_SERVER_URL}/api/all-photos?school=${school}`,
        { responseType: 'blob' },
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })

        const filename = `${school}.zip`

        // Create a download link with the filename and click it
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        link.click()
      })
      .catch((error) => {
        console.error('Error downloading file:', error)
        setModal(true)
      })
  }
  const fetchData = async (school) => {
    await axios
      .get(
        `${Constants.REACT_APP_SERVER_URL}/api/data-download?school=${school}`,
        { responseType: 'blob' },
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        })

        const filename = `${school}.xlsx`

        // Create a download link with the filename and click it
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = filename
        link.click()
      })
      .catch((error) => {
        console.error('Error downloading file:', error)
        setModal(true)
      })
  }
  const deleteData = async (school) => {
    await axios
      .delete(
        `${Constants.REACT_APP_SERVER_URL}/api/data-delete?school=${school}`,
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      .then((response) => {
        setMessage(response.data.message)
        setModal(true)
        // const blob = new Blob([response.data], {
        //   type: response.headers['content-type'],
        // })
      })
      .catch((error) => {
        console.error('Error downloading file:', error)
        setModal(true)
      })
  }
  const deletePhotos = async (school) => {
    console.log(school)
    await axios
      .delete(
        `${Constants.REACT_APP_SERVER_URL}/api/photos-delete?school=${school}`,
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      .then((response) => {
        setMessage(response.data.message)
        setModal(true)
        // const blob = new Blob([response.data], {
        //   type: response.headers['content-type'],
        // })
      })
      .catch((error) => {
        console.error('Error deleting file:', error)
        setModal(true)
      })
  }
  const showReports = (id) => {
    navigate(`/school/reports/${id}`)
  }
  const handleCloseModal = () => {
    setModal(false)
    window.location.reload(false)
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Reports</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell style={{ width: '200px' }}>{row.name}</TableCell>
                <TableCell>
                  <a href={`${Constants.REACT_APP_DOMAIN_URL}` + row.id}>
                    {`${Constants.REACT_APP_DOMAIN_URL}` + row.id}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="column">
                    <div className="row">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          fetchData(row.id)
                        }}
                        style={{ margin: '10px' }}
                      >
                        Download Excel
                      </Button>{' '}
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '10px' }}
                        onClick={() => {
                          fetchZip(row.id)
                        }}
                      >
                        Download Photos
                      </Button>
                    </div>
                    <div className="row">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          deleteData(row.id)
                        }}
                        style={{ margin: '10px' }}
                      >
                        Delete All Data
                      </Button>{' '}
                      <Button
                        variant="contained"
                        color="secondary"
                        style={{ margin: '10px' }}
                        onClick={() => {
                          deletePhotos(row.id)
                        }}
                      >
                        Delete Photos
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ margin: '10px' }}
                    onClick={() => {
                      showReports(row.id)
                    }}
                  >
                    Show Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <>
        <>
          <Dialog open={modal} onClose={handleCloseModal}>
            <br />
            <div style={{ margin: '20px' }}>
              <Typography variant="h3" align="center">
                {'Oops!'}
              </Typography>
              <br />
              <div>
                <Typography
                  style={{ color: '#b50000' }}
                  variant="h6"
                  align="center"
                >
                  {message === '' ? 'No school data found' : message}
                </Typography>
              </div>
              <br />
              <DialogContent>
                <Typography variant="h5" align="center">
                  {res.error}
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
    </>
  )
}

export default TableComponent
