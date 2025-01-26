import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { validateEmail, validatePassword } from '../utils/Validation';
import { commonStyles } from '../styles/CommonStyles';
import { LoadingOverlay } from '../components/LoadingOverlay';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateRegisterForm = () => {
        let formErrors = {};

        if (!email) {
            formErrors.email = 'El email es requerido';
        } else if (!validateEmail(email)) {
            formErrors.email = 'Formato de email inválido';
        }

        if (!password) {
            formErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(password)) {
            formErrors.password = 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateRegisterForm()) return;

        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert(
                'Registro Exitoso',
                'Tu cuenta ha sido creada correctamente.',
                [
                    { text: 'OK', onPress: () => navigation.replace('Login') },
                ]
            );
        } catch (error) {
            setIsLoading(false); // Asegura que el overlay se cierre antes del Alert
            Alert.alert(
                'Error de Registro',
                'No se pudo crear la cuenta. Inténtalo de nuevo.',
                [
                    { text: 'OK', onPress: () => console.log('Alerta cerrada') },
                ]
            );
            console.log('Error:', error.message); // Depura el mensaje del error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={commonStyles.container}>
            <LoadingOverlay visible={isLoading} />
            <Text h3 style={commonStyles.title}>Registro</Text>
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
                title="Registrar"
                onPress={handleRegister}
                containerStyle={commonStyles.button}
                disabled={isLoading}
            />
            <Button
                title="Volver"
                type="outline"
                onPress={() => navigation.navigate('Login')}
                containerStyle={commonStyles.button}
                disabled={isLoading}
            />
        </View>
    );
}