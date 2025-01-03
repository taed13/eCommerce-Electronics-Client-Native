import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    inputToolbarContainerStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        marginHorizontal: 10,
        borderRadius: 80,
        marginBottom: 10,
        borderColor: '#FFE0E0',
        paddingVertical: 5,
        flexDirection: 'row', // Ensure elements align horizontally
    alignItems: 'center', 
    },
    inputToolbarTouchableOpacity: {
        position: 'absolute',
        marginLeft: '4%',
        marginBottom: '1%',
        bottom: 0,
    },
    inputToolbarIcon: {
        color: '#0F0326',
    },
    sendIcon: {
        color: '#0F0326', // Ensure contrast with the background
        marginRight: 10,  // Add spacing
    },
    leftGroupButton: {
        color: 'white',
    },
});
