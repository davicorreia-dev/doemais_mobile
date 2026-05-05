import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({


    containerInput: {
        flexDirection: 'column',

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
    },
    iconContainer: {
        padding: 10,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Lexend_600SemiBold',
        marginLeft: 12,
        marginBottom: 2,
    }


});

export default Styles;
