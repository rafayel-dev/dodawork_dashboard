import React from 'react'
import { Navigate } from 'react-router-dom'

function AuthChecker({ children }) {
    if (!localStorage.getItem("accessToken")) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default AuthChecker