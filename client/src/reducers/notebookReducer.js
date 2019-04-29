import { FETCH_NOTEBOOKS_REQUEST, FETCH_NOTEBOOKS_FAILURE, FETCH_NOTEBOOKS_SUCCESS, CREATE_NOTEBOOK_SUCCESS } from '../actions/types';

const initialState = {
    isFetching: false,
    notebooks: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_NOTEBOOKS_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            })
        case FETCH_NOTEBOOKS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                notebooks: action.notebooks,
                lastUpdated: action.receivedAt
            })
        case CREATE_NOTEBOOK_SUCCESS:
            return Object.assign({}, state, {
                notebooks: [ ...state.notebooks, action.notebook ]
            })
        default:
            return state;
    }
}