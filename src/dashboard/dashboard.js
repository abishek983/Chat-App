import React, { Component } from 'react';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
import ChatListComponent from '../chatList/chatList';
import ChatViewComponent  from '../chatView/chatView';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';


const firebase = require('firebase');

class dashboard extends Component {
    constructor(){
        super();
        this.state = {
            selectedChat : null,
            newChatFormVisible : false,
            email : null,
            chats : [] 
        };
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged(async _usr => {
          if(!_usr)
            this.props.history.push('/login');
          else {
            await firebase
              .firestore()
              .collection('chats')
              .where('users', 'array-contains', _usr.email)
              .onSnapshot(async res => {
                const chats = res.docs.map(_doc => _doc.data());
                await this.setState({
                  email: _usr.email,
                  chats: chats, 
                  friends: []
                });
                //console.log(this.state);
              })
          }
      });
    }

    selectChat = (chatIndex) =>{
      this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    }

    newChatBtnClicked = () =>{
        this.setState({newChatFormVisible : true , selectedChat : null})
        console.log("New chat btn clicked");
    }

    submitMessage = (msg) => {
      const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr !== this.state.email)[0]);
      firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({
          messages : firebase.firestore.FieldValue.arrayUnion({
            message : msg,
            sender : this.state.email,
            timestamp : Date.now()
          }),
          recieverHasRead : false
        });
    }
    
    buildDocKey = (friend) => [this.state.email , friend].sort().join(":");

    signOut = () => firebase.auth().signOut();
    
    clickedChatWhereNotSender = (chatIndex) => this.satate.chats[chatIndex]

    render() {
      const {classes} = this.props;
        return (
            <div>
                <ChatListComponent history={this.props.history}
                newChatBtnFn={this.newChatBtnClicked}
                selectChatFn={this.selectChat}
                chats = {this.state.chats}
                email = {this.state.email}
                selectedChatIndex = {this.state.selectedChat}></ChatListComponent>
                {
                  this.state.newChatFormVisible ? 
                  null:
                  <ChatViewComponent
                    user={this.state.email}
                    chat={this.state.chats[this.state.selectedChat]}></ChatViewComponent>
                }
                {
                  this.state.selectedChat !== null && !this.state.newChatFormVisible ? 
                    <ChatTextBoxComponent submitMessagefn ={this.submitMessage} ></ChatTextBoxComponent> : null
                }
                <Button className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
        )
    }

}

export default withStyles(styles)(dashboard);