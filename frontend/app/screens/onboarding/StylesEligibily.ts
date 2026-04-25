import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    hero: {
        height: 35,
        backgroundColor: '#E0323C',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    content: {
        paddingHorizontal: 22,
        paddingTop: 24,
        paddingBottom: 36,
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '800',
        color: '#333',
        textAlign: 'center',
        marginBottom: 28,
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
    },
    bulletText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#444',
        flex: 1,
    },
    sectionLabel: {
        marginTop: 24,
        marginBottom: 14,
        fontSize: 14,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        color: '#999',
        fontWeight: '800',
    },
    list: {
        gap: 14,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 22,
        paddingVertical: 16,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
    },
    cardIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#FFF2F3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardIcon: {
        width: 30,
        height: 30,
        tintColor: '#E0323C',
    },
    cardBody: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#333',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 13,
        lineHeight: 18,
        color: '#666',
    },
});

export default styles;
