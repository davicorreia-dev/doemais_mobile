import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({


    Container: {
        width: '100%',
        flexDirection: 'column',
        flexGrow: 1
    },
    InputContainer: {
        marginTop: 20,
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',

    },

    TitleContainer: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Lexend_600SemiBold',
        color: '#E0323C',
        textAlign: 'center',
        paddingHorizontal: 20
    },

    ContainerTerms: {
        marginTop: 40,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },


    checkbox: {
        width: 306,
        alignSelf: 'center',
        marginVertical: 10,
    },
})


export default Styles;