import { Routes, Route, Navigate } from 'react-router-dom'

import Login from '../features/auth/pages/Login'
import Dashboard from '../features/dashboard/pages/Dashboard'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    )
}

export default AppRoutes