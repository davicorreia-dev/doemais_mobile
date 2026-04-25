import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginBottom: 20,
        backgroundColor: '#E0323C',
        padding: 20,
        borderRadius: 50,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Lexend_700Bold',
        color: '#353535',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 10,
    },
    checkboxText: {
        fontFamily: 'Lexend_400Regular',
        fontSize: 12,
        color: '#353535',
    },
    linkText: {
        color: '#E0323C',
        fontFamily: 'Lexend_600SemiBold',
    }
});

export default Styles;