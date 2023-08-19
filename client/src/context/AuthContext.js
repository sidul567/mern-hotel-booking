import { createContext, useReducer } from "react"

const INITIAL_STATE = {
    user: null,
    loading: null,
    authLoading: null,
    error: null,
    loadUserError: null,
}

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action)=>{
    switch(action.type){
        case "LOGIN_REQUEST":
        case "REGISTRATION_REQUEST":
            return {
                ...state,
                authLoading: true,
                error: null,
            }
        case "LOAD_USER_REQUEST":
            return {
                ...state,
                loading: true,
                loadUserError: null,
            }
        case "LOGIN_SUCCESS":
        case "REGISTRATION_SUCCESS":
            return {
                user: action.payload,
                authLoading: false,
                error: null,
            }
        case "LOAD_USER_SUCCESS":
            return {
                user: action.payload,
                loading: false,
                loadUserError: null,
            }
        case "LOGIN_FAIL":
        case "REGISTRATION_FAIL":
            return {
                ...state,
                error: action.payload,
                authLoading: false,
            }
        case "LOAD_USER_FAIL":
            return {
                ...state,
                loadUserError: action.payload,
                loading: false,
            }
        case "LOGOUT":
            return {
                user: null,
                loading: false,
                authLoading: false,
                error: null
            }
        default:
            return state;
    }
}

export const AuthContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            loading: state.loading,
            authLoading: state.authLoading,
            loadUserError: state.loadUserError,
            error: state.error,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    );
}