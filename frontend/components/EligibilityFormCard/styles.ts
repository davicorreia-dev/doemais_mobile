import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    card: { position: 'relative', flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 14, gap: 10, borderRadius: 22, backgroundColor: '#FFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
    blocked: { borderWidth: 1, borderColor: '#EF9A9A', backgroundColor: '#FDECEF' },
    approved: { borderWidth: 1, borderColor: '#A5D6A7', backgroundColor: '#E8F8EE' },
    mainAction: { width: '100%', minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 14 },
    mainActionReview: { paddingRight: 48 },
    iconWrap: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: '#FFF2F3' },
    iconBlocked: { backgroundColor: '#FFEBEE' }, iconApproved: { backgroundColor: '#E8F5E9' }, icon: { width: 30, height: 30 }, body: { flex: 1 },
    title: { marginBottom: 4, fontSize: 16, fontWeight: '800' }, description: { fontSize: 13, lineHeight: 18 },
    reviewButton: { position: 'absolute', top: 12, right: 12, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
});
