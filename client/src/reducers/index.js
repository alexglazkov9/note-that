import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import noteReducer from './noteReducer';
import notebookReducer from './notebookReducer';
import { LOGOUT_USER } from '../actions/types';

const appReducer = combineReducers({
    errors: errorReducer,
    auth: authReducer,
    notes: noteReducer,
    notebooks: notebookReducer
});

export const rootReducer = (state, action) => {
    if(action.type === LOGOUT_USER) {
        state = undefined
    }

    return appReducer(state, action);
}