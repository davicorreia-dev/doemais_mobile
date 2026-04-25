import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({

    Container: {
        flex: 1,
        backgroundColor: '#white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    IconAlign: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    LoginContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        gap: 20,
    },

    ForgetPassword: {
        color: '#2d87fdff',
        alignSelf: 'flex-start',
        textDecorationLine: "underline",
    },

    back: {
        color: 'white',
        textAlign: 'center',
        justifyContent: 'center',
        marginRight: 30
    },



});

export default Styles;
