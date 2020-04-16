import React, { Component, useReducer, useContext } from "react";

const MyContext = React.createContext();
const MyProvider = MyContext.Provider;

function connect(mapStateToProps, mapDispatchToProps) {
    return function(Component) {
        return function() {
            const { state, dispatch } = useContext(MyContext);
            const stateToProps = mapStateToProps(state);
            const dispatchToProps = mapDispatchToProps(dispatch);
            const props = { ...stateToProps, ...dispatchToProps };

            return <Component {...props} />;
        };
    };
}

function FirstC(props) {
    return (
        <div>
            <h3>{props.books}</h3>
            <button onClick={() => props.dispatchAddBook("Dan Brown: Origin")}>
                Dispatch 'Origin'
			</button>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        books: state.Books
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatchAddBook: payload => dispatch({ type: "ADD_BOOK", payload })
    };
}

const HFirstC = connect(mapStateToProps, mapDispatchToProps)(FirstC);

function SecondC(props) {
    return (
        <div>
            <h3>{props.books}</h3>
            <button
                onClick={() =>
                    props.dispatchAddBook("Dan Brown: The Lost Symbol")
                }
            >
                Dispatch 'The Lost Symbol'
			</button>
        </div>
    );
}

function _mapStateToProps(state) {
    return {
        books: state.Books
    };
}

function _mapDispatchToProps(dispatch) {
    return {
        dispatchAddBook: payload => dispatch({ type: "ADD_BOOK", payload })
    };
}

const HSecondC = connect(_mapStateToProps, _mapDispatchToProps)(SecondC);

function App() {
    const initialState = {
        Books: "Dan Brown: Inferno"
    };

    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "ADD_BOOK":
                return { Books: action.payload };
            default:
                return state;
        }
    }, initialState);
    return (
        <div>
            <MyProvider value={{ state, dispatch }}>
                <HFirstC />
                <HSecondC />
            </MyProvider>
        </div>
    );
}

export default App;
