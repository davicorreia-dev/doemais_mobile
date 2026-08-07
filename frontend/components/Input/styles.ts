import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({


    containerInput: {
        flexDirection: 'column',
        width: 330, // Largura total constante (306 da caixa + 12 de margem esquerda + 12 de margem direita)
    },

    inputContainer: {
        height: 45,
        margin: 12,
        borderWidth: 0.1,
        backgroundColor: '#FDFCFC',
        width: 306,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputStyle: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15, // Espaço para o texto não ficar colado
        color: '#000000', // Garante que o texto digitado seja visível (não fique invisível em dark mode ou com secureTextEntry)
    },
    iconContainer: {
        padding: 10,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Lexend_600SemiBold',
        marginLeft: 12,
        marginBottom: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'Lexend_400Regular',
        marginLeft: 12,
        marginRight: 12, // Evita encostar na borda direita e garante que o texto quebre linha
        marginTop: -8,
        marginBottom: 8,
    }

});

export default Styles;
