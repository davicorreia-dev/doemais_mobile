import { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordCodeScreen: React.FC = () => {
  const navigation = useNavigation();

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [timer, setTimer] = useState<number>(120);
  
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  
  const formatTime = (): string => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleInputChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (event.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleResendCode = (): void => {
    Alert.alert('Código Reenviado', 'Um novo código foi enviado para o seu e-mail.');
    setTimer(120);
    setOtp(['', '', '', '']);
    inputRefs.current[0].focus();
  };

  const handleConfirmCode = (): void => {
    const enteredCode = otp.join('');
    if (enteredCode.length !== 4) {
      Alert.alert('Erro', 'Por favor, insira o código de 4 dígitos.');
      return;
    }
    Alert.alert('Sucesso', `Código "${enteredCode}" validado!`);
    navigation.navigate("PasswordResetSuccessScreen" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>  
        {/* Logo */}
        <Image
          source={require('../../../assets/images/logoDoe.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.instructionText}>
          Enviamos um código de redefinição ao seu e-mail. Insira o código de{' '}
          <Text style={styles.boldText}>4 dígitos</Text> recebido.
        </Text>

        {/* Inputs do Código OTP */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              onChangeText={(text) => handleInputChange(text, index)}
              onKeyPress={(event) => handleBackspace(event, index)}
              value={digit}
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          Caso não tenha recebido o código,{' '}
            <Text style={[styles.resendLink, timer > 0 && styles.disabledLink]}
              onPress={handleResendCode}
              disabled={timer > 0}
              >
              toque aqui para reenviá-lo.
            </Text>
        </Text>

        {timer > 0 && (
          <Text style={styles.timerText}>
            Validado por 4 minutos ({formatTime()})
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmCode}>
          <Text style={styles.confirmButtonText}>Confirmar código</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfcfc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 100,
    marginVertical: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#D92E2E',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resendLink: {
    color: '#D92E2E',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  disabledLink: {
    color: '#999',
    textDecorationLine: 'none',
  },
  timerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
  },
  confirmButton: {
    backgroundColor: '#D92E2E',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordCodeScreen;