import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.48)' },
    card: { width: '100%', maxWidth: 420, alignItems: 'center', padding: 26, borderRadius: 24, backgroundColor: '#FFF' },
    title: { marginTop: 12, color: '#333', fontSize: 19, fontWeight: '800', textAlign: 'center' },
    message: { marginTop: 8, color: '#666', fontSize: 14, lineHeight: 21, textAlign: 'center' },
    button: { minWidth: 132, marginTop: 22, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 22 },
    buttonText: { color: '#FFF', fontSize: 14, fontWeight: '800', textAlign: 'center' },
});
