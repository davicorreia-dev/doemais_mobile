import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../Input';

type DateOfBirthInputProps = { value: string; onChange: (value: string) => void; error?: string };

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseLocalDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date();
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const formatDate = (value: string) => value ? value.split('-').reverse().join('/') : '';

export default function DateOfBirthInput({ value, onChange, error }: DateOfBirthInputProps) {
    const [open, setOpen] = useState(false);
    return (
        <View>
            <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.8}>
                <View pointerEvents="none">
                    <Input label="Data de Nascimento*" placeholder="DD/MM/AAAA" value={formatDate(value)} error={error} />
                </View>
            </TouchableOpacity>
            {open && <DateTimePicker value={parseLocalDate(value)} mode="date" display="default" maximumDate={new Date()} onChange={(event, selectedDate) => {
                setOpen(false);
                if (event.type !== 'dismissed' && selectedDate) onChange(toIsoDate(selectedDate));
            }} />}
        </View>
    );
}
