import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F7F7F7' },
    desktopScreen: { flexDirection: 'row', backgroundColor: '#F7F6F4' },
    desktopMain: { flex: 1 },
    hero: { height: 35, backgroundColor: '#E0323C', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    content: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 36 },
    contentDesktop: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 42, paddingTop: 36, paddingBottom: 56 },
    title: { color: '#333', fontSize: 24, fontWeight: '800', textAlign: 'center' },
    subtitle: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 28 },
    profileSummary: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE9E3', marginBottom: 28 },
    avatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#E0323C', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    avatarText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
    profileText: { flex: 1 },
    name: { color: '#333', fontSize: 17, fontWeight: '800' },
    email: { color: '#77716A', fontSize: 13, marginTop: 4 },
    sectionTitle: { color: '#999', fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 10 },
});

export default styles;
