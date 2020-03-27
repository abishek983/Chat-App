import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './styles';
const firebase = require("firebase");


class singup extends Component {

    constructor() {
        super();
        this.state = {
            email: null,
            password: null,
            confirmpassword: null,
            signupError: ''
        };
    }
    //function to check the passwords are same
    formIsValid = () => this.state.password === this.state.confirmpassword

    submitSignup = (e) => {
        e.preventDefault(); // doesn't allowws page to refresh automatically
        var flag = 0;
      
        if (!this.formIsValid()) {
            this.setState({ signupError: "Password doesn't match" });
            flag = 1;
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(authRes => {
                const userObj = {
                    email: authRes.user.email,
                    friends: [],
                    messages: []
                };
                firebase
                    .firestore()
                    .collection('users')
                    .doc(this.state.email)
                    .set(userObj)
                    .then(() => {
                        //history is passed automatically passed by routing
                        this.props.history.push('/dashboard');
                    }, dbErr => {
                        console.log('Failed to add user to the database: ', dbErr.message);
                        this.setState({ signupError: 'Failed to add user' });
                    });
            }, authErr => {
                console.log('Failed to create user: ', authErr);
                this.setState({ signupError: authErr.message });
            });
    };

userTyping = (email, e) => {
    switch (email) {
        case 'email':
            this.setState({ email: e.target.value });
            break;
        case 'password':
            this.setState({ password: e.target.value });
            break;
        case 'confirmpassword':
            this.setState({ confirmpassword: e.target.value });
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
                    Sign Up!
              </Typography>
                <form onSubmit={(e) => this.submitSignup(e)} className={classes.form}>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='sign-up-email-input'>Enter Your email</InputLabel>
                        <Input autoComplete='email' onChange={(e) => this.userTyping('email', e)} autoFocus id='sign-up-email-input'></Input>
                    </FormControl>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='sign-up-password-input'>Enter Your Password</InputLabel>
                        <Input type='password' onChange={(e) => this.userTyping('password', e)} id='sign-up-password-input'></Input>
                    </FormControl>
                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='sign-up-confirm-password-input'>Re-Enter Your Password</InputLabel>
                        <Input type='password' onChange={(e) => this.userTyping('confirmpassword', e)} id='sign-up-confirm-password-input'></Input>
                    </FormControl>
                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
                        Submit
                    </Button>
                    {
                        this.state.signupError ?
                            <Typography className={classes.errorText} component='h5' variant='h6'>
                                {this.state.signupError}
                            </Typography> :
                            null
                    }
                    <Typography component='h5' variant='h6' className='classes.hasAccountHeader'>
                        Already have an account??
                        <Link to='/login' className={classes.logInLink}>Login!!</Link>
                    </Typography>
                </form>
            </Paper>
        </main>
    )


}
}

export default withStyles(styles)(singup);