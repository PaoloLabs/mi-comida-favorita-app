import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
    // Estado para el perfil del usuario
    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        comidaFavorita: ''
    });

    // Estados de carga
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);

    // Cargar perfil al iniciar la pantalla
    useEffect(() => {
        loadProfile();
    }, []);

    // Función para cargar el perfil del usuario
    const loadProfile = async () => {
        try {
            setIsLoadingProfile(true);
            const docRef = doc(db, 'usuarios', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                // Manejar caso donde no existe el documento
                Alert.alert('Perfil no encontrado', 'No se encontró información de perfil');
            }
        } catch (error) {
            // Manejo de error con feedback visual
            Alert.alert('Error', 'No se pudo cargar el perfil', [
                { text: 'Reintentar', onPress: () => loadProfile() },
                { text: 'Cancelar' }
            ]);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    // Función para actualizar el perfil
    const handleUpdate = async () => {
        try {
            setIsUpdatingProfile(true);
            await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
            
            // Feedback de éxito
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
        } catch (error) {
            // Manejo de error con feedback visual detallado
            Alert.alert('Error', 'No se pudo actualizar el perfil', [
                { text: 'Reintentar', onPress: () => handleUpdate() },
                { text: 'Cancelar' }
            ]);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    // Función para cerrar sesión
    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            // Manejo de error con feedback visual
            Alert.alert('Error', 'No se pudo cerrar sesión', [
                { text: 'Reintentar', onPress: () => handleSignOut() },
                { text: 'Cancelar' }
            ]);
        } finally {
            setIsSigningOut(false);
        }
    };
    
    // Mostrar indicador de carga mientras se carga el perfil
    if (isLoadingProfile) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text h4 style={styles.title}>Mi Perfil</Text>
            <Input
                placeholder="Nombre"
                value={profile.nombre}
                onChangeText={(text) => setProfile({ ...profile, nombre: text })}
                disabled={isUpdatingProfile}
            />
            <Input
                placeholder="Apellido"
                value={profile.apellido}
                onChangeText={(text) => setProfile({ ...profile, apellido: text })}
                disabled={isUpdatingProfile}
            />
            <Input
                placeholder="Comida Favorita"
                value={profile.comidaFavorita}
                onChangeText={(text) => setProfile({ ...profile, comidaFavorita: text })}
                disabled={isUpdatingProfile}
            />
            
            {isUpdatingProfile ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Actualizar Perfil"
                    onPress={handleUpdate}
                    containerStyle={styles.button}
                    disabled={isUpdatingProfile}
                />
            )}
            
            {isSigningOut ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button
                    title="Cerrar Sesión"
                    type="outline"
                    onPress={handleSignOut}
                    containerStyle={styles.button}
                    disabled={isUpdatingProfile || isSigningOut}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10,
    },
});