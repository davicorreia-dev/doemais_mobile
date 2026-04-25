import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdfcfc',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    description: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#4A4A4A',
        marginTop: 10,
        marginBottom: 20,
        lineHeight: 20,
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 15,
    },
    validationContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    validationText: {
        fontSize: 12,
        color: '#E0323C',
        fontFamily: 'Lexend_400Regular',
        marginBottom: 4,
    },
    errorText: {
        color: '#E0323C',
        fontSize: 12,
        fontFamily: 'Lexend_600SemiBold',
        alignSelf: 'flex-start',
        marginLeft: 12,
        marginTop: -10,
    },
    buttonContainer: {
        marginTop: 40,
        alignItems: 'center',
    }
});

export default Styles;