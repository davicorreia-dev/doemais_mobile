import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    desktopShell: { flexDirection: 'row', backgroundColor: '#F7F6F4' },
    desktopMain: { flex: 1 },
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
    contentDesktop: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 42, paddingTop: 40, paddingBottom: 56 },
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
});

export default styles;
