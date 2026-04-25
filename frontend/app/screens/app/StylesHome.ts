import { StyleSheet, Platform } from "react-native";

const Styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 40 : 20,
        paddingBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 99,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bloodTypeTag: {
        backgroundColor: '#E0323C',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginTop: 2,
    },
    bloodTypeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    headerIcons: {
        flexDirection: 'row',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 45,
    },
    searchInput: {
        flex: 1,
        color: '#333',
    },
    
    // Conteúdo
    contentContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 10,
    },
    
    // Atividades Grid
    activitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    activityCard: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        // Sombra leve
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    activityIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    activityLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },

    // Blood Grid
    bloodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    bloodButton: {
        width: '22%',
        backgroundColor: '#E0323C',
        aspectRatio: 1, // Quadrado
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    bloodButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // Visto Recentemente
    recentCard: {
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
    },
    recentBadge: {
        width: 50,
        height: 50,
        backgroundColor: '#E0323C',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    recentBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    hospitalName: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    hospitalLocation: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    timeText: {
        fontSize: 10,
        color: '#999',
        marginTop: 4,
    },

    // Stats Grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '31%',
        paddingVertical: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    statLabel: {
        color: '#fff',
        fontSize: 10,
        marginTop: 5,
    }
});

export default Styles;