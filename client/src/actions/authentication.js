import axios from 'axios';
import setAuthToken from '../setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER, LOGOUT_USER } from './types';
import jwt_decode from 'jwt-decode';

export const registerUser = (user, history) => dispatch => {
    axios.post('/auth/signup', user)
            .then(res => history.push('/login'))
            .catch(err => {
                dispatch({
                    type: GET_ERRORS,
                    paload: err.response.data
                });
            });
}

export const loginUser = (user, history) => dispatch => {
    axios.post('/auth/login', user)
            .then(res => {
                const { access_token } = res.data;
                localStorage.setItem('access_token', access_token);
                setAuthToken(access_token)
                const decoded = jwt_decode(access_token);
                dispatch(setCurrentUser(decoded));
                history.push('/');
            });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

const requestLogoutUser = () => {
    return {
        type: LOGOUT_USER
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('access_token');
    setAuthToken(false);
    dispatch(requestLogoutUser());
    console.log('got here');
    if(history)
        history.push('/login');
}