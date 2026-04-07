// app/screens/QuizFlow/Styles.ts
import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#E0323C',
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
    },
    headerIconContainer: {
        width: 90,
        height: 90,
        backgroundColor: '#FFF',
        borderRadius: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
    },
    headerImage: {
        width: 50,
        height: 50,
        tintColor: '#E0323C',
        resizeMode: 'contain',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginHorizontal: 20,
        marginTop: -40,
        padding: 20,
        minHeight: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
        lineHeight: 26,
    },
    buttonGroup: {
        width: '100%',
        gap: 15,
        marginBottom: 20,
    },
    optionButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0323C',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    // Estilos do Modal
    blockContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    blockCard: {
        backgroundColor: '#FFF',
        width: '100%',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
    },
    blockIcon: {
        marginBottom: 20,
    },
    blockTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    blockMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        lineHeight: 22,
    },
});

export default Styles;