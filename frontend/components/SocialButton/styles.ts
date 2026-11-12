import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
    SocialButton: {
        backgroundColor: '#FFFFFF',
        height: 52,
        width: 230,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EFE4E5',
    },
    iconButton: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EFE4E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    iconImage: {
        width: 24,
        height: 24,
    },
    buttonIcon: {
        width: 21,
        height: 21,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },

    containerSocialButtons: {
        gap: 20,
    },


    text: {
        fontSize: 16,
        color: '#353535',
        fontWeight: '700',
    }
})

export default Styles;
