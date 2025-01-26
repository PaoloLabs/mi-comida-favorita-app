import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen({ navigation }) {
    // Estados para el formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estados para manejo de errores y carga
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Validaciones de formulario
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateLoginForm = () => {
        let formErrors = {};

        // Validación de email
        if (!email) {
            formErrors.email = 'El email es requerido';
        } else if (!validateEmail(email)) {
            formErrors.email = 'Formato de email inválido';
        }

        // Validación de contraseña
        if (!password) {
            formErrors.password = 'La contraseña es requerida';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleLogin = async () => {
        // Validar formulario antes de proceder
        if (!validateLoginForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
            navigation.replace('Home');
        } catch (error) {
            setIsLoading(false);

            // Mensajes de error más específicos
            switch (error.code) {
                case 'auth/invalid-credential':
                    Alert.alert(
                        'Error de Inicio de Sesión',
                        'Verifica tu correo electrónico y contraseña.'
                    );
                    break;
                case 'auth/user-not-found':
                    Alert.alert(
                        'Usuario No Encontrado',
                        'No existe una cuenta con este correo electrónico.'
                    );
                    break;
                default:
                    Alert.alert(
                        'Error de Autenticación',
                        'Ha ocurrido un problema. Intenta nuevamente.'
                    );
            }
        }
    };

    // Función para determinar si el botón debe estar deshabilitado
    const isLoginButtonDisabled = () => {
        return !validateEmail(email) || password.length === 0 || isLoading;
    };

    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>Mi Comida Favorita</Text>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                errorMessage={errors.email}
                errorStyle={styles.errorText}
            />
            <Input
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                errorMessage={errors.password}
                errorStyle={styles.errorText}
            />
            <Button
                title={isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                onPress={handleLogin}
                containerStyle={styles.button}
                disabled={isLoginButtonDisabled()}
                loading={isLoading}
            />
            <Button
                title="Registrarse"
                type="outline"
                onPress={() => navigation.navigate('Register')}
                containerStyle={styles.button}
                disabled={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
    },
});