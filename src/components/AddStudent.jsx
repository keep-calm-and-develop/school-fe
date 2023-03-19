import { useState, useEffect } from 'react'
import {
  FormGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  makeStyles,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import * as Constants from './Constants'
const initialValue = {
  photo: null,
  photo_name: '',
  full_name: '',
  school_name: '',
  address: '',
  mobile_1: '',
  mobile_2: '',
  city: '',
  standard: '',
  division: '',
  blood_group: '',
  date_of_birth: '2012-01-01',
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      border: '1px solid gray',
      borderRadius: '15px',
      padding: '8%',
    },
  },
  container: {
    width: '100%',
    margin: 0,
    '& > *': {
      marginTop: 20,
    },
  },
  input: {
    borderRadius: 10,
    border: '2px solid gray',
    padding: '10px 12px',
    backgroundColor: '#bd1313',
  },
}))

const AddUser = () => {
  const [student, setStudent] = useState(initialValue)
  const [file, setFile] = useState()
  const [fileName, setFileName] = useState('')
  const { id } = useParams()
  const [schoolName, setSchoolName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `${Constants.REACT_APP_SERVER_URL}/api/${id}`,
      )
      const data = await response.text()
      setSchoolName(data)
      // setIsSchoolEnabled(data !== 'School not found')
    }
    fetchData()
  }, [id])

  const {
    photo,
    photo_name,
    full_name,
    school_name,
    address,
    mobile_1,
    mobile_2,
    city,
    standard,
    division,
    blood_group,
    date_of_birth,
  } = student
  const classes = useStyles()

  const onValueChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value })
  }

  const saveFile = (e) => {
    setFile(e.target.files[0])
    setFileName(e.target.files[0].name)
  }
  const handleDialogClose = () => {
    setDialogOpen(false)
    window.location.reload(false)
  }

  const uploadFile = async (e) => {
    const unique_id = uuid().slice(0, 8)

    const myNewFile = new File(
      [file],
      `${schoolName}-${unique_id}.${file.name.split('.').pop()}`,
      {
        type: file.type,
      },
    )
    const formData = new FormData()
    formData.append('full_name', full_name)
    formData.append(
      'school_name',
      schoolName !== 'School not found' ? schoolName : school_name,
    )
    formData.append('mobile_1', mobile_1)
    formData.append('mobile_2', mobile_2)
    formData.append('address', address)
    formData.append('city', city)
    formData.append('standard', standard)
    formData.append('division', division)
    formData.append('school_id', id)
    formData.append('blood_group', blood_group)
    formData.append(
      'date_of_birth',
      moment(date_of_birth).format('YYYY-MM-DD hh:mm:ss'),
    )
    formData.append('photo', myNewFile)
    formData.append('photo_name', myNewFile.name)

    // formData.append('fileName', fileName)
    try {
      const res = await axios
        .post(`${Constants.REACT_APP_SERVER_URL}/api/student`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          setDialogOpen(true)
        })
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <>
      <div
        style={{ backgroundColor: '#f1fff6', borderRadius: '15px' }}
        className={classes.root}
      >
        <FormGroup className={classes.container}>
          <Typography style={{ color: '#580029' }} variant="h3" align="center">
            {schoolName.toUpperCase()}
          </Typography>
          <Typography style={{ color: 'darkblue' }} variant="h6" align="center">
            Add Student Data
          </Typography>

          <FormControl>
            <TextField
              required
              id="full_name"
              name="full_name"
              label="Name"
              value={full_name}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="full_name">Full Name</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="full_name"
            value={full_name}
            id="full_name"
            required={true}
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              name="school_name"
              value={
                schoolName !== 'School not found' ? schoolName : school_name
              }
              disabled={schoolName !== 'School not found'}
              id="school_name"
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">School Name</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="school_name"
            value={schoolName !== 'School not found' ? schoolName : school_name}
            disabled={schoolName !== 'School not found'}
            id="my-input"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              id="date_of_birth"
              name="date_of_birth"
              label="Date of Birth"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              value={date_of_birth}
              onChange={onValueChange}
            />

            {/* <InputLabel htmlFor="my-date">Date of Birth</InputLabel> */}
            {/* <TextField
            label="Date of Birth"
            type="date"
            onChange={onValueChange}
            name="date_of_birth"
            InputLabelProps={{ shrink: true }}
            value={date_of_birth}
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              name="blood_group"
              value={blood_group}
              id="blood_group"
              label="Blood Group"
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">Blood Group</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="blood_group"
            value={blood_group}
            id="my-input"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              id="address"
              name="address"
              label="Address"
              value={address}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">Address</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="address"
            value={address}
            id="address"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              id="mobile_1"
              name="mobile_1"
              label="Mobile 1"
              value={mobile_1}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">Mobile 1</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="mobile_1"
            value={mobile_1}
            id="my-input"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              id="mobile_2"
              name="mobile_2"
              label="Mobile 2"
              value={mobile_2}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">Mobile 2</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="mobile_2"
            value={mobile_2}
            id="mobile_2"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              id="city"
              name="city"
              label="City"
              value={city}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">City</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="city"
            value={city}
            id="my-input"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              id="standard"
              name="standard"
              label="Standard"
              value={standard}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">Standard</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="standard"
            value={standard}
            id="standard"
          /> */}
          </FormControl>
          <FormControl>
            <TextField
              required
              id="division"
              name="division"
              label="division"
              value={division}
              onChange={(e) => onValueChange(e)}
              variant="outlined"
            />
            {/* <InputLabel htmlFor="my-input">Division</InputLabel>
          <OutlinedInput
            onChange={(e) => onValueChange(e)}
            name="division"
            value={division}
            id="my-input"
          /> */}
          </FormControl>
          <FormControl>
            <InputLabel shrink htmlFor="upload-file">
              Upload file
            </InputLabel>
            <br />
            <OutlinedInput
              required
              type="file"
              name="file"
              id="upload-file"
              onChange={saveFile}
              accept="image/*"
              variant="outlined"
            />
            {/* <TextField
            type="file"
            label="Upload Image"
            InputLabelProps={{ shrink: true }}
            onChange={saveFile}
            accept="image/*"
            value={photo}
          /> */}
          </FormControl>
          <FormControl>
            <Button variant="contained" color="primary" onClick={uploadFile}>
              Add User
            </Button>
          </FormControl>
        </FormGroup>
        <>
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <br />
            <Typography variant="h4" align="center">
              {dialogOpen ? 'Thank you' : 'Oops!'}
            </Typography>
            <br />
            <DialogContent>
              {dialogOpen
                ? 'Successfully Added Students Data!'
                : 'Failed to Add Students Data!'}
            </DialogContent>
            <br />
            <DialogActions>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDialogClose}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      </div>
    </>
  )
}

export default AddUser
