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
        marginBottom: 20,
        backgroundColor: '#E0323C',
        padding: 20,
        borderRadius: 100,
        shadowColor: '#E0323C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 25,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
        marginVertical: 10,
        width: '100%',
        alignSelf: 'center',
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