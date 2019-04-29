import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const styles = {
    container: {
        display: 'flex',  
        flexWrap: 'wrap',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 650
      }
};

class NewPost extends Component {
    constructor(props){
        super(props);
        this.state = {
            header: '',
            body: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        console.log('Submitting');
        //e.preventDefault();
        const post = {
            header: this.state.header,
            body: this.state.body,
        }
        console.log('Sending to back end');
        axios.post('/note', post).then(res => console.log(res)).catch(err => console.log(err));
        this.props.history.push('/');
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.container} elevation={1}>
                    <Typography variant="h5" component="h3">
                        Add new post
                    </Typography>
                    <form className={classes.container} noValidate autoComplete="off">
                        <TextField
                            id='post-header'
                            label='Header'
                            name='header'
                            className={classes.textField}
                            value={this.state.header}
                            onChange={this.handleInputChange}
                            margin='normal'
                        />
                        <TextField
                            id='post-body'
                            label='Body'
                            name='body'
                            multiline
                            rowsMax="4"
                            className={classes.textField}
                            value={this.state.body}
                            onChange={this.handleInputChange}
                            margin='normal'
                        />
                        <Button onClick={this.handleSubmit}>Save</Button>
                    </form>
                </Paper>
            </div>
        )
    }
}

NewPost.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NewPost);