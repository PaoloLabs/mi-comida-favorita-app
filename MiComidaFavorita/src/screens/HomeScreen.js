import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        comidaFavorita: ''
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const docRef = doc(db, 'usuarios', auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProfile(docSnap.data());
            }
        } catch (error) {
            console.error('Error al cargar perfil:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await setDoc(doc(db, 'usuarios', auth.currentUser.uid), profile);
            alert('Perfil actualizado exitosamente');
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            alert('Error al actualizar perfil');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.replace('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };
    
    return (
        <View style={styles.container}>
            <Text h4 style={styles.title}>Mi Perfil</Text>
            <Input
                placeholder="Nombre"
                value={profile.nombre}
                onChangeText={(text) => setProfile({ ...profile, nombre: text })}
            />
            <Input
                placeholder="Apellido"
                value={profile.apellido}
                onChangeText={(text) => setProfile({ ...profile, apellido: text })}
            />
            <Input
                placeholder="Comida Favorita"
                value={profile.comidaFavorita}
                onChangeText={(text) => setProfile({ ...profile, comidaFavorita: text })}
            />
            <Button
                title="Actualizar Perfil"
                onPress={handleUpdate}
                containerStyle={styles.button}
            />
            <Button
                title="Cerrar Sesión"
                type="outline"
                onPress={handleSignOut}
                containerStyle={styles.button}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginVertical: 10,
    },
});