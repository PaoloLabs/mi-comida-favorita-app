import React, { useState, useEffect } from 'react';
import { View, Alert, Image, TouchableOpacity } from 'react-native';
import { Input, Button, Text } from 'react-native-elements';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { commonStyles } from '../styles/CommonStyles';
import { LoadingOverlay } from '../components/LoadingOverlay';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function HomeScreen({ navigation }) {
    const [profile, setProfile] = useState({
        nombre: '',
        apellido: '',
        comidaFavorita: '',
        profilePhoto: ''
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

    const compressImage = async (uri) => {
        try {
            // Compress and resize image
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [
                    { resize: { width: 800 } } // Resize to max width of 800px
                ],
                {
                    compress: 0.5,  // Reduce quality to 50%
                    format: ImageManipulator.SaveFormat.JPEG
                }
            );

            // Convert compressed image to base64
            const base64Image = await fetch(manipulatedImage.uri).then(r => r.blob()).then(blob => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            });

            return base64Image;
        } catch (error) {
            console.error('Image compression error:', error);
            return null;
        }
    };

    const pickImage = async (fromCamera = false) => {
        try {
            let result;
            if (fromCamera) {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                });
            }

            if (!result.canceled) {
                const compressedImage = await compressImage(result.assets[0].uri);

                if (compressedImage) {
                    setProfile(prev => ({
                        ...prev,
                        profilePhoto: compressedImage
                    }));
                } else {
                    Alert.alert('Error', 'No se pudo comprimir la imagen');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
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

            {/* Profile Photo Section */}
            <TouchableOpacity onPress={() => {
                Alert.alert(
                    'Seleccionar Foto',
                    'Elige una opción',
                    [
                        {
                            text: 'Galería',
                            onPress: () => pickImage(false)
                        },
                        {
                            text: 'Cámara',
                            onPress: () => pickImage(true)
                        },
                        {
                            text: 'Cancelar',
                            style: 'cancel'
                        }
                    ]
                )
            }}>
                {profile.profilePhoto ? (
                    <Image
                        source={{ uri: profile.profilePhoto }}
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 75,
                            alignSelf: 'center',
                            marginBottom: 20
                        }}
                    />
                ) : (
                    <View style={{
                        width: 150,
                        height: 150,
                        borderRadius: 75,
                        backgroundColor: '#e1e1e1',
                        alignSelf: 'center',
                        marginBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text>Agregar Foto</Text>
                    </View>
                )}
            </TouchableOpacity>

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