import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    // Ocupa a tela inteira: centralizar aqui fazia o formulário encolher para
    // a largura do conteúdo e os campos vazarem do card.
    screen: {
        flex: 1,
        backgroundColor: '#FDFCFC',
    },

    scrollContent: {
        paddingVertical: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },

    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    containerInputs: {
        gap: 15,
        width: '100%',
    },

    // Agrupa campos que compartilham o mesmo Controller (CEP + Cidade, select + erro)
    fieldGroup: {
        width: '100%',
    },

    iconContainer: {
        marginBottom: 20,
        backgroundColor: '#E0323C',
        padding: 20,
        borderRadius: 100,
        shadowColor: '#E0323C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 25,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
        marginVertical: 10,
        width: '100%',
        // Em tablets o card para de esticar e fica centralizado
        maxWidth: 480,
        alignSelf: 'center',
    },
    profileCardDesktop: {
        width: 860,
        maxWidth: '100%',
        borderRadius: 22,
        paddingHorizontal: 40,
        paddingVertical: 36,
    },
    desktopGrid: {
        width: '100%',
        gap: 24,
    },
    desktopRow: {
        width: '100%',
        flexDirection: 'row',
        gap: 20,
    },
    desktopField: {
        flex: 1,
        width: undefined,
        maxWidth: undefined,
        alignSelf: 'auto',
        paddingHorizontal: 0,
    },

    // Botão principal alinhado às bordas do card
    actionRow: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
    },
    actionRowDesktop: {
        width: 860,
        maxWidth: '100%',
        flexDirection: 'row',
        gap: 20,
        alignSelf: 'center',
    },
    saveButtonDesktop: {
        width: 240,
        maxWidth: undefined,
        marginBottom: 0,
    },
    cancelButton: {
        width: 200,
        maxWidth: undefined,
        marginBottom: 0,
        backgroundColor: '#FFFFFF',
        borderColor: '#E0323C',
        borderWidth: 1.5,
    },

    title: {
        fontSize: 24,
        fontFamily: 'Lexend_700Bold',
        color: '#353535',
        width: '100%',
        maxWidth: 480,
        marginBottom: 20,
    },
    titleDesktop: {
        width: 860,
        maxWidth: '100%',
        fontSize: 24,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
        width: '100%',
        maxWidth: 480,
        marginBottom: 40,
        lineHeight: 22,
    },
    subtitleDesktop: {
        width: 860,
        maxWidth: '100%',
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 22,
    },
    photoShortcut: {
        width: '100%',
        maxWidth: 480,
        minHeight: 48,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: '#FFF1F2',
        marginBottom: 4,
    },
    photoShortcutText: {
        color: '#C52D36',
        fontSize: 14,
        fontFamily: 'Lexend_600SemiBold',
    },
    photoShortcutArrow: {
        color: '#C52D36',
        fontSize: 28,
        lineHeight: 28,
    },
    photoShortcutDesktop: {
        width: 860,
        maxWidth: '100%',
        minHeight: 42,
        marginBottom: 0,
    },
});

export default Styles;
