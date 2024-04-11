import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  makeStyles,
} from '@material-ui/core'
import * as Constants from './Constants'

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  searchInput: {
    marginRight: theme.spacing(2),
  },
  searchButton: {
    height: '100%',
  },
  noStudentsMessage: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  selectPaper: {
    width: '150px', // Adjust the width as per your requirement
  },
  selectList: {
    paddingTop: '4px', // Adjust the padding as per your requirement
    paddingBottom: '4px',
  },
}))

const standardOptions = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI SCIENCE',
  'XII SCIENCE',
  'XI COMMERCE',
  'XI ARTS',
  'XII ARTS',
  'FYJC SCIENCE',
  'SYJC SCIENCE',
  'FYJC COMMERCE',
  'SYJC COMMERCE',
  'FYJC ARTS',
  'SYJC ARTS',
  'F.Y.BSc',
  'S.Y.BSc',
  'T.Y.BSc',
  'F.Y.BCOM',
  'S.Y.BCOM',
  'T.Y.BCOM',
  'F.Y.BA',
  'S.Y.BA',
  'T.Y.BA',
]

const Reports = () => {
  const classes = useStyles()
  const [students, setStudents] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    name: '',
    mobile1: '',
    standard: 'All Standards',
  })
  const { id } = useParams()
  const schoolId = id

  useEffect(() => {
    fetchStudents()
  }, [currentPage])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const fetchStudents = async () => {
    try {
      const params = {
        schoolId,
        page: currentPage,
        ...filters,
      }
      if (filters.standard === 'All Standards') {
        params.standard = '' // Send empty string if 'All Standards' is selected
      }
      const response = await axios.get(
        `${Constants.REACT_APP_SERVER_URL}/api/school/reports`,
        {
          params,
        },
      )

      const { students, totalPages } = response.data
      setStudents(students)
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchStudents()
  }

  return (
    <div>
      <div className={classes.searchContainer}>
        <TextField
          label="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          variant="outlined"
          className={classes.searchInput}
        />
        <TextField
          label="Mobile Number"
          value={filters.mobile1}
          onChange={(e) => setFilters({ ...filters, mobile1: e.target.value })}
          variant="outlined"
          className={classes.searchInput}
        />
        <Select
          value={filters.standard}
          onChange={(e) => setFilters({ ...filters, standard: e.target.value })}
          variant="outlined"
          className={classes.searchInput}
          classes={{
            paper: classes.selectPaper,
            list: classes.selectList,
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            getContentAnchorEl: null,
          }}
        >
          <MenuItem value="All Standards">
            <em>All Standards</em>
          </MenuItem>
          {standardOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          className={classes.searchButton}
        >
          Search
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Parent's Number </TableCell>
              <TableCell>Address</TableCell>
              <TableCell>GR No</TableCell>
              <TableCell>Standard</TableCell>
              <TableCell>Division</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Blood Group</TableCell>
              <TableCell>Date Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.id}</TableCell>
                <TableCell>{student.full_name}</TableCell>
                <TableCell>{student.school_name}</TableCell>
                <TableCell>{student.mobile_1}</TableCell>
                <TableCell>{student.mobile_2}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>{student.grno}</TableCell>
                <TableCell>{student.standard}</TableCell>
                <TableCell>{student.division}</TableCell>
                <TableCell>{formatDate(student.date_of_birth)}</TableCell>
                <TableCell>
                  {student.photo_name && (
                    <img
                      src={student.photo_name}
                      alt={student.full_name}
                      style={{ width: '80px' }}
                    />
                  )}
                </TableCell>
                <TableCell>{student.blood_group}</TableCell>
                <TableCell>{formatDate(student.date_time)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {students.length === 0 && (
        <p className={classes.noStudentsMessage}>No students found.</p>
      )}
      {totalPages > 1 && (
        <div>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ),
          )}
        </div>
      )}
    </div>
  )
}

export default Reports
