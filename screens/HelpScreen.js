import React from "react";
import { Text, View, StyleSheet, Alert, ScrollView } from "react-native";
import { colors } from "../config/constants";
import Separator from "../components/Separator";
import Cell from "../components/Cell";
import { auth } from '../config/firebase';
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";

const HelpScreen = () => {
    const navigation = useNavigation();
    return (
        <ScrollView>
            <Header title='Trợ giúp' />
            <Cell
                title='Liên hệ chúng tôi'
                subtitle='Câu hỏi, góp ý, báo lỗi...'
                icon='people-outline'
                tintColor={colors.primary}
                onPress={() => {
                    // alert('Sẽ cập nhật sau...');
                    navigation.navigate("Chat", { fromHelpScreen: true });
                }}
                showForwardIcon={false}
            />
            <Cell
                title='Thông tin ứng dụng'
                icon='information-circle-outline'
                tintColor={colors.pink}
                onPress={() => {
                    Alert.alert('Đồ Án Tốt Nghiệp (v1.0)', 'Ứng dụng Hệ thống bán hàng điện tử\nLiên hệ: 0967496219\nEmail: taedtech13@gmail.com',
                        [
                            {
                                text: "OK",
                                onPress: () => { },
                            },
                        ],
                        { cancelable: true })
                }}
                showForwardIcon={false}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    contactRow: {
        backgroundColor: 'white',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border
    }
})

export default HelpScreen;
