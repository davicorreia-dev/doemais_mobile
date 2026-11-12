import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = { color: string };

/**
 * No SDK 54+ o Android é sempre edge-to-edge e o StatusBar do RN não aceita mais
 * `backgroundColor`/`translucent`. Este componente pinta a área da status bar.
 */
export default function StatusBarBackground({ color }: Props) {
    const insets = useSafeAreaInsets();
    return (
        <View
            pointerEvents="none"
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: insets.top, backgroundColor: color, zIndex: 999 }}
        />
    );
}
