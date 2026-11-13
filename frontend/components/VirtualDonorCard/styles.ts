import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    card: { minHeight: 258, borderRadius: 26, backgroundColor: '#FCFBF8', borderWidth: 1, borderColor: '#E9E4DC', padding: 24, overflow: 'hidden', shadowColor: '#5B554E', shadowOpacity: 0.09, shadowOffset: { width: 0, height: 10 }, shadowRadius: 18, elevation: 4 },
    cardDesktop: { width: 400, minHeight: 272 },
    cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, backgroundColor: '#E0323C' },
    brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
    brandLogoWrap: { height: 36, width: 92, alignItems: 'flex-start', justifyContent: 'center' },
    brandLogo: { width: 88, height: 30 },
    cardType: { color: '#847C73', fontSize: 9, letterSpacing: 1, fontWeight: '800' },
    cardMain: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, gap: 12 },
    donorDetails: { flex: 1 },
    fieldLabel: { color: '#847C73', fontSize: 10, letterSpacing: 0.8, fontWeight: '700' },
    name: { maxWidth: 210, color: '#292724', fontSize: 23, lineHeight: 29, fontWeight: '800', marginTop: 7 },
    bloodBadge: { minWidth: 73, minHeight: 73, borderRadius: 20, backgroundColor: '#E0323C', alignItems: 'center', justifyContent: 'center', shadowColor: '#E0323C', shadowOpacity: 0.2, shadowRadius: 8, elevation: 2 },
    bloodType: { color: '#FFF', fontSize: 25, fontWeight: '800' },
    divider: { height: 1, backgroundColor: '#E9E4DC', marginVertical: 20 },
    cardFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
    date: { color: '#3A3733', fontSize: 13, fontWeight: '600', marginTop: 6, textTransform: 'capitalize' },
    approvedSeal: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#E8F5E9' },
    approvedText: { color: '#2E7D32', fontSize: 10, letterSpacing: 0.5, fontWeight: '800' },
    reviewSeal: { backgroundColor: '#FFF1D6' },
    reviewText: { color: '#8A5A13' },
});

export default styles;
