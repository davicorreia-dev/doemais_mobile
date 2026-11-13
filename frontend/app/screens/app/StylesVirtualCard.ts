import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F7F7F7' },
    hero: {
        height: 35,
        backgroundColor: '#E0323C',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7' },
    content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 36 },
    contentDesktop: { width: '100%', paddingHorizontal: 48, paddingTop: 36 },
    pageHeading: { width: '100%' },
    pageHeadingDesktop: { maxWidth: 980, alignSelf: 'center' },
    cardColumn: { width: '100%' },
    title: { color: '#333', fontSize: 24, fontWeight: '800', textAlign: 'center' },
    subtitle: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 28 },
    titleDesktop: { fontSize: 22, textAlign: 'left' },
    subtitleDesktop: { fontSize: 12, textAlign: 'left', marginBottom: 34 },
    emptyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F7F7', padding: 34 },
    emptyIcon: { width: 86, height: 86, borderRadius: 43, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF2F3', marginBottom: 20 },
    emptyTitle: { color: '#333', fontSize: 21, textAlign: 'center', fontWeight: '800' },
    emptyText: { color: '#666', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 9 },
});

export default Styles;
