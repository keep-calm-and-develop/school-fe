import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import SchoolForm from './components/AddSchool'
import AddUser from './components/AddStudent'

import Login from './components/Login'
import Reports from './components/Reports'

const MyApp = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/school/:id" element={<AddUser />} />
          <Route path="/school" element={<SchoolForm />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/school/reports/:id" element={<Reports />}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default MyApp
