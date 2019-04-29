import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { List, ListItem, ListItemText } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, withRouter } from 'react-router-dom';
import { createNote } from '../actions/noteprovider';
import Scrollbar from 'react-scrollbars-custom';

const moment = require('moment');
const qs = require('query-string');

const styles = {
    sideNav: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: 200,
        borderRightColor: '#000000',
        borderRightWidth: 1,
        overflowY: 'hidden'
        
    },
    navListItem: {
        fontColor: '#ffffff',
        fontWeight: 'bold'
    },
    timestamp: {
        display: 'block'
    }
}

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

class SideNotePanel extends Component{
    constructor(props){
        super(props);
        this.createNewNote = this.createNewNote.bind(this);
    }

    componentDidMount(){
        
    }

    addParameter(location, id){
        const query = qs.parse(location.search);
        query.n = id;
        return qs.stringify(query);
    }

    createNewNote(notebook_id){
        const { dispatch } = this.props;
        dispatch(createNote(notebook_id));
    }

    render(){
        const { classes, location } = this.props;
        const { isFetching } = this.props.notes;
        if(isFetching){
            return (
                <div className={classes.sideNav}>
                    <CircularProgress />
                </div>
            )
        }
        const notebook_id = qs.parse(location.search).nb;
        
        if(notebook_id === 'all'){
            var notes = this.props.notes.notes;
        } else {
            var notes = this.props.notes.notes.filter(note => note.notebook_id == notebook_id);
        }
        const notesList = [];
        if(notes && notes.length > 0){
            notes.forEach(note => {
                notesList.push( <ListItemLink 
                                    key={note.id}
                                    className={classes.navListItem} 
                                    to={{ pathname: location.pathname,
                                          search: this.addParameter(location, note.id) 
                                        }}
                                    >
                                    <ListItemText 
                                        className={classes.navListItem} 
                                        primary={note.header}
                                        secondary={
                                            <React.Fragment>
                                                {note.body.substr(0,20) + '...'}
                                                <span className={classes.timestamp}>{moment(note.created_at).format('MMMM D LT')}</span>
                                            </React.Fragment>
                                            } />
                                </ListItemLink>
                                );
            });
        }
        return(
            <div className={classes.sideNav}>
                <Scrollbar>
                    <List>
                        <ListItem button className={classes.navListItem} key={'new_note'} onClick={() => this.createNewNote(notebook_id)}>
                            <ListItemText className={classes.navListItem} 
                                primary="+ New note" />
                        </ListItem>
                        {notesList}
                    </List>
                </Scrollbar>
            </div>
        )
    }
}

SideNotePanel.propTypes = {
    notes: PropTypes.object.isRequired
}

export default connect()(withStyles(styles)(withRouter(SideNotePanel)));
