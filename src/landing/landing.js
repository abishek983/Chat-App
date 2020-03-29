import React, {Component} from 'react';
import styles from './styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';


class landing extends Component{
    render(){
        const {classes} = this.props; 
        return(
            <main className={classes.main}>
                <CssBaseline />
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5"  
                    style={{
                        paddingBottom: '20px',
                      }}>
                        Welcome!!
                    </Typography>

                    <Typography>
                        Want to test the Application??
                        Make another account in incognito mode.
                        And see real time messaging.
                    </Typography>
                        <Button href='/signup' variant='contained' color='primary'
                         style={{
                            marginBottom: '20px',
                          }}> signUp </Button>
                        <Button href='/login' variant='contained' color='primary'>login </Button>
                </Paper>
            </main>
        )
    }
}

export default withStyles(styles)(landing);
