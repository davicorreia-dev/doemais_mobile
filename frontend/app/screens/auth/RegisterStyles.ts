import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({


    Container: {
        width: '100%',
        flexDirection: 'column',
        flexGrow: 1
    },
    InputContainer: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        gap: 20

    },

    Imagelogo: {
        marginTop: 40,
        marginBottom: 40,
        alignSelf: 'center',
        width: 211.03,
        height: 60,
        resizeMode: 'contain',
    },
    ContainerTerms: {
        marginTop: 40,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    ButtonCreate: {
        marginTop: 40,
        alignItems: 'center',
        alignSelf: 'center',
    }

})


export default Styles;