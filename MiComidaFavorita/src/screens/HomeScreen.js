import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { commonStyles } from '../styles/CommonStyles';
import { LoadingOverlay } from '../components/LoadingOverlay';

export default function HomeScreen({ navigation }) {
    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        comidaFavorita: ''
    });

    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setIsLoadingProfile(true);
            const docRef = doc(db, 'usuarios', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProfile(docSnap.data());
            } else {
                Alert.alert('Perfil no encontrado', 'No se encontró información de perfil');
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo cargar el perfil', [
                { text: 'Reintentar', onPress: () => loadProfile() },
                { text: 'Cancelar' }
            ]);
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleUpdate = async () => {
        setErrorMessage('');
        
        if (!profile.nombre || !profile.apellido || !profile.comidaFavorita) {
            setErrorMessage('Todos los campos son obligatorios');
            return;
        }

        try {
            setIsUpdatingProfile(true);
            await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el perfil', [
                { text: 'Reintentar', onPress: () => handleUpdate() },
                { text: 'Cancelar' }
            ]);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión', [
                { text: 'Reintentar', onPress: () => handleSignOut() },
                { text: 'Cancelar' }
            ]);
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <View style={commonStyles.container}>
            <LoadingOverlay visible={isLoadingProfile || isUpdatingProfile || isSigningOut} />
            <Text h4 style={commonStyles.title}>Mi Perfil</Text>
            {errorMessage && <Text style={commonStyles.errorText}>{errorMessage}</Text>}
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

            <Button
                title="Actualizar Perfil"
                onPress={handleUpdate}
                containerStyle={commonStyles.button}
                disabled={isUpdatingProfile}
            />
            <Button
                title="Cerrar Sesión"
                type="outline"
                onPress={handleSignOut}
                containerStyle={commonStyles.button}
                disabled={isSigningOut || isUpdatingProfile}
            />
        </View>
    );
}