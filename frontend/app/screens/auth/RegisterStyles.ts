import { StyleSheet } from "react-native";
import { formColumn } from "../../utils/responsive";

const Styles = StyleSheet.create({
    Container: {
        width: '100%',
        flexDirection: 'column',
        flexGrow: 1
    },
    InputContainer: {
        marginTop: 15,
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
    },

    HeaderTitle: {
        fontSize: 26,
        fontFamily: 'Lexend_700Bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },

    requiredHint: {
        fontSize: 12,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
    },

    HeaderSubtitle: {
        fontSize: 14,
        fontFamily: 'Lexend_400Regular',
        color: '#666666',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 20,
    },

    progressTrack: {
        marginTop: 16,
        height: 8,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        borderRadius: 999,
        overflow: 'hidden',
        backgroundColor: '#F2D5D7',
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#E0323C',
    },

    ContainerTerms: {
        marginTop: 40,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    checkbox: {
        ...formColumn,
        marginVertical: 10,
    },
})

export default Styles;
