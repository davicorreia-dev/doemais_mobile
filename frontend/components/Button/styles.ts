import { StyleSheet } from "react-native";
import { FORM_MAX_WIDTH } from "../../app/utils/responsive";

const styles = StyleSheet.create({


    button: {
        backgroundColor: '#E0323C',
        // Mais alto que os inputs (48) para marcar a ação principal
        height: 56,
        // Acompanha a largura do container; a coluna do formulário define o limite
        width: '100%',
        maxWidth: FORM_MAX_WIDTH,
        alignSelf: 'center',
        borderColor: '#E0323C',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        marginBottom: 40,
    },

    TextLogin: {
        color: '#E0323C',
        fontSize: 18,
        fontWeight: '800',
    }

})

export default styles;
