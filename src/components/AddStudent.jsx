import { useState, useEffect, useCallback } from 'react'
import {
  FormGroup,
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Box,
} from '@material-ui/core'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import * as Constants from './Constants'
import instructions from './../instructions.jpg'
import { useStyles } from './useStyles'
import { initialValue } from './initialValue'

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
        {
          headers: {
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        },
      )
      const data = await response.text()
      setSchoolName(data)
      // setIsSchoolEnabled(data !== 'School not found')
    }
    fetchData()
  }, [id])

  const {
    full_name,
    school_name,
    address,
    mobile_1,
    mobile_2,
    grno,
    standard,
    division,
    blood_group,
    date_of_birth,
    house,
    fathername,
    fathermobile,
    mothername,
    mothermobile,
  } = student
  const classes = useStyles()

  const onValueChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value })
  }

  const saveFile = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i
    if (!allowedExtensions.exec(file.name)) {
      alert('Invalid file type. Please upload an image file.')
      return
    }
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size exceeds the allowed limit of 5MB.')
      return
    }
    if (file.size < maxSize && allowedExtensions.exec(file.name)) {
      console.log('inside this')
      setFile(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    window.location.reload(false)
  }

  const uploadFile = async (e) => {
    const unique_id = uuid().slice(0, 8)
    if (date_of_birth === '') {
      alert('Please add Date of birth')
      return
    }
    if (file === undefined) {
      alert('Invalid file type. Please upload an image file.')
      return
    }
    const myNewFile = new File(
      [file],
      `${id}-${unique_id}.${file.name.split('.').pop()}`,
      {
        type: file.type,
      },
    )
    const formData = new FormData()
    formData.append(
      'school_name',
      schoolName !== 'School not found' ? schoolName : school_name,
    )
    formData.append('school_id', id)
    if (showField('full_name')) {
      formData.append('full_name', full_name.toUpperCase())
    }
    if (showField('mobile_1')) {
      formData.append('mobile_1', mobile_1)
    }
    if (showField('mobile_2')) {
      formData.append('mobile_2', mobile_2)
    }
    if (showField('address')) {
      formData.append('address', address.toUpperCase())
    }
    if (showField('grno')) {
      formData.append('grno', grno)
    }
    if (showField('standard')) {
      formData.append('standard', standard)
    }
    if (showField('division')) {
      formData.append('division', division)
    }
    if (showField('blood_group')) {
      formData.append('blood_group', blood_group)
    }
    if (showField('date_of_birth')) {
      formData.append(
        'date_of_birth',
        moment(date_of_birth).format('YYYY-MM-DD hh:mm:ss'),
      )
    }
    if (showField('house')) {
      formData.append('house', house)
    }
    formData.append('photo', myNewFile)
    formData.append('photo_name', myNewFile.name)

    // formData.append('fileName', fileName)
    try {
      await axios
        .post(`${Constants.REACT_APP_SERVER_URL}/api/student`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Security-Policy': 'upgrade-insecure-requests',
          },
        });
      setDialogOpen(true)
    } catch (ex) {
      console.log(ex)
    }
  }

  const showField = useCallback((fieldName) => {
    const hideFields = Constants.SCHOOL_HIDDEN_FIELDS[id] || [];
    return !hideFields.includes(fieldName);
  }, [id]);

  return (
    <>
      <div className={classes.formContainer}>
        <div className={classes.instructionImage}>
          <img
            className={classes.image}
            src={instructions}
            alt="instructions"
          ></img>
        </div>
        <div className={classes.root}>
          <FormGroup className={classes.container}>
            <Typography
              style={{ color: '#580029' }}
              variant="h3"
              align="center"
            >
              {schoolName.toUpperCase()}
            </Typography>
            <Typography
              style={{ color: 'darkblue' }}
              variant="h6"
              align="center"
            >
              Student Data
            </Typography>
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
            </FormControl>
            {showField('full_name') && <FormControl>
              <TextField
                required
                id="full_name"
                name="full_name"
                label="Name"
                value={full_name.toUpperCase()}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}

            {showField('date_of_birth') && <FormControl>
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
            </FormControl>}
            {showField('blood_group') && <FormControl>
              <TextField
                name="blood_group"
                value={blood_group}
                id="blood_group"
                label="Blood Group"
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('address') && <FormControl>
              <TextField
                required
                id="address"
                name="address"
                label="Address"
                value={address.toUpperCase()}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('mobile_1') && <FormControl>
              <TextField
                required
                id="mobile_1"
                name="mobile_1"
                label="Mobile 1"
                value={mobile_1}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('mobile_2') && <FormControl>
              <TextField
                id="mobile_2"
                name="mobile_2"
                label="Mobile 2"
                value={mobile_2}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('fathername') && <FormControl>
              <TextField
                id="fathername"
                name="fathername"
                label="Father Name"
                value={fathername}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('fathermobile') && <FormControl>
              <TextField
                id="fathermobile"
                name="fathermobile"
                label="Father Mobile"
                value={fathermobile}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('mothername') && <FormControl>
              <TextField
                id="mothername"
                name="mothername"
                label="Mother Name"
                value={mothername}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('mothermobile') && <FormControl>
              <TextField
                id="mothermobile"
                name="mothermobile"
                label="Mother Mobile"
                value={mothermobile}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}

            {showField('grno') && <FormControl>
              <TextField
                id="grno"
                name="grno"
                label="GR No."
                value={grno}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('division') && <FormControl>
              <InputLabel style={{ marginLeft: 14 }}>Standard</InputLabel>
              <Select
                required
                id="standard"
                label="Standard"
                name="standard"
                value={standard}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              >
                <MenuItem value={'Nursery'}>Nursery</MenuItem>
                <MenuItem value={'Jr. KG'}>Jr. KG</MenuItem>
                <MenuItem value={'Sr. KG'}>Sr. KG</MenuItem>
                <MenuItem value={'I'}>I</MenuItem>
                <MenuItem value={'II'}>II</MenuItem>
                <MenuItem value={'III'}>III</MenuItem>
                <MenuItem value={'IV'}>IV</MenuItem>
                <MenuItem value={'V'}>V</MenuItem>
                <MenuItem value={'VI'}>VI</MenuItem>
                <MenuItem value={'VII'}>VII</MenuItem>
                <MenuItem value={'VIII'}>VIII</MenuItem>
                <MenuItem value={'IX'}>IX</MenuItem>
                <MenuItem value={'X'}>X</MenuItem>
                <MenuItem value={'XI SCIENCE'}>XI SCIENCE</MenuItem>
                <MenuItem value={'XII SCIENCE'}>XII SCIENCE</MenuItem>
                <MenuItem value={'XI COMMERCE'}>XI COMMERCE</MenuItem>
                <MenuItem value={'XII COMMERCE'}>XII COMMERCE</MenuItem>
                <MenuItem value={'XI ARTS'}>XI ARTS</MenuItem>
                <MenuItem value={'XII ARTS'}>XII ARTS</MenuItem>
                <MenuItem value={'FYJC SCIENCE'}>FYJC SCIENCE</MenuItem>
                <MenuItem value={'SYJC SCIENCE'}>SYJC SCIENCE</MenuItem>
                <MenuItem value={'FYJC COMMERCE'}>FYJC COMMERCE</MenuItem>
                <MenuItem value={'SYJC COMMERCE'}>SYJC COMMERCE</MenuItem>
                <MenuItem value={'FYJC ARTS'}>FYJC ARTS</MenuItem>
                <MenuItem value={'SYJC ARTS'}>SYJC ARTS</MenuItem>
                <MenuItem value={'F.Y.BSc'}>F.Y.BSc</MenuItem>
                <MenuItem value={'S.Y.BSc'}>S.Y.BSc</MenuItem>
                <MenuItem value={'T.Y.BSc'}>T.Y.BSc</MenuItem>
                <MenuItem value={'F.Y.BCOM'}>F.Y.BCOM</MenuItem>
                <MenuItem value={'S.Y.BCOM'}>S.Y.BCOM</MenuItem>
                <MenuItem value={'T.Y.BCOM'}>T.Y.BCOM</MenuItem>
                <MenuItem value={'F.Y.BA'}>F.Y.BA</MenuItem>
                <MenuItem value={'S.Y.BA'}>S.Y.BA</MenuItem>
                <MenuItem value={'T.Y.BA'}>T.Y.BA</MenuItem>
                <MenuItem value={'B.Pharm Year 1'}>B.Pharm Year 1</MenuItem>
                <MenuItem value={'B.Pharm Year 2'}>B.Pharm Year 2</MenuItem>
                <MenuItem value={'B.Pharm Year 3'}>B.Pharm Year 3</MenuItem>
                <MenuItem value={'B.Pharm Year 4'}>B.Pharm Year 4</MenuItem>
                <MenuItem value={'M.Pharm Year 1'}>M.Pharm Year 1</MenuItem>
                <MenuItem value={'M.Pharm Year 2'}>M.Pharm Year 2</MenuItem>
              </Select>
            </FormControl>}
            {showField('division') && <FormControl>
              <TextField
                required
                id="division"
                name="division"
                label="Division"
                value={division}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('house') && <FormControl>
              <InputLabel style={{ marginLeft: 14 }}>House</InputLabel>
              <Select
                required
                id="house"
                label="House"
                name="house"
                value={house}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              >
                <MenuItem value={'Green'}>Green</MenuItem>
                <MenuItem value={'White'}>White</MenuItem>
                <MenuItem value={'Blue'}>Blue</MenuItem>
                <MenuItem value={'Red'}>Red</MenuItem>
                <MenuItem value={'Yellow'}>Yellow</MenuItem>
                <MenuItem value={'Pink'}>Pink</MenuItem>
                <MenuItem value={'Black'}>Black</MenuItem>
                <MenuItem value={'Purple'}>Purple</MenuItem>
              </Select>
            </FormControl>}
            {showField('file') && <FormControl>
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
              <Box m={1} >
                {
                  file && <img style={{ width: '200px', objectFit: 'contain' }} src={URL.createObjectURL(file)} alt='student-photo-id' />
                }
              </Box>
            </FormControl>}
            <FormControl>
              <Button variant="contained" color="primary" onClick={uploadFile}>
                Submit
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
      </div>
    </>
  )
}

export default AddUser