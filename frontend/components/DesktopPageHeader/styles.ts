import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    header: { minHeight: 88, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 42, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEE9E3' },
    title: { color: '#302D2A', fontSize: 24, fontWeight: '800' },
    subtitle: { color: '#77716A', fontSize: 13, marginTop: 4 },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconButton: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#F7F6F4', borderWidth: 1, borderColor: '#EEE9E3' },
});
