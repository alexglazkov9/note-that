import { FETCH_NOTES_REQUEST, FETCH_NOTES_FAILURE, FETCH_NOTES_SUCCESS, CREATE_NOTE_SUCCESS, UPDATE_NOTE_SUCCESS } from '../actions/types';

const initialState = {
    isFetching: false,
    notes: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_NOTES_REQUEST:
            return Object.assign({}, state, {
                isFetching: true
            })
        case FETCH_NOTES_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                notes: action.notes,
                lastUpdated: action.receivedAt
            })
        case CREATE_NOTE_SUCCESS:
            return Object.assign({}, state, {
                notes: [ ...state.notes, action.note ]
            })
        case UPDATE_NOTE_SUCCESS:
            console.log(state.notes);
            console.log(action.note);
            return Object.assign({}, state, {
                notes: state.notes.map(note => note.id === action.note.id ? action.note : note)
            })
        default:
            return state;
    }
}