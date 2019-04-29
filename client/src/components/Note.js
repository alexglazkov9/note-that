import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { updateNote } from '../actions/noteprovider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Scrollbar from 'react-scrollbars-custom';
import InputBase from '@material-ui/core/InputBase';

const WAIT_INTERVAL = 300;

const ENTER_KEY = 13;

const styles = {
    card: {
        width: '100%',
        height: '100%',
        padding: 20
    },
    media: {
        // ⚠️ object-fit is not supported by IE 11.
        objectFit: 'cover',  
    },
    inputHeader: {
        fontSize: 30
    },
    inputBody: {
        overflowY: 'hidden'
    }
};

class Note extends Component {
    constructor(props){
        super(props);
        this.state = {
            header: '',
            body: ''
        }
        this.timer = null;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.triggerSave = this.triggerSave.bind(this);
    }

    componentDidMount(){

    }

    componentWillReceiveProps(nextProps){
        if(nextProps.note){
            this.setState({ ...nextProps.note })
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        return this.state !== nextState; 
    }

    handleInputChange(e) {
        clearTimeout(this.timer);
        
        this.setState({
            [e.target.name]: e.target.value
        });

        this.timer = setTimeout(this.triggerSave, WAIT_INTERVAL);
    }

    triggerSave() {
        const { header, body } = this.state;
        const { dispatch } = this.props;
        const note = { ...this.props.note, header: header, body: body };
        console.log('Saving');
        console.log(note);
        dispatch(updateNote(note));
    }

    render() {
        const { classes, note } = this.props;
        if(note === undefined){
            return (
                <Typography component="p">Select note to view it</Typography>
            )
        }
        return (
            <Paper className={classes.card}>
                <Typography gutterBottom variant="h5" component="h2">
                    <InputBase 
                        classes={{
                            input: classes.inputHeader
                        }}
                        name='header'
                        value={this.state.header}
                        placeholder='Untitled'
                        fullWidth={true}
                        onChange={this.handleInputChange}
                    />
                </Typography>
                <Scrollbar>
                    <InputBase 
                        classes={{
                            input: classes.inputBody
                        }}
                        name='body'
                        placeholder='Start typing here...'
                        value={this.state.body}
                        fullWidth={true}
                        multiline={true}
                        onChange={this.handleInputChange}
                    />
                </Scrollbar>
            </Paper>
        )
    }
}

Note.propTypes = {
    classes: PropTypes.object.isRequired,
    note: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default connect()(withStyles(styles)(Note));