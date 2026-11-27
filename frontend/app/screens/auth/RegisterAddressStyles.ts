import { StyleSheet } from 'react-native';
import { formColumn } from '../../utils/responsive';

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heading: {
        paddingHorizontal: 30,
        marginTop: 35,
    },
    title: {
        fontSize: 26,
        fontFamily: 'Lexend_700Bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    progressTrack: {
        marginTop: 16,
        height: 8,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: '#F2D5D7',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#E0323C',
    },
    inputContainer: {
        ...formColumn,
        marginTop: 30,
    },
    requiredHint: {
        fontSize: 12,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
        marginBottom: 4,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default Styles;
