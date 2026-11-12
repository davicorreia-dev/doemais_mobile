import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF', justifyContent: 'space-between' },
    topBar: { width: '100%', backgroundColor: '#E0323C' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    title: { color: '#333', fontSize: 24, lineHeight: 31, fontWeight: '800', textAlign: 'center', marginBottom: 36 },
    iconWrap: { width: 196, height: 196, borderRadius: 98, backgroundColor: '#FFF2F3', alignItems: 'center', justifyContent: 'center', marginBottom: 36 },
    description: { color: '#666', fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 360 },
    footer: { paddingHorizontal: 30, paddingBottom: 36 },
    progressTrack: { height: 6, backgroundColor: '#E5E5E5', borderRadius: 3, overflow: 'hidden', marginBottom: 24 },
    progressValue: { height: '100%', backgroundColor: '#E0323C', borderRadius: 3 },
});

export default styles;
