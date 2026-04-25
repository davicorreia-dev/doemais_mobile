import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDFCFC',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#360C0E',
        fontFamily: 'Lexend_600SemiBold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Lexend_400Regular',
        lineHeight: 20,
    },
    containerTitle: {
        paddingHorizontal: 30,
    },
    imageContainer: {
        alignSelf: 'center',
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#F0F0F0',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 50,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        color: '#999',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#E0323C',
        paddingVertical: 18,
        borderRadius: 30,
        alignSelf: "center",
        width: '85%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    removeimage: {
        color: '#E0323C',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    }
});

export default Styles;