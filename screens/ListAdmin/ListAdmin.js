import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, Text, View, TouchableOpacity } from "react-native";

import ContactRow from '../../components/ContactRow';
import Separator from "../../components/Separator";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, database } from '../../config/firebase';
// import { collection, doc, where, query, onSnapshot, orderBy, setDoc, deleteDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../config/constants";
import axios from "axios";
import { allAdminsRoute, getAllMessageRoute, getAllMessagesRoute } from "../../config/config";
import axiosInstance, { getConfig } from "../../api/axiosInstance";

const ListAdmin = ({ setUnreadCount }) => {
    const navigation = useNavigation();
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
            setCurrentTime(Date.now()); // Update the current time every minute
        }, 60000); // 60,000 milliseconds = 1 minute

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const currentChat = {
        _id: '6742af8f64548f55b6b918d2',
        isAvatarImageSet: true,
        name: 'Admin',
        email: 'johndoe@gmail.com',
    }

    const currentUser = {
        _id: '6742f8d25d1d52271dfc87bd',
        isAvatarImageSet: true,
        name: 'Admin',
        email: 'johndoe@gmail.com',
    };
    useEffect(() => {
        const fetchContacts = async () => {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    try {
                        const data = await axios.get(`${allAdminsRoute}/${currentUser._id}`);

                        // console.log('data', data.data);
                        setContacts(data.data);
                        setChats(data.data);
                        setLoading(false);
                    } catch (error) {
                        console.error("Error fetching contacts:", error);
                    }
                } else {
                    navigate("/setAvatar");
                }
            }
        };
        fetchContacts(); // Call the async function
    }, []);

    const fetchMessages = async (targetAdminId) => {
        const response = await axiosInstance.post(getAllMessagesRoute, {
            from: currentUser?._id,
            to: targetAdminId,
        });
        setMessages(response.data);
    };


    // useFocusEffect(
    //     React.useCallback(() => {
    //         // Load unread messages from AsyncStorage when screen is focused
    //         const loadNewMessages = async () => {
    //             try {
    //                 const storedMessages = await AsyncStorage.getItem('newMessages');
    //                 const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
    //                 setNewMessages(parsedMessages);
    //                 setUnreadCount(Object.values(parsedMessages).reduce((total, num) => total + num, 0));
    //             } catch (error) {
    //                 console.log('Error loading new messages from storage', error);
    //             }
    //         };

    //         // Set up Firestore listener for chat updates
    //         const collectionRef = collection(database, 'chats');
    //         const q = query(
    //             collectionRef,
    //             where('users', "array-contains", { email: auth?.currentUser?.email, name: auth?.currentUser?.displayName, deletedFromChat: false }),
    //             orderBy("lastUpdated", "desc")
    //         );

    //         const unsubscribe = onSnapshot(q, (snapshot) => {
    //             setChats(snapshot.docs);
    //             setLoading(false);

    //             snapshot.docChanges().forEach(change => {
    //                 if (change.type === "modified") {
    //                     const chatId = change.doc.id;
    //                     const messages = change.doc?.messages;
    //                     const firstMessage = messages[0];

    //                     // Increase unread count if the first message is from someone else
    //                     if (firstMessage.user._id !== auth?.currentUser?.email) {
    //                         setNewMessages(prev => {
    //                             const updatedMessages = { ...prev, [chatId]: (prev[chatId] || 0) + 1 };
    //                             AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
    //                             setUnreadCount(Object.values(updatedMessages).reduce((total, num) => total + num, 0));
    //                             return updatedMessages;
    //                         });
    //                     }
    //                 }
    //             });
    //         });

    //         // Load unread messages and start listener when screen is focused
    //         loadNewMessages();

    //         // Clean up listener on focus change
    //         return () => unsubscribe();
    //     }, [])
    // );

    useEffect(() => {
        updateNavigationOptions();
    }, [selectedItems]);

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

        // If the chat is a group, return the group name
        if (chat?.groupName) {
            return chat.groupName;
        }

        // If the chat has a specific name (e.g., for direct messages), return it
        if (chat?.name) {
            return chat.name;
        }

        // If the chat has an email, return the email as a fallback
        if (chat?.email) {
            return chat.email;
        }

        // If no specific identifier is available, return a default message
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
            // setUnreadCount(Object.values(updatedMessages).reduce((total, num) => total + num, 0));
            return updatedMessages;
        });

        // console.log('chat', chat);
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
        const fetchedChats = new Set(); // Use a Set to track fetched chat IDs

        const fetchAllSubtitles = async () => {
            for (const chat of chats) {
                // Skip fetching if already fetched
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
            // Avoid fetching if the subtitle already exists
            if (subtitles[chat._id]) return;

            const response = await axiosInstance.post(getAllMessageRoute, {
                from: currentUser?._id,
                to: chat?._id,
            });

            const messages = response?.data || []; // Directly use the response array

            if (messages.length === 0) {
                setSubtitles((prev) => ({
                    ...prev,
                    [chat._id]: "No messages yet",
                }));
                return;
            }

            // Get the last message
            const lastMessageObj = messages[messages.length - 1];
            const messageText = lastMessageObj.message || "No message content";

            // Determine who sent the last message
            const subtitle = lastMessageObj.fromSelf
                ? `You: ${messageText}`
                : messageText;

            // Update the subtitles state
            setSubtitles((prev) => ({
                ...prev,
                [chat._id]: subtitle,
            }));
        } catch (error) {
            console.error("Error fetching subtitle:", error);

            // Optionally set a fallback subtitle on error
            setSubtitles((prev) => ({
                ...prev,
                [chat._id]: "Failed to load message",
            }));
        }
    };

    const handleSubtitle2 = (chat) => {
        const lastUpdated = chat?.lastUpdatedMessage;

        if (!lastUpdated) {
            return "Unknown date";
        }

        try {
            const date = new Date(lastUpdated);

            if (isNaN(date.getTime())) {
                return "Invalid date";
            }

            const diffInMs = currentTime - date; // Use the updated `currentTime`
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInMinutes < 1) return "Just now";
            if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
            if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
            return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Error formatting date";
        }
    };

    return (
        <Pressable style={styles.container} onPress={deSelectItems}>
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
                            <Ionicons name="lock-open" size={12} style={{ color: '#565656' }} /> Tin nhắn cá nhân của bạn không được <Text style={{ color: colors.teal }}>mã hóa đầu cuối</Text>
                        </Text>
                    </View>
                </ScrollView>
            )}
            <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
                <View style={styles.fabContainer}>
                    <Ionicons name="chatbox-ellipses" size={24} color={'white'} />
                </View>
            </TouchableOpacity>
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
        flex: 1
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