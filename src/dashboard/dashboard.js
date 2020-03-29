import React, { Component } from 'react';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
import ChatListComponent from '../chatList/chatList';
import ChatViewComponent  from '../chatView/chatView';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';
import NewChatComponent from '../newChat/newChat';

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


    //functions called from newChatfn
    gotochat = async (dockey ,msg) =>{
      const usersInChat = dockey.split(':');
      const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
      this.setState({ newChatFormVisible : false });
      await this.selectChat(this.state.chats.indexOf(chat));
      this.submitMessage(msg); 
    }

    newChatSubmit = async (chatobj) => {
      const dockey = this.buildDocKey(chatobj.sendTo); 
      await firebase 
        .firestore()
        .collection('chats')
        .doc(dockey)
        .set({
          recieverHasRead : false,
          users: [this.state.email, chatobj.sendTo],
          messages : [{
            message : chatobj.message,
            sender : this.state.email
          }]
        })
        this.setState({newChatFormVisible : false});
        this.selectChat(this.state.chats.length-1);
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
                {
                  this.state.newChatFormVisible ? <NewChatComponent goToChatFn={this.gotochat} newChatSubmitFn={this.newChatSubmit}></NewChatComponent>:null
                }
                <Button className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
        )
    }

}

export default withStyles(styles)(dashboard);