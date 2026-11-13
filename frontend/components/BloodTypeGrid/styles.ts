import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
    formGrid: { rowGap: 15 },
    button: { width: '22%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 10, borderRadius: 10, backgroundColor: '#E0323C' },
    formButton: { width: '23%', height: 50, aspectRatio: undefined, marginBottom: 0, borderRadius: 12, borderWidth: 1, borderColor: '#E0323C', backgroundColor: '#FFF' },
    buttonActive: { backgroundColor: '#E0323C' },
    text: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    formText: { color: '#E0323C', fontSize: 18, fontFamily: 'Lexend_600SemiBold' },
    textActive: { color: '#FFF' },
});
