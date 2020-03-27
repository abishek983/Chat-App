import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import styles from './styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const firebase = require("firebase");
class login extends Component {
    constructor(){
        super();
        this.state = {
            email : null,
            password : null,
            signinError : ''
        }
    }

    loginSubmit = (e) => {
        e.preventDefault();
        console.log(this.state);
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email , this.state.password)
            .then( () => {
                this.props.history.push('/dashboard');
            }, err => {
                this.setState(this.setState({signinError : err}));
                console.log(err);
            })
    }

    userTyping = (type,e) => {
        switch(type){
            case 'email':
                this.setState({email : e.target.value });
                break;
            
            case 'password':
                this.setState({password : e.target.value});
                break;
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Log In!
                    </Typography>
                    <form className={classes.form} onSubmit={(e) => this.loginSubmit(e)}>
                        <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor="sign-in-email" >Enter Your Email address</InputLabel>
                        <Input autoComplete='email' onChange={(e) => this.userTyping('email', e)} autoFocus id='sign-in-email'></Input>
                        </FormControl>
                        <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor="sign-in-password" >Enter Your Password</InputLabel>
                        <Input type='password' onChange={(e) => this.userTyping('password', e)} id='sign-in-password'></Input>
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>
                    </form>
                    { this.state.signinError ? 
                        <Typography className={classes.errorText} component='h5' variant='h6'>
                            Incorrect Login Information
                        </Typography> :
                        null
                    }
                    <h5 className={classes.noAccountHeader}>Don't Have An Account?</h5>
                    <Link className={classes.signUpLink} to='/signup'>Sign Up!</Link>
                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(login);