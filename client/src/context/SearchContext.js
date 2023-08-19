import { createContext, useEffect, useReducer } from "react"

const INITIAL_STATE = {
    city: null,
    date: JSON.parse(localStorage.getItem("date")) || null,
    options: {
        adult: null,
        child: null,
        room: null,
    }
}

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action)=>{
    switch(action.type){
        case "NEW_SEARCH":
            return action.payload;
        case "RESET_SEARCH":
            return INITIAL_STATE;
        default:
            return state;
    }
}

export const SearchContextProvider = ({children})=>{
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem("date", JSON.stringify(state.date));
    }, [state.date])

    return (
        <SearchContext.Provider value={{
            city: state.city,
            date: state.date,
            options: state.options,
            dispatch
        }}>
            {children}
        </SearchContext.Provider>
    );
}