import { useSharedContext } from "../SharedContext"

export const login = async (credentials) => {
    const { user } = useSharedContext()
    const { token, temp_user } = {token: 'fgdsfgewvbn', temp_user: {name: 'Jacky'}}

    localStorage.setItem('token', token);
    setUser({...temp_user, isAuthenticated: 'true'})
}

export const logout = () => {
    localStorage.removeItem("token");
    setUser({ isAuthenticated: false, role: null, id: null, name: null });
}

