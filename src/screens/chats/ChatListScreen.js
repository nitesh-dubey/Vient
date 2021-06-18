import React from 'react';
import { StyleSheet } from 'react-native';
import { View, FlatList } from 'react-native';
//import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import { Header, Icon, Text } from 'react-native-elements';
import ChatListItem from '../../components/ChatListItem';

import chatListData from '../../data/chatListData.json';

const ChatListScreen = (props) => {

    const renderChatListItem = ({item}) => <ChatListItem chatListItemData = {item} navigation = {props.navigation} />
    const renderItemSeparator = () => {
        return (
            <View style={{backgroundColor:'#e5e5e5', height : StyleSheet.hairlineWidth}} />
        )
    }

    return (
        <View style={styles.container}>
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
                    text : 'MY CHATS',
                    style : {color : '#000', fontWeight : 'bold', fontSize : 18}
                }}
            />

            <View style={styles.flatlistContainer}>
                <FlatList
                    data = {chatListData}
                    keyExtractor = {(item)=>(item.chatRoomId)}
                    renderItem = {renderChatListItem}
                    ItemSeparatorComponent = {renderItemSeparator}

                    windowSize = {5}
                    removeClippedSubviews = {true}
                    initialNumToRender = {10}
                />
            </View>

        </View>
    )
}

export default ChatListScreen;

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    flatlistContainer : {
        flex : 1
    }
})