import { StyleSheet } from "react-native";
import { formColumn } from "../../app/utils/responsive";

const Styles = StyleSheet.create({


    containerInput: {
        flexDirection: 'column',
        // Coluna do formulário: mesma borda do botão principal e dos links
        ...formColumn,
    },

    inputContainer: {
        height: 48,
        marginVertical: 12,
        borderWidth: 0.1,
        backgroundColor: '#FDFCFC',
        width: '100%',
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
        marginBottom: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'Lexend_400Regular',
        marginTop: -8,
        marginBottom: 8,
    }

});

export default Styles;
