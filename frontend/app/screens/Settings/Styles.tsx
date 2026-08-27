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

    // Botão principal alinhado às bordas do card
    actionRow: {
        width: '100%',
        maxWidth: 480,
        alignSelf: 'center',
    },

    title: {
        fontSize: 24,
        fontFamily: 'Lexend_700Bold',
        color: '#353535',
        width: '100%',
        maxWidth: 480,
        marginBottom: 20,
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
});

export default Styles;
