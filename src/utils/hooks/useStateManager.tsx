import {createContext, useContext, useReducer, ReactNode, Dispatch} from 'react';

// define the structure of the application state
type State = {
    planetsList: any[];
};

// define the action types for the reducer
type Action = { type: 'SET_PLANETS_LIST'; payload: any[] };

// initial state of the application
const initialState: State = {
    planetsList: [],
};

// handle state changes based on action type
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_PLANETS_LIST':
            return { ...state, planetsList: action.payload };
        default:
            return state;
    }
};

// create a context to provide state and dispatch function to the component tree
const StateContext = createContext<{
    state: State;
    dispatch: Dispatch<Action>;
}>({
    state: initialState,
    dispatch: () => null,
});

// provider component to wrap the application and provide state context
export const StateProvider = ({ children }: { children: ReactNode }) => {
    // Use useReducer to manage the application state
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <StateContext.Provider value={{ state, dispatch }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
