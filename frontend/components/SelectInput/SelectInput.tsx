import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet
} from 'react-native';
import { formColumn } from '../../app/utils/responsive';

interface Option {
    label: string;
    value: string;
}

interface SelectInputProps {
    label: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

export default function SelectInput({ label, options, value, onChange }: SelectInputProps) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            < TouchableOpacity style={styles.input} onPress={() => setOpen(true)
            }>
                <Text style={{ color: value ? '#000' : '#999' }}>
                    {value || 'Selecione...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#353535" />
            </TouchableOpacity>

            < Modal visible={open} transparent animationType="fade" >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setOpen(false)}
                >
                    <View style={styles.dropdown}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.option}
                                    onPress={() => {
                                        onChange(item.value);
                                        setOpen(false);
                                    }}
                                >
                                    <Text>{item.label} </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // Mesma coluna do Input e do botão principal
        ...formColumn,
    },
    input: {
        height: 48,
        marginVertical: 8,
        borderWidth: 0.1,
        backgroundColor: '#FDFCFC',
        width: '100%',
        borderRadius: 10,
        elevation: 5,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    icon: {
        fontSize: 18,
        color: '#666'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20
    },
    dropdown: {
        backgroundColor: '#FDFCFC',
        borderRadius: 10,
        maxHeight: 300,
        elevation: 5,
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },

    label: {
        fontSize: 12,
        fontFamily: 'Lexend_600SemiBold',
        marginBottom: 2,
        color: '#353535',
        alignSelf: 'flex-start',
    }
});