import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createNotebook } from '../actions/noteprovider';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link, withRouter } from 'react-router-dom';
import Scrollbar from 'react-scrollbars-custom';

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
    }
}

function ListItemLink(props) {
    return <ListItem button component={Link} {...props} />;
}

class SideNavigationPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            newNBDialogOpen: false,
            title: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClickOpen = () => {
        this.setState({ newNBDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ newNBDialogOpen: false });
    }

    addParameter(location, id){
        const query = qs.parse(location.search);
        query.nb = id;
        query.n = undefined;
        return qs.stringify(query);
    }
    
    hanleCreateNewNotebook = () => {
        this.setState({ newNBDialogOpen: false });
        const { dispatch } = this.props;
        const { title } = this.state;
        dispatch(createNotebook(title))
    }

    render() {
        const { classes, location } = this.props;
        const { isFetching, notebooks } = this.props.notebooks;

        if(isFetching){
            return (
                <div className={classes.sideNav}>
                    <CircularProgress />
                </div>
            )
        }

        const notebooksList = [];
        if(notebooks && notebooks.length > 0){
            notebooks.forEach(notebook => {
                notebooksList.push( <ListItemLink
                                        key={notebook.id}
                                        className={classes.navListItem} 
                                        to={{ pathname: location.pathname,
                                              search: this.addParameter(location, notebook.id) 
                                            }}
                                        >
                                        <ListItemText className={classes.navListItem} 
                                            primary={notebook.title}
                                        />
                                    </ListItemLink>
                                    );
            });
        }
        
        return(
            <div className={classes.sideNav}>
                <Dialog
                    open={this.state.newNBDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="new-notebook-dialog-title">New notebook</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter title for new notebook
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dese"
                            id="name"
                            label="Notebook title"
                            type="text"
                            name="title"
                            value={this.state.title}
                            onChange={this.handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.hanleCreateNewNotebook} color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
                <Scrollbar>
                    <List>
                        <ListItem button className={classes.navListItem} key={'new_notebook'} onClick={() => this.handleClickOpen()}>
                            <ListItemText className={classes.navListItem} 
                                primary="+ New notebook" />
                        </ListItem>
                        <ListItemLink
                            key={'all_notes'}
                            className={classes.navListItem} 
                            to={{ pathname: location.pathname,
                                  search: this.addParameter(location, 'all')
                                }}
                            >
                            <ListItemText className={classes.navListItem} 
                                primary={'All notes'}
                            />
                        </ListItemLink>
                        {notebooksList}
                    </List>
                </Scrollbar>
            </div>
        )
    }
}

SideNavigationPanel.propTypes = {
    notebooks: PropTypes.object.isRequired
}

export default connect()(withStyles(styles)(withRouter(SideNavigationPanel)));