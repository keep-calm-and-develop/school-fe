import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import SchoolForm from './components/AddSchool'
import AddUser from './components/AddStudent'

import Login from './components/Login'

const MyApp = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/school/:id" element={<AddUser />} />
          <Route path="/school" element={<SchoolForm />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  )
}

export default MyApp
