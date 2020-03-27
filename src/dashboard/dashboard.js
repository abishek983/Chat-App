import React, { Component } from 'react';
import ChatListComponent from '../chatList/chatList';

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

    componentWillMount = () => {
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
                console.log(this.state);
              })
          }
      });
    }

    selectChat = (chatIndex) =>{
        console.log('selected a chat', chatIndex);
    }

    newChatBtnClicked = () =>{
        this.setState({newChatFormVisible : true , selectChat : null})
        console.log("New chat btn clicked");
    }

    render() {
        return (
            <div>
                <ChatListComponent history={this.props.history}
                newChatBtnFn={this.props.newChatBtnClicked}
                selectChatFn={this.props.selectChat}
                chats = {this.state.chats}
                email = {this.state.email}
                selectedChatIndex = {this.state.selectedChat}></ChatListComponent>
            </div>
        )
    }
}

export default dashboard;