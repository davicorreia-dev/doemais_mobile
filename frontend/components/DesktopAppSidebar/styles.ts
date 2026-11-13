import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    sidebar: { width: 224, backgroundColor: '#FFFFFF', borderRightWidth: 1, borderRightColor: '#EEE9E3', paddingHorizontal: 18, paddingTop: 26, paddingBottom: 22, justifyContent: 'space-between' },
    logo: { width: 112, height: 32, marginBottom: 42, alignSelf: 'center' },
    navigation: { gap: 8 },
    item: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 13, borderRadius: 10 },
    itemActive: { backgroundColor: '#E0323C' },
    itemText: { color: '#77716A', fontSize: 13, fontWeight: '600' },
    itemTextActive: { color: '#FFFFFF', fontWeight: '800' },
    profile: { paddingTop: 18, borderTopWidth: 1, borderTopColor: '#F0ECE7', flexDirection: 'row', alignItems: 'center', gap: 9 },
    avatar: { width: 31, height: 31, borderRadius: 16, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#E0323C', fontSize: 11, fontWeight: '800' },
    avatarImage: { width: 31, height: 31, borderRadius: 16 },
    profileText: { flex: 1 },
    profileName: { color: '#393532', fontSize: 11, fontWeight: '700' },
    profileRole: { color: '#9A938B', fontSize: 10, marginTop: 2 },
});
