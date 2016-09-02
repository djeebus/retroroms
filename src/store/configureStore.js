import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import debounce from 'debounce';

export default (initialState) => {
    let store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(
            thunkMiddleware,
        ),
    );

    const saveState = debounce(() => {
        let state = store.getState();
        let jsonValue = JSON.stringify(state);

        localStorage.setItem('state', jsonValue);
    }, 1000);

    store.subscribe(() => {
        saveState();

        if (process.env.ENV === 'development') {
            console.log('state', store.getState());
        }
    });

    return store;
};
