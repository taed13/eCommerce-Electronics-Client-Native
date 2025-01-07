import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import EmojiModal from 'react-native-emoji-modal';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { io } from "socket.io-client";
import { colors } from '../config/constants';
import { useGetCurrentUser } from '../api/user';
import { useGetMessage, useSendMessage } from '../api/message';
import { APP_CONFIG } from '../config/common';
import Loading from '../components/Loading';

function Chat({ route }) {
    const { data: userData, isLoading: userLoading } = useGetCurrentUser();
    const socket = useRef();
    const navigation = useNavigation();

    const [messages, setMessages] = useState([]);
    const [modal, setModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const currentUser = {
        _id: userData?.data?._id || 'unknown',
        isAvatarImageSet: true,
        name: userData?.data?.name || 'User',
        email: userData?.data?.email,
    };

    const { data: messagesData, isLoading: messagesLoading, error: messagesError, refetch } = useGetMessage(currentUser._id, route.params.id);
    const { mutate: sendMessage } = useSendMessage();

    useEffect(() => {
        if (currentUser) {
            socket.current = io(APP_CONFIG.host);
            socket.current.on("connect", () => {
                console.log("Socket connected:", socket.current.id);
            });

            socket.current.emit("add-user", currentUser._id);
        }

        return () => {
            if (socket.current) {
                console.log("Socket disconnected");
                socket.current.disconnect();
            }
        };
    }, [currentUser]);

    useEffect(() => {
        if (socket.current) {
            socket.current.off("msg-receive");
            socket.current.on("msg-receive", (data) => {
                setMessages((prevMessages) =>
                    GiftedChat.append(prevMessages, [{
                        _id: uuid.v4(),
                        text: data.message,
                        createdAt: new Date(data.lastUpdatedMessage || new Date()),
                        user: {
                            _id: route.params.id,
                            name: route.params.chatName,
                        },
                    }])
                );
            });
        }
    }, [socket.current]);

    useEffect(() => {
        if (messagesData) {
            const formattedMessages = messagesData.map((message, index) => ({
                _id: index.toString(),
                text: message.message,
                createdAt: new Date(message.createdAt || Date.now()),
                user: {
                    _id: message.fromSelf ? currentUser?._id : route.params.id,
                    name: message.fromSelf ? "You" : route.params.chatName,
                },
            }));
            setMessages(formattedMessages);
        }
    }, [messagesData]);

    const onSend = useCallback((newMessages = []) => {
        const messageToSend = newMessages[0];
        setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));

        // Send message via socket
        socket.current.emit("send-msg", {
            to: route.params.id,
            from: currentUser._id,
            message: messageToSend.text,
        });

        sendMessage({
            from: currentUser._id,
            to: route.params.id,
            message: messageToSend.text,
        });
    }, [currentUser, route.params.id, sendMessage]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            await uploadImageAsync(result.assets[0].uri);
        }
    };

    const uploadImageAsync = async (uri) => {
        setUploading(true);
        const randomString = uuid.v4();
        const imageMessage = {
            _id: randomString,
            createdAt: new Date(),
            text: "",
            image: uri,
            user: {
                _id: currentUser?._id,
                name: currentUser?.name,
            },
        };

        setMessages((prevMessages) => GiftedChat.append(prevMessages, [imageMessage]));
        setUploading(false);
    };

    const renderBubble = useMemo(() => (props) => (
        <Bubble
            {...props}
            wrapperStyle={{
                right: { backgroundColor: colors.primary },
                left: { backgroundColor: 'lightgrey' }
            }}
        />
    ), []);

    const renderSend = useMemo(() => (props) => (
        <>
            <TouchableOpacity style={styles.addImageIcon} onPress={pickImage}>
                <View>
                    <Ionicons name='attach-outline' size={32} color={colors.teal} />
                </View>
            </TouchableOpacity>
            <Send {...props}>
                <View style={{
                    bottom: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: colors.lightGrey,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Ionicons name='send' size={30} color={colors.teal} />
                </View>
            </Send>
        </>
    ), []);

    const renderInputToolbar = useMemo(() => (props) => (
        <InputToolbar {...props}
            containerStyle={styles.inputToolbar}
            renderActions={renderActions}
        />
    ), []);

    const renderActions = useMemo(() => () => (
        <TouchableOpacity style={styles.emojiIcon} onPress={handleEmojiPanel}>
            <View>
                <Ionicons
                    name='happy-outline'
                    size={32}
                    color={colors.teal} />
            </View>
        </TouchableOpacity>
    ), [modal]);

    const handleEmojiPanel = useCallback(() => {
        if (!modal) {
            Keyboard.dismiss();
        }
        setModal((prev) => !prev);
    }, [modal]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            if (modal) {
                setModal(false);  // Tắt modal nếu đang mở khi bàn phím được bật
            }
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, [modal]);

    const renderLoading = useMemo(() => () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={colors.teal} />
        </View>
    ), []);

    const renderLoadingUpload = useMemo(() => () => (
        <View style={styles.loadingContainerUpload}>
            <ActivityIndicator size='large' color={colors.teal} />
        </View>
    ), []);

    if (userLoading || messagesLoading) {
        return (
            <Loading />
        );
    }

    return (
        <>
            {uploading && renderLoadingUpload()}
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={false}
                showUserAvatar={false}
                onSend={messages => onSend(messages)}
                imageStyle={{ height: 212, width: 212 }}
                messagesContainerStyle={{ backgroundColor: '#fff' }}
                textInputStyle={{ backgroundColor: '#fff', borderRadius: 20, marginBottom: 40, marginTop: 10 }}
                user={{
                    _id: currentUser._id,
                    name: currentUser.name,
                    avatar: "https://i.pravatar.cc/300",
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderUsernameOnMessage={true}
                renderAvatarOnTop={true}
                renderInputToolbar={renderInputToolbar}
                minInputToolbarHeight={56}
                scrollToBottom={true}
                onPressActionButton={handleEmojiPanel}
                scrollToBottomStyle={styles.scrollToBottomStyle}
                renderLoading={renderLoading}
            />

            {modal &&
                <EmojiModal
                    onPressOutside={handleEmojiPanel}
                    modalStyle={styles.emojiModal}
                    containerStyle={styles.emojiContainerModal}
                    backgroundStyle={styles.emojiBackgroundModal}
                    columns={5}
                    emojiSize={66}
                    activeShortcutColor={colors.primary}
                    onEmojiSelected={(emoji) => {
                        onSend([{
                            _id: uuid.v4(),
                            createdAt: new Date(),
                            text: emoji,
                            user: {
                                _id: currentUser?._id,
                                name: currentUser?.name,
                                avatar: 'https://i.pravatar.cc/300'
                            }
                        }]);

                        setModal(false);
                    }}
                />
            }
        </>
    );
}

const styles = StyleSheet.create({
    emojiIcon: {
        marginLeft: 8,
        bottom: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        width: 40,
    },
    emojiModal: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiContainerModal: {
        backgroundColor: 'white',
        padding: 5,
        maxHeight: 400,
        alignSelf: 'center',
        elevation: 5,  // Adds a shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4, // Adds a shadow on iOS
    },
    emojiBackgroundModal: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    scrollToBottomStyle: {
        borderColor: colors.grey,
        borderWidth: 1,
        width: 56,
        height: 56,
        borderRadius: 28,
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    addImageIcon: {
        bottom: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainerUpload: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
    }
});

export default Chat;