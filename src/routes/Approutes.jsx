import { Routes, Route, Navigate } from 'react-router-dom'

import Login from '../features/auth/pages/Login'
import Dashboard from '../features/dashboard/pages/Dashboard'
import NotFound from '../features/not-found/pages/NotFound'
import SuratJalan from '../features/surat-jalan/pages/SuratJalan'
import ProtectedRoute from './ProtectedRoutes'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/surat-jalan" element={<SuratJalan />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes