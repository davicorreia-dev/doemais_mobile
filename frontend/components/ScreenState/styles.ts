import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
    container: { flex: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.background },
    desktop: { backgroundColor: '#F7F6F4' },
    icon: { width: 72, height: 72, alignItems: 'center', justifyContent: 'center', borderRadius: radii.pill, backgroundColor: colors.primarySoft },
    title: { marginTop: spacing.md, color: colors.text, fontSize: 18, fontWeight: '800', textAlign: 'center' },
    message: { marginTop: spacing.sm, color: colors.muted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
    retryButton: { marginTop: 22, paddingHorizontal: 22, paddingVertical: 12, borderRadius: radii.pill, backgroundColor: colors.primary },
    retryText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
