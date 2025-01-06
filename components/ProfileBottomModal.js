import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BottomModal, SlideAnimation, ModalContent } from 'react-native-modals';
import ProfileItem from './ProfileItem';

const ProfileBottomModal = ({ modalVisible, setModalVisible, currentUser, navigation }) => {
    return (
        <BottomModal
            visible={modalVisible}
            onTouchOutside={() => setModalVisible(false)}
            swipeDirection={["up", "down"]}
            modalAnimation={
                new SlideAnimation({
                    slideFrom: 'bottom',
                })
            }
        >
            <ModalContent style={styles.modalContent}>
                <Text style={styles.headerText}>Ai đang mua sắm?</Text>
                <ProfileItem
                    currentUser={currentUser}
                    navigation={navigation}
                    setModalVisible={setModalVisible}
                />
            </ModalContent>
        </BottomModal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        width: "100%",
        height: 240,
        padding: 16,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default ProfileBottomModal;
