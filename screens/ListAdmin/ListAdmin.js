import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, Text, View, TouchableOpacity } from "react-native";

import ContactRow from '../../components/ContactRow';
import Separator from "../../components/Separator";
import { useNavigation } from '@react-navigation/native';
import { auth, database } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../config/constants";
import axios from "axios";
import { allAdminsRoute, getAllMessageRoute, getAllMessagesRoute } from "../../config/config";
import axiosInstance, { getConfig } from "../../api/axiosInstance";
import Header from "../../components/Header";

const ListAdmin = ({ route }) => {
    const navigation = useNavigation();
    const { fromHelpScreen } = route.params || {};
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [newMessages, setNewMessages] = useState({});
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [subtitles, setSubtitles] = useState({});
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const currentUser = {
        _id: '6742f8d25d1d52271dfc87bd',
        isAvatarImageSet: true,
        name: 'Admin',
        email: 'johndoe@gmail.com',
    };
    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser) {
                try {
                    const data = await axios.get(`${allAdminsRoute}/${currentUser._id}`);
                    setContacts(data.data);
                    setChats(data.data);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching contacts:", error);
                }
            }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        updateNavigationOptions();
    }, [selectedItems]);

    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "#425768",
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 22,
            },
            title: 'Electronics Talks',
        });
    }, [navigation]);


    const updateNavigationOptions = () => {
        if (selectedItems.length > 0) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity style={styles.trashBin} onPress={handleDeleteChat}>
                        <Ionicons name="trash" size={24} color={colors.teal} />
                    </TouchableOpacity>
                ),
                headerLeft: () => (
                    <Text style={styles.itemCount}>{selectedItems.length}</Text>
                ),
            });
        } else {
            navigation.setOptions({
                headerRight: null,
                headerLeft: null,
            });
        }
    };

    const handleChatName = (chat) => {
        if (chat?.name) {
            return chat.name;
        }

        if (chat?.email) {
            return chat.email;
        }

        return '~ No Name or Email ~';
    };


    const handleOnPress = async (chat) => {
        const chatId = chat._id;
        if (selectedItems.length) {
            return selectItems(chat);
        }
        // Reset unread count for the selected chat
        setNewMessages(prev => {
            const updatedMessages = { ...prev, [chatId]: 0 };
            AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        navigation.navigate('ChatDetail', { id: chat._id, chatName: handleChatName(chat) });
    };

    const handleLongPress = (chat) => {
        selectItems(chat);
    };

    const selectItems = (chat) => {
        if (selectedItems.includes(chat.id)) {
            setSelectedItems(selectedItems.filter(item => item !== chat.id));
        } else {
            setSelectedItems([...selectedItems, chat.id]);
        }
    };

    const getSelected = (chat) => {
        return selectedItems.includes(chat.id);
    };

    const deSelectItems = () => {
        setSelectedItems([]);
    };

    const handleFabPress = () => {
        navigation.navigate('Users');
    };

    const handleDeleteChat = () => {
        Alert.alert(
            selectedItems.length > 1 ? "Delete selected chats?" : "Delete this chat?",
            "Messages will be removed from this device.",
            [
                {
                    text: "Delete chat",
                    onPress: () => {
                        selectedItems.forEach(chatId => {
                            const chat = chats.find(chat => chat.id === chatId);
                            const updatedUsers = chat?.users.map(user =>
                                user.email === auth?.currentUser?.email
                                    ? { ...user, deletedFromChat: true }
                                    : user
                            );

                            setDoc(doc(database, 'chats', chatId), { users: updatedUsers }, { merge: true });

                            const deletedUsers = updatedUsers.filter(user => user.deletedFromChat).length;
                            if (deletedUsers === updatedUsers.length) {
                                deleteDoc(doc(database, 'chats', chatId));
                            }
                        });
                        deSelectItems();
                    },
                },
                { text: "Cancel" },
            ],
            { cancelable: true }
        );
    };

    const handleSubtitle = (chat) => {
        // console.log('chat:::', chat);
        const message = chat?.messages?.[0];

        // console.log('message:::', message);

        if (!message) return "No messages yet";

        // const isCurrentUser = auth?.currentUser?.email === message.user._id;
        // const userName = isCurrentUser ? 'You' : message.user.name.split(' ')[0];
        // const messageText = message.image ? 'sent an image' : message.text.length > 20 ? `${message.text.substring(0, 20)}...` : message.text;

        // return `${userName}: ${messageText}`;
    };

    useEffect(() => {
        const fetchedChats = new Set();

        const fetchAllSubtitles = async () => {
            for (const chat of chats) {
                if (!fetchedChats.has(chat._id)) {
                    fetchedChats.add(chat._id);
                    await fetchSubtitle(chat);
                }
            }
        };

        fetchAllSubtitles();
    }, [chats]);

    const fetchSubtitle = async (chat) => {
        try {
            if (subtitles[chat._id]) return;

            const response = await axiosInstance.post(getAllMessagesRoute, {
                from: currentUser?._id,
                to: chat?._id,
            });

            const messages = response?.data || [];

            if (messages.length === 0) {
                setSubtitles((prev) => ({
                    ...prev,
                    [chat._id]: "Chưa có tin nhắn nào",
                }));
                return;
            }

            const lastMessageObj = messages[messages.length - 1];
            const messageText = lastMessageObj.message || "Không có nội dung tin nhắn";

            const subtitle = lastMessageObj.fromSelf
                ? `Bạn: ${messageText}`
                : messageText;

            setSubtitles((prev) => ({
                ...prev,
                [chat._id]: subtitle,
            }));
        } catch (error) {
            console.error("Lỗi khi tải phụ đề:", error);

            setSubtitles((prev) => ({
                ...prev,
                [chat._id]: "Không thể tải tin nhắn",
            }));
        }
    };

    const handleSubtitle2 = (chat) => {
        const lastUpdated = chat?.lastUpdatedMessage;

        if (!lastUpdated) {
            return "Ngày không xác định";
        }

        try {
            const date = new Date(lastUpdated);

            if (isNaN(date.getTime())) {
                return "Ngày không hợp lệ";
            }

            const diffInMs = currentTime - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInMinutes < 1) return "Vừa xong";
            if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
            if (diffInHours < 24) return `${diffInHours} giờ trước`;
            return `${diffInDays} ngày trước`;
        } catch (error) {
            console.error("Lỗi khi định dạng ngày:", error);
            return "Lỗi định dạng ngày";
        }
    };

    return (
        <Pressable style={styles.container} onPress={deSelectItems}>
            <Header title="Electronics Talks" canBack={false} />
            <ScrollView style={{ backgroundColor: '#f9f9f9' }}>
                {loading ? (
                    <ActivityIndicator size='large' style={styles.loadingContainer} />
                ) : (
                    <ScrollView>
                        {chats.length === 0 ? (
                            <View style={styles.blankContainer}>
                                <Text style={styles.textContainer}>No conversations yet</Text>
                            </View>
                        ) : (
                            chats.map((chat, index) => (
                                <React.Fragment key={chat._id || index}>
                                    <ContactRow
                                        style={getSelected(chat) ? styles.selectedContactRow : ""}
                                        name={handleChatName(chat)}
                                        subtitle={subtitles[chat._id] || "Loading..."}
                                        subtitle2={handleSubtitle2(chat)}
                                        onPress={() => handleOnPress(chat)}
                                        onLongPress={() => handleLongPress(chat)}
                                        selected={getSelected(chat)}
                                        showForwardIcon={false}
                                        newMessageCount={newMessages[chat.id] || 0}
                                    />
                                </React.Fragment>
                            ))
                        )}
                        <Separator />
                        <View style={styles.blankContainer}>
                            <Text style={{ fontSize: 12, margin: 15 }}>
                                <Ionicons name="lock-open" size={12} style={{ color: '#565656' }} /> Tin nhắn cá nhân của bạn không được <Text style={{ color: '#425768' }}>mã hóa đầu cuối</Text>
                            </Text>
                        </View>
                    </ScrollView>
                )}
            </ScrollView>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 12,
        right: 12
    },
    fabContainer: {
        width: 56,
        height: 56,
        backgroundColor: colors.teal,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        fontSize: 25,
    },
    blankContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        fontSize: 16
    },
    selectedContactRow: {
        backgroundColor: '#E0E0E0'
    },
    trashBin: {
        right: 12,
        color: colors.teal,
    },
    itemCount: {
        left: 100,
        color: colors.teal,
        fontSize: 18,
        fontWeight: "400",
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.teal
    },
    newMessageBadge: {
        backgroundColor: colors.teal,
        color: 'white',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        fontSize: 12,
        marginLeft: 8
    }
});

export default ListAdmin;