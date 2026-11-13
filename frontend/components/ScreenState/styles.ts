import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: { flex: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: '#F7F7F7' },
    desktop: { backgroundColor: '#F7F6F4' },
    icon: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: 36, backgroundColor: '#FFF1F2' },
    title: { marginTop: 16, color: '#333', fontSize: 18, fontWeight: '800', textAlign: 'center' },
    message: { marginTop: 8, color: '#77716A', fontSize: 14, lineHeight: 21, textAlign: 'center' },
    retryButton: { marginTop: 22, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 22, backgroundColor: '#E0323C' },
    retryText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
