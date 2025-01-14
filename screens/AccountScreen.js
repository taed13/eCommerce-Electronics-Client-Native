import React from "react";
import { Text, View, StyleSheet, Alert, ScrollView } from "react-native";
import { colors } from "../config/constants";
import Cell from "../components/Cell";
import Header from "../components/Header";
import { useLogout } from "../api/user";

const AccountScreen = ({ navigation }) => {
    const { logout } = useLogout();

    const onSignOut = async () => {
        const result = await logout();
        if (result.success) {
            console.log("Đăng xuất thành công!");
        } else {
            console.log("Đăng xuất thất bại:", result.error);
        }
    };

    const deleteAccount = () => {
        // deleteUser(auth?.currentUser).catch(error => console.log('Error deleting: ', error));
        // deleteDoc(doc(database, 'users', auth?.currentUser.email));
    };

    return (
        <ScrollView>
            <Header title='Tài khoản' />
            {/* <Cell
                title='Blocked Users'
                icon='close-circle-outline'
                tintColor={colors.primary}
                onPress={() => {
                    alert('Blocked users touched')
                }}
            /> */}
            <Cell
                title='Đăng xuất'
                icon='log-out-outline'
                tintColor={colors.grey}
                onPress={() => {
                    Alert.alert('Đăng xuất',
                        'Bạn có chắc chắn muốn đăng xuất?',
                        [
                            {
                                text: "Đăng xuất",
                                onPress: () => { onSignOut() },
                            },
                            {
                                text: "Hủy",
                            },
                        ],
                        { cancelable: true })
                }}
                showForwardIcon={false}
            />
            <Cell
                title='Xóa tài khoản'
                icon='trash-outline'
                tintColor={colors.red}
                onPress={() => {
                    Alert.alert('Xóa tài khoản',
                        'Bạn có chắc chắn muốn xóa tài khoản?',
                        'Tất cả dữ liệu của bạn sẽ bị xóa và không thể khôi phục.',
                        [
                            {
                                text: "Xóa tài khoản",
                                onPress: () => { deleteAccount() },
                            },
                            {
                                text: "Hủy",
                            },
                        ],
                        { cancelable: true })
                }}
                showForwardIcon={false}
                style={{ marginTop: 20 }}
            />

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contactRow: {
        backgroundColor: 'white',
        marginTop: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border
    }
})

export default AccountScreen;
