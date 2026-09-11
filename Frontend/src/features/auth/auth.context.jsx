import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context.js"
import { getMe, login, logout, register } from "./services/auth.api"


export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authError, setAuthError] = useState("")

    useEffect(() => {
        getMe()
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false))
    }, [])

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        setAuthError("")
        try {
            const data = await login({ email, password })
            setUser(data.user)
        } catch (err) {
            console.error(err)
            setAuthError(err.response?.data?.message || "Unable to log in")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }


    return (
        <AuthContext.Provider value={{ user, loading, authError, handleLogin, handleRegister, handleLogout }} >
            {children}
        </AuthContext.Provider>
    )

    
}