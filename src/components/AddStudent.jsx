import { useState, useEffect, useCallback } from 'react'
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
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { LoadingButton } from './LoadingButton'

const initialValue = {
  photo: null,
  photo_name: '',
  full_name: '',
  school_name: '',
  address: '',
  mobile_1: '',
  mobile_2: '',
  grno: '',
  standard: '',
  division: '',
  blood_group: '',
  date_of_birth: '',
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
      try {
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
      } catch (error) {
        console.error(error)
      }
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
    rollno,
    designation,
    date_of_joining,
    department,
    emp_code,
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
      setFile(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
    window.location.reload(false)
  }, []);

  const uploadFile = async (e) => {
    if (showField('file') && file === undefined) {
      alert('Invalid file type. Please upload an image file.')
      return
    }
    let myNewFileName = '';
    try {
      if (showField('date_of_birth') && date_of_birth === '') {
        alert('Please add Date of birth')
        return
      }
      if (showField('full_name') && full_name === '') {
        alert('Please add Full Name')
        return
      }
      if (showField('mobile_1') && mobile_1 === '') {
        alert('Please add Mobile')
        return
      }
      if (showField('address') && address === '') {
        alert('Please add Address')
        return
      }
      if (showField('division') && division === '') {
        alert('Please add Division')
        return
      }

      const requestObj = {
        full_name: full_name.toUpperCase(),
        school_name: schoolName !== 'School not found' ? schoolName : school_name,
        mobile_1,
        mobile_2,
        address: address.toUpperCase(),
        grno,
        standard,
        division,
        school_id: id,
        blood_group,
        date_of_birth: moment(date_of_birth).format('YYYY-MM-DD hh:mm:ss'),
        house,
        fathername,
        fathermobile,
        mothername,
        mothermobile,
        rollno,
        designation,
        date_of_joining,
        department,
        emp_code,
      };

      if (showField('file')) {
        const unique_id = uuid().slice(0, 8)
        const myNewFile = new File(
          [file],
          `${id}-${unique_id}.${file.name.split('.').pop()}`,
          {
            type: file.type,
          },
        )
        const storage = getStorage();
        const storageRef = ref(storage, `/${id}/${myNewFile.name}`);
        const { ref: imageRef } = await uploadBytes(storageRef, myNewFile)
        const downloadURL = await getDownloadURL(imageRef);
        requestObj.photo_name = downloadURL;
        requestObj.fileName = fileName;
        myNewFileName = myNewFile.name;
      }
      await axios.post(`${Constants.REACT_APP_SERVER_URL}/api/student`, requestObj)
      setDialogOpen(true)
    } catch (error) {
      if (showField('file')) {
        const storage = getStorage();
        const imageRef = ref(storage, `/${id}/${myNewFileName}`);
        await deleteObject(imageRef)
      }
      console.error(error)
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
            {showField('standard') && <FormControl>
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
                id="division"
                name="division"
                label="Division"
                value={division}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('rollno') && <FormControl>
              <TextField
                id="rollno"
                name="rollno"
                label="Roll No."
                value={rollno}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('house') && <FormControl>
              <InputLabel style={{ marginLeft: 14 }}>House</InputLabel>
              <Select
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
            {showField('designation') && <FormControl>
              <TextField
                id="designation"
                name="designation"
                label="Designation"
                value={designation}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('date_of_joining') && <FormControl>
              <TextField
                id="date_of_joining"
                name="date_of_joining"
                type="date"
                label="Date of Joining"
                InputLabelProps={{
                  shrink: true,
                }}
                value={date_of_joining}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('department') && <FormControl>
              <TextField
                id="department"
                name="department"
                label="Department"
                value={department}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('emp_code') && <FormControl>
              <TextField
                id="emp_code"
                name="emp_code"
                label="Employee No."
                value={emp_code}
                onChange={(e) => onValueChange(e)}
                variant="outlined"
              />
            </FormControl>}
            {showField('file') &&
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
                <Box m={1} >
                  {
                    file && <img style={{ width: '200px', objectFit: 'contain' }} src={URL.createObjectURL(file)} alt='id' />
                  }
                </Box>
              </FormControl>}
            <FormControl>
              <LoadingButton variant="contained" color="primary" onClick={uploadFile}>
                Submit
              </LoadingButton>
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