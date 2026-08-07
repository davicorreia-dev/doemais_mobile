import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    inputcontainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 15,
    },

    HeaderTitle: {
        fontSize: 26,
        fontFamily: 'Lexend_700Bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },

    HeaderSubtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },

    ForgetPassword: {
        fontSize: 13,
        fontFamily: 'Lexend_500Medium',
        color: "#E0323C",
    },
    SocialbuttonsContainer: {
        gap: 20,
        marginTop: 25,
        alignItems: "center",
    },

    containerRegister: {
        marginTop: 35,
        marginBottom: 20,
        alignSelf: 'center'
    },

    RegisterUnderline: {
        color: "#E0323C",
        fontFamily: 'Lexend_600SemiBold',
    },

    registerText: {
        color: '#666666',
        fontFamily: 'Lexend_400Regular',
        fontSize: 14,
        textAlign: 'center',
    },

})

export default Styles;