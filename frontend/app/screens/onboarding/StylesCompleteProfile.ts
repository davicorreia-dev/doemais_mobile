import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fdfcfc',
    },
    content: {
        marginTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 15,
        gap: 8,
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Lexend_600SemiBold',
        color: '#353535',
    },

    // Grade de tipos de Sangue
    bloodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 15,
    },
    bloodButton: {
        width: '23%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0323C',
        backgroundColor: '#fff',
        padding: 0,
    },
    bloodButtonSelected: {
        backgroundColor: '#E0323C',
    },
    bloodText: {
        fontSize: 18,
        fontFamily: 'Lexend_600SemiBold',
        color: '#E0323C',
        textAlign: 'center',
    },
    bloodTextSelected: {
        color: '#fff',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
        gap: 10,
    },
    checkboxText: {
        textAlign: 'center',
        fontFamily: 'Lexend_400Regular',
        fontSize: 14,
        color: '#353535',
    },

    buttonContainer: {
        alignItems: 'center',
    },
    weightLabel: {
        fontSize: 12,
        fontFamily: 'Lexend_600SemiBold',
        marginLeft: 12,
        marginBottom: 2,
        marginTop: 10,
    },
    weightInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        marginHorizontal: 12,
        marginBottom: 12,
        borderWidth: 0.1,
        backgroundColor: '#FDFCFC',
        borderRadius: 10,
        elevation: 5,
        paddingHorizontal: 15,
    },
    weightTextInput: {
        flex: 1,
        height: '100%',
        fontFamily: 'Lexend_400Regular',
        color: '#353535',
    },
    kgText: {
        fontFamily: 'Lexend_600SemiBold',
        color: '#999',
        fontSize: 14,
        marginLeft: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Lexend_600SemiBold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#353535',
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 16,
        fontFamily: 'Lexend_400Regular',
        textAlign: 'center',
        color: '#353535',
    },
    modalClose: {
        marginTop: 15,
        paddingVertical: 10,
    },
    modalCloseText: {
        color: '#E0323C',
        textAlign: 'center',
        fontFamily: 'Lexend_600SemiBold',
    }
});

export default Styles;