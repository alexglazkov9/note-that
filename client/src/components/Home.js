import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchNotes, fetchNotebooks } from '../actions/noteprovider';

import Note from './Note';
import SideNotePanel from './SideNotePanel';
import SideNavigationPanel from './SideNavigationPanel';

const qs = require('query-string');

const styles = {
    main: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        height: '100vh'
    },
    noteRoot: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        overflowY: 'hidden'
    },
    fab: {
        margin: 10,
        float: 'right',
        position: 'absolute',
        bottom: 15,
        right: 15
    }
}

class Home extends Component{ 
    constructor(props){
        super(props);
    } 

    componentDidMount(){
        if(!this.props.auth.isAuthenticated) {
            this.props.history.push('/login');
        }
        const { dispatch } = this.props;
        dispatch(fetchNotes());
        dispatch(fetchNotebooks());
    }

    render(){
        console.log(this.props);
        const { classes, notes, notebooks } = this.props;
        const note_id = qs.parse(this.props.location.search).n;
        const notebook_id = qs.parse(this.props.location.search).nb;
        if(!notebook_id){

        }
        const note = notes.notes.find((note) => note.id == note_id);
        //const notes_to_display = notes.notes.filter(note => note.notebook_id === notebook_id);
        return(
            <div className={classes.main}>
                <SideNavigationPanel notebooks={notebooks} />
                <SideNotePanel notes={notes}/>
                <div className={classes.noteRoot}>
                    <Note note={note} />
                </div>
            </div>
        )
    }
}

Home.propTypes = {
    auth: PropTypes.object.isRequired,
    notes: PropTypes.object.isRequired,
    notebooks: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    notes: state.notes,
    notebooks: state.notebooks,
})

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Home)));