import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    containerInputs: {
        gap: 15,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    iconContainer: {
        marginBottom: 30,
        backgroundColor: '#E0323C',
        padding: 30,
        borderRadius: 100,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Lexend_700Bold',
        color: '#353535',

        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',

        marginBottom: 40,

        lineHeight: 22,
    },
});

export default Styles;