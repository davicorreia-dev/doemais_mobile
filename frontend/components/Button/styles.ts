import { StyleSheet } from "react-native";
import { FORM_MAX_WIDTH } from "../../app/utils/responsive";
import { colors, radii } from '../../theme/tokens';

const styles = StyleSheet.create({


    button: {
        backgroundColor: colors.primary,
        // Mais alto que os inputs (48) para marcar a ação principal
        height: 56,
        // Acompanha a largura do container; a coluna do formulário define o limite
        width: '100%',
        maxWidth: FORM_MAX_WIDTH,
        alignSelf: 'center',
        borderColor: colors.primary,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radii.pill,
        marginBottom: 40,
    },

    TextLogin: {
        color: colors.surface,
        fontSize: 18,
        fontWeight: '800',
    }

})

export default styles;
