import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import debounce from 'debounce';


function loadState() {
    const jsonState = localStorage.getItem('state');
    return JSON.parse(jsonState);
}


const saveState = debounce((store) => {
    let state = store.getState();
    let jsonValue = JSON.stringify(state);

    localStorage.setItem('state', jsonValue);
}, 1000);


export default (debug) => {
    const initialState = loadState();
    if (debug) {
        console.log('state', initialState);
    }
 
    let store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            thunkMiddleware,
        ),
    );

    store.subscribe(() => {
        saveState(store);

        if (debug) {
            console.log('state', store.getState());
        }
    });

    return store;
};
