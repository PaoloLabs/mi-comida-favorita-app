import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { validateEmail } from '../utils/Validation';
import { commonStyles } from '../styles/CommonStyles';
import { LoadingOverlay } from '../components/LoadingOverlay';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('user.test@xyz.com');
    const [password, setPassword] = useState('123456');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateLoginForm = () => {
        let formErrors = {};

        if (!email) {
            formErrors.email = 'El email es requerido';
        } else if (!validateEmail(email)) {
            formErrors.email = 'Formato de email inválido';
        }

        if (!password) {
            formErrors.password = 'La contraseña es requerida';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateLoginForm()) return;

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
            navigation.replace('Home');
        } catch (error) {
            setIsLoading(false);
            Alert.alert(
                'Error de Inicio de Sesión',
                'Verifica tu correo electrónico y contraseña.'
            );
            console.log('Error:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={commonStyles.container}>
            <LoadingOverlay visible={isLoading} />
            <Text h3 style={commonStyles.title}>Mi Comida Favorita</Text>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                errorMessage={errors.email}
                errorStyle={commonStyles.errorText}
            />
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                errorMessage={errors.password}
                errorStyle={commonStyles.errorText}
            />
            <Button
                title="Iniciar Sesión"
                onPress={handleLogin}
                containerStyle={commonStyles.button}
                disabled={isLoading}
            />
            <Button
                title="Registrarse"
                type="outline"
                onPress={() => navigation.navigate('Register')}
                containerStyle={commonStyles.button}
                disabled={isLoading}
            />
        </View>
    );
}