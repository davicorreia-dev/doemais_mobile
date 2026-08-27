import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'space-between', 
    },
    topBar: {
        width: '100%',
        // altura definida no componente (responsiva)
        backgroundColor: '#E0323C',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        marginTop: -20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 40, 
    },
    image: {
        width: width * 0.8, 
        height: height * 0.35,
        resizeMode: 'contain',
        marginBottom: 40,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    footer: {
        width: '100%',
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    progressBarContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#E5E5E5',
        borderRadius: 3,
        marginBottom: 25,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#E0323C',
        borderRadius: 3,
    },
});

export default Styles;