import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    inputcontainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },

    // Imagelogo: {
    //     marginTop: 40,
    //     marginBottom: 40,
    //     alignSelf: 'center',
    //     width: 225.11,
    //     height: 60,
    //     resizeMode: 'contain'
    // },

    TitleContainer: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Lexend_700Bold',
        width: "83%",
        alignSelf: "center",
        textAlign: "center",
        color: "#E0323C",
        marginTop: 30,
    },

    ForgetPassword: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Lexend_700Bold',
        width: "77%",
        alignSelf: "center",
        textAlign: "left",
        color: "#E0323C"
    },
    SocialbuttonsContainer: {
        gap: 30,
        marginTop: 30,
        alignItems: "center",
    },

    containerRegister: {
        flexDirection: 'column',
        fontWeight: 'bold',
        fontFamily: 'Lexend_700Bold',
        alignContent: 'center',
        alignSelf: 'center'
    },

    RegisterUnderline: {
        color: "#E0323C",
        textDecorationLine: "underline",
        fontFamily: 'Lexend_700Bold',
    },

    registerText: {
        color: '#E0323C',
        fontFamily: 'Lexend_700Bold',
        fontSize: 14,
        textAlign: 'center',
    },

})

export default Styles;