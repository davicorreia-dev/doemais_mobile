import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    card: { width: '48%', alignItems: 'center', padding: 15, marginBottom: 15, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    cardHighlight: { backgroundColor: '#E0323C', borderColor: '#E0323C' },
    icon: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderRadius: 20, backgroundColor: '#FFF0F0' },
    iconHighlight: { backgroundColor: '#FFF' },
    label: { color: '#333', fontSize: 12, fontWeight: '600', textAlign: 'center' },
    labelHighlight: { color: '#FFF' },
});
