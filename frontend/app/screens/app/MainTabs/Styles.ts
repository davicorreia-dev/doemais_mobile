import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tabBar: {
        height: 74,
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: '#FFFEFC',
        borderTopWidth: 1,
        borderTopColor: '#EEE9E3',
        elevation: 12,
        shadowColor: '#4B4640',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
    },
    label: {
        fontSize: 10,
        fontFamily: 'Lexend_500Medium',
        marginTop: 1,
    },
    primaryLabel: {
        fontFamily: 'Lexend_700Bold',
    },
    lockedLabel: {
        color: '#A8A29A',
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        backgroundColor: '#E0323C',
        shadowColor: '#E0323C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 7,
        elevation: 3,
    },
    iconWrapLocked: {
        backgroundColor: '#F2EFEA',
    },
    primaryTabItem: {
        marginTop: -12,
    },
    primaryIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FCE6E8',
    },
    primaryIconWrapActive: {
        backgroundColor: '#E0323C',
        shadowColor: '#E0323C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 6,
    },
    badge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#E0323C',
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
        lineHeight: 18,
        paddingHorizontal: 4,
        top: 2,
        right: 14,
    },
    reviewBadge: {
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#D58A18',
        color: '#FFF',
        fontSize: 12,
        fontWeight: '800',
        lineHeight: 17,
        paddingHorizontal: 4,
        top: 2,
        right: 14,
    },
});

export default styles;
