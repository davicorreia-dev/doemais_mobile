import { StyleSheet } from "react-native";



const Styles = StyleSheet.create({
    InputContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 50,
    },

    image: {
        width: 137.17,
        height: 39,
        marginTop: 40,
        resizeMode: "contain",
    }
    ,
    confirmation: {
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: 24,
        alignItems: 'center',
        gap: 16,
    },
    confirmationTitle: {
        color: '#E0323C',
        fontSize: 22,
        fontFamily: 'Lexend_600SemiBold',
        textAlign: 'center',
    },
    confirmationText: {
        color: '#4A4A4A',
        fontSize: 15,
        fontFamily: 'Lexend_400Regular',
        lineHeight: 22,
        textAlign: 'center',
    },

})

export default Styles;
