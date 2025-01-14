import React from "react";
import { Text, View, StyleSheet, Alert, ScrollView } from "react-native";
import { colors } from "../config/constants";
import Cell from "../components/Cell";
import Header from "../components/Header";
import { useGetCurrentUser, useLogout } from "../api/user";
import { useDeleteUser } from "../api/user";

const AccountScreen = ({ navigation }) => {
    const { data, isLoading, error } = useGetCurrentUser();
    const { mutate: disableUser, isUserDeleteLoading } = useDeleteUser();

    const currentUser = data?.data;
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
        disableUser(currentUser._id);
        Alert.alert('Vô hiệu hóa tài khoản',
            'Tài khoản của bạn đã được bị vô hiệu hóa.',
            [
                {
                    text: "OK",
                    onPress: () => { onSignOut() },
                },
            ],
            { cancelable: false })
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
                title='Vô hiệu hóa tài khoản'
                icon='trash-outline'
                tintColor={colors.red}
                onPress={() => {
                    Alert.alert('Vô hiệu hóa tài khoản',
                        'Bạn có chắc chắn muốn vô hiệu hóa tài khoản?',
                        [
                            {
                                text: "Vô hiệu hóa tài khoản",
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
