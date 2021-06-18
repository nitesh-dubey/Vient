import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { Header, Icon } from 'react-native-elements'
import { GiftedChat } from 'react-native-gifted-chat';

//importing test Data
import chatRoomData from '../../data/chatRoomData.json';
import ProfileScreen from '../profile/ProfileScreen';

const ChatRoomScreen = (props) => {
    const {chatRoomId, myUserInfo, friendUserInfo} = props.route.params;

    const [messages, setMessages] = useState([])

    useEffect(() => {
        
        //Used to sort the messages by their created timestamp, so that messages displayed orderly.
        let previousMessages = chatRoomData[chatRoomId].messages;
        previousMessages.sort((a,b) => (b.createdAt - a.createdAt));
        setMessages(() => (previousMessages))

        //setMessages(chatRoomData[chatRoomId].messages.reverse())
        // setMessages(previousMessages => GiftedChat.append(previousMessages, chatRoomData[chatRoomId].messages))
        // console.log("I'm in useEffect")
        //console.log(messages)
    }, [])


    const onMessageSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))

        //While Sending The message in database/server, convert the createdAt to unix timestamps (in millisecs)
        // let msg = messages[0]
        // msg.createdAt = Date.parse(msg.createdAt)
        // console.log(msg)

        // console.log("I'm in onMessageSend")
    }, [])

    
    //To be Edited
    const showUserProfile = () => {
        props.navigation.navigate('UserProfileScreen', {userId : friendUserInfo._id})
    }

    return (
        <View style={{flex : 1}}>
            <Header
                backgroundColor = '#fff'
                leftComponent = {
                    <Icon
                        name = 'arrow-back'
                        color = '#000'
                        size = {30}
                        onPress = {() => props.navigation.goBack()}
                    />
                }
                centerComponent = {{
                    text : friendUserInfo.name,
                    style : {color : '#000', fontWeight : 'bold', fontSize : 18}
                }}
            />

            <GiftedChat
                inverted = {true}
                messages = {messages}
                onSend = { onMessageSend }
                user = {{
                    _id : myUserInfo._id,
                    name : myUserInfo.name,
                    avatar : myUserInfo.avatar
                }}
                scrollToBottom
                listViewProps = {{
                    windowSize : 10,
                    removeClippedSubviews : true,
                    initialNumToRender : 10,
                }}
                onPressAvatar = {showUserProfile}
            />

        </View>
    )
}

export default ChatRoomScreen;