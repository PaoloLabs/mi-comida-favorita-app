import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function RegisterScreen({ navigation }) {
    // Estados para el formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estados para manejo de errores
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Validaciones de formulario
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateForm = () => {
        let formErrors = {};

        // Validación de email
        if (!email) {
            formErrors.email = 'El email es requerido';
        } else if (!validateEmail(email)) {
            formErrors.email = 'Email inválido';
        }

        // Validación de contraseña
        if (!password) {
            formErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(password)) {
            formErrors.password = 'Debe tener 8+ caracteres, una mayúscula, minúscula, número y carácter especial';
        }

        // Validación de confirmación de contraseña
        if (!confirmPassword) {
            formErrors.confirmPassword = 'Debe confirmar la contraseña';
        } else if (password !== confirmPassword) {
            formErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleRegister = async () => {
        // Validar formulario antes de proceder
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setIsLoading(false);
            navigation.replace('Home');
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error de Registro', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text h3 style={styles.title}>Registro</Text>
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
            <Input
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                errorMessage={errors.confirmPassword}
                errorStyle={styles.errorText}
            />
            <Button
                title={isLoading ? "Registrando..." : "Registrarse"}
                onPress={handleRegister}
                containerStyle={styles.button}
                loading={isLoading}
                disabled={isLoading}
            />
            <Button
                title="Volver al Login"
                type="outline"
                onPress={() => navigation.navigate('Login')}
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