import React from 'react';
import { Text, View } from 'react-native';
import { FORM_GUTTER, FORM_MAX_WIDTH } from '../../app/utils/responsive';

type DateOfBirthInputProps = { value: string; onChange: (value: string) => void; error?: string };

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function DateOfBirthInput({ value, onChange, error }: DateOfBirthInputProps) {
    return (
        <View style={{ width: '100%', maxWidth: FORM_MAX_WIDTH, alignSelf: 'center', paddingHorizontal: FORM_GUTTER }}>
            <Text style={{ fontSize: 12, fontFamily: 'Lexend_600SemiBold', marginBottom: 2 }}>Data de Nascimento*</Text>
            {React.createElement('input', {
                type: 'date', value, max: toIsoDate(new Date()),
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
                'aria-label': 'Data de nascimento', 'aria-invalid': Boolean(error),
                style: { width: '100%', height: 48, boxSizing: 'border-box', border: `1px solid ${error ? '#E0323C' : '#E5E7EB'}`, borderRadius: 10, backgroundColor: '#FDFCFC', padding: '0 15px', color: '#000', fontSize: 16, outlineColor: '#E0323C' },
            })}
            {error ? <Text accessibilityLiveRegion="polite" style={{ color: '#E0323C', fontSize: 12, marginTop: 6 }}>{error}</Text> : null}
        </View>
    );
}
