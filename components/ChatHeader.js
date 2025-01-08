import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChatHeader = ({ chatName, textColor = "#425768" }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={[styles.chatName, { color: textColor }]}>{chatName}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    chatName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
});

export default ChatHeader;
