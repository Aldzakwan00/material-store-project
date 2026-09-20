import React from 'react'
import Sidebar from '../../../components/layout/Sidebar'

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the Dashboard!</p>
      </div>
    </div>
  )
}

export default Dashboard
