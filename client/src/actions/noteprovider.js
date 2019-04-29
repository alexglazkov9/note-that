import axios from 'axios';
import { 
    FETCH_NOTES_SUCCESS, 
    FETCH_NOTES_REQUEST, 
    FETCH_NOTES_FAILURE, 
    FETCH_NOTEBOOKS_SUCCESS, 
    FETCH_NOTEBOOKS_REQUEST, 
    FETCH_NOTEBOOKS_FAILURE,
    CREATE_NOTE_REQUEST,
    CREATE_NOTE_FAILURE,
    CREATE_NOTE_SUCCESS,
    UPDATE_NOTE_REQUEST,
    UPDATE_NOTE_FAILURE,
    UPDATE_NOTE_SUCCESS,
    CREATE_NOTEBOOK_REQUEST,
    CREATE_NOTEBOOK_FAILURE,
    CREATE_NOTEBOOK_SUCCESS
} from './types';


const requestNotes = () => {
    return {
        type: FETCH_NOTES_REQUEST
    }
}

const receiveNotes = (data) => {
    return {
        type: FETCH_NOTES_SUCCESS,
        notes: data.data,
        receivedAt: Date.now()
    }
}

export const fetchNotes = () => {
    return dispatch => {
        dispatch(requestNotes());
        return axios.get('/note')
            .then(res => dispatch(receiveNotes(res.data)));
    }
}

const requestNotebooks = () => {
    return {
        type: FETCH_NOTEBOOKS_REQUEST
    }
}

const receiveNotebooks = (data) => {
    return {
        type: FETCH_NOTEBOOKS_SUCCESS,
        notebooks: data.data,
        receivedAt: Date.now()
    }
}

export const fetchNotebooks = () => {
    return dispatch => {
        dispatch(requestNotebooks());
        return axios.get('/notebook')
            .then(res => dispatch(receiveNotebooks(res.data)));
    }
    
}

const requestNewNotebook = () => {
    return {
        type: CREATE_NOTEBOOK_REQUEST
    }
}

const receiveNewNotebook = (data) => {
    console.log(data.data);
    return {
        type: CREATE_NOTEBOOK_SUCCESS,
        notebook: data.data,
        receivedAt: Date.now()
    }
}

export const createNotebook = (title) => {
    return dispatch => {
        dispatch(requestNewNotebook());
        return axios.post('/notebook', { title: title })
            .then(res => dispatch(receiveNewNotebook(res.data)));
    }
}

const requestNewNote = () => {
    return {
        type: CREATE_NOTE_REQUEST
    }
}

const receiveNewNote = (data) => {
    console.log(data.data);
    return {
        type: CREATE_NOTE_SUCCESS,
        note: data.data,
        receivedAt: Date.now()
    }
}

export const createNote = (notebook_id) => {
    return dispatch => {
        dispatch(requestNewNote());
        return axios.get('/note/new/' + notebook_id)
            .then(res => dispatch(receiveNewNote(res.data)));
    }
}

const requestNoteUpdate = () => {
    return {
        type: UPDATE_NOTE_REQUEST
    }
}

const receiveUpdatedNote = (data) => {
    return {
        type: UPDATE_NOTE_SUCCESS,
        note: data.data,
        receivedAt: Date.now()
    }
}

export const updateNote = (note) => {
    return dispatch => {
        dispatch(requestNoteUpdate());
        return axios.put('/note/' + note.id, note)
            .then(res => dispatch(receiveUpdatedNote(res.data)));
    }
}

export const savePost = (post, history) => dispatch => {
    axios.post('/note', post).then(res => console.log(res)).catch(err => console.log(err));
    history.push('/');
}