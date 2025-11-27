import React from 'react'
import { Navigate } from 'react-router-dom'

function AuthChecker({ children }) {
    if (!localStorage.getItem("token")) {
        return <Navigate to="/login" replace />
    }
    return children
}

export default AuthChecker