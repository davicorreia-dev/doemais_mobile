import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.45)' },
    card: { width: '100%', maxWidth: 460, alignItems: 'center', gap: 12, padding: 24, borderRadius: 24, backgroundColor: '#FFF' },
    title: { color: '#333', fontSize: 18, fontWeight: '800', textAlign: 'center' },
    message: { marginBottom: 8, color: '#666', fontSize: 15, lineHeight: 22, textAlign: 'center' },
    action: { width: '100%', alignItems: 'center', paddingVertical: 14, borderRadius: 28, backgroundColor: '#E0323C' },
    actionText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
