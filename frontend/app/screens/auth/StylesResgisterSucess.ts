import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        lineHeight: 22,
    },
});

export default Styles;