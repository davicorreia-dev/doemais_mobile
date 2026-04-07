import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    header: {
        minHeight: 200,
        paddingHorizontal: 10,
        marginTop: 30,
        justifyContent: 'flex-start',
        width: '100%',

    },

    iconBack: {
        marginTop: 10,
        marginLeft: 5,
    },

    textContainer: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 5,
        flex: 1,
        flexDirection: 'column',
    },

    title: {
        fontSize: 20,
        marginLeft: 10,
        alignSelf: 'flex-start',
        color: '#E0323C',
        fontFamily: 'Lexend_600SemiBold'

    },

    subtitle: {
        fontSize: 15,
        color: 'black',
        marginLeft: 10,
        fontFamily: 'Lexend_500Medium',
        flexWrap: 'wrap',
    },
});


export default Styles;