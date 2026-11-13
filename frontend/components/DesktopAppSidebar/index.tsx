import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import styles from './styles';

type DesktopAppSidebarProps = {
    name: string;
    onNavigate: (route: 'Início' | 'Elegibilidade' | 'Carteirinha' | 'Mais') => void;
};

const items: Array<{ label: 'Início' | 'Elegibilidade' | 'Carteirinha' | 'Mais'; icon: keyof typeof Ionicons.glyphMap }> = [
    { label: 'Início', icon: 'home-outline' },
    { label: 'Elegibilidade', icon: 'clipboard-outline' },
    { label: 'Carteirinha', icon: 'card' },
    { label: 'Mais', icon: 'settings-outline' },
];

export default function DesktopAppSidebar({ name, onNavigate }: DesktopAppSidebarProps) {
    const initials = name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'D';
    return (
        <View style={styles.sidebar}>
            <View>
                <Image source={require('../../assets/images/doe-logo.png')} style={styles.logo} resizeMode="contain" />
                <View style={styles.navigation}>
                    {items.map((item) => {
                        const active = item.label === 'Carteirinha';
                        return <TouchableOpacity key={item.label} style={[styles.item, active && styles.itemActive]} onPress={() => onNavigate(item.label)} accessibilityRole="tab" accessibilityState={{ selected: active }}>
                            <Ionicons name={item.icon} size={18} color={active ? '#FFFFFF' : '#77716A'} />
                            <Text style={[styles.itemText, active && styles.itemTextActive]}>{item.label}</Text>
                        </TouchableOpacity>;
                    })}
                </View>
            </View>
            <View style={styles.profile}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
                <View style={styles.profileText}><Text style={styles.profileName} numberOfLines={1}>{name}</Text><Text style={styles.profileRole}>Doador(a)</Text></View>
                <Ionicons name="log-out-outline" size={17} color="#9A938B" />
            </View>
        </View>
    );
}
