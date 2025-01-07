import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, Pressable } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ChatMenu = ({ chatName, chatId }) => {
    const navigation = useNavigation();
    const [isHovered, setIsHovered] = useState(false);

    const handleDeleteChat = () => {
        Alert.alert(
            "Xóa cuộc trò chuyện?",
            "Tin nhắn sẽ bị xóa khỏi thiết bị của bạn.",
            [
                {
                    text: "Xóa cuộc trò chuyện",
                    onPress: () => alert("Đã xóa cuộc trò chuyện thành công!"),
                    style: 'destructive'
                },
                { text: "Hủy", style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    return (
        <Menu>
            <MenuTrigger>
                <Pressable
                    onPressIn={() => setIsHovered(true)}
                    onPressOut={() => setIsHovered(false)}
                    style={[styles.menuIcon, isHovered && styles.hoverStyle]}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="black" />
                </Pressable>
            </MenuTrigger>
            <MenuOptions style={styles.menuOptions}>
                <MenuOption
                    onSelect={() => navigation.navigate('ChatInfo', { chatId, chatName })}
                    style={styles.menuOption}
                >
                    <View style={styles.optionContainer}>
                        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
                        <Text style={styles.optionText}>Thông tin cuộc trò chuyện</Text>
                    </View>
                </MenuOption>

                <MenuOption onSelect={handleDeleteChat} style={styles.menuOption}>
                    <View style={styles.optionContainer}>
                        <Ionicons name="trash-outline" size={20} color="red" />
                        <Text style={[styles.optionText, styles.deleteText]}>Xóa cuộc trò chuyện</Text>
                    </View>
                </MenuOption>
            </MenuOptions>
        </Menu>
    );
};

const styles = StyleSheet.create({
    menuIcon: {
        alignSelf: "center",
        borderRadius: 30,
        padding: 7,
        backgroundColor: '#f9f9f9',
    },
    hoverStyle: {
        backgroundColor: '#FEBD68',
    },
    menuOptions: {
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    menuOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomColor: '#f0f0f0',
        borderBottomWidth: 1,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
        color: '#333',
    },
    deleteText: {
        color: 'red',
    },
});

export default ChatMenu;
