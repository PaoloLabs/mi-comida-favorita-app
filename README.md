# mi-comida-favorita-app
 Aplicacion para Firebase - React Native

# Mi Comida Favorita 🍽️

## Descripción del Proyecto

Una aplicación móvil de perfil de usuario que permite el registro su comida favorita, tambien se agrega una foto desde la galeria o usando la camara, inicio de sesión y gestión de información personal con funcionalidades de autenticación y actualización de perfil.

## Características Principales

- 🔐 Autenticación de usuarios (Registro e Inicio de Sesión)
- 👤 Perfil de usuario personalizable
- 📸 Carga y selección de foto de perfil o comida favorita
- 🛡️ Validaciones de formulario robustas
- 📱 Experiencia móvil completamente responsiva

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- React Native CLI
- Dispositivo iOS o Android, o emulador

## Instalación

### Clonar el Repositorio

```bash
git clone https://github.com/PaoloLabs/mi-comida-favorita.git
cd MiComidaFavorita
```

### Instalar Dependencias

```bash
npm install
# o
yarn install
```

### Configuración de Firebase

1. Crear un proyecto en Firebase Console
2. Agregar configuración de Firebase en `src/config/firebase.js`
3. Habilitar Autenticación por Email/Contraseña
4. Configurar Firestore Database

### Ejecutar la Aplicación
#### Expo
```bash
npx expo start
```

Una vez iniciada la app tienes un menu donde puedes escoger la plataforma que quieres correr

```bash

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands
```

## Mejoras Implementadas

### 1. Sistema de Autenticación
- Registro de usuarios con validación de email
- Inicio de sesión seguro
- Manejo de errores de autenticación
- Validación de contraseña robusta

### 2. Gestión de Perfil de Usuario
- Actualización de información personal (perfil, nombre, apellido, comida favorita) 
- Carga de foto de perfil
- Compresión y optimización de imágenes
- Almacenamiento en Firestore

### 3. Validaciones de Formulario
- Validación en tiempo real
- Mensajes de error descriptivos
- Validaciones de email y contraseña
- Prevención de envío de formularios inválidos

### 4. Gestión de Estado y Rendimiento
- Manejo de estados de carga
- Overlay de carga durante operaciones asíncronas
- Desactivación de botones durante procesos
- Feedback visual para el usuario

### 5. Seguridad
- Validación de entrada de usuario
- Comprobaciones de longitud y complejidad de contraseña

## Estructura del Proyecto

```
/src
├── /components
│   └── LoadingOverlay.js      # Componente de carga
├── /config
│   └── firebase.js            # Configuración de Firebase
├── /screens
│   ├── LoginScreen.js         # Pantalla de inicio de sesión
│   ├── RegisterScreen.js      # Pantalla de registro
│   └── HomeScreen.js          # Pantalla de perfil de usuario
├── /styles
│   └── CommonStyles.js        # Estilos comunes
├── /utils
│   └── Validation.js          # Utilidades de validación
└── /navigation
    └── AppNavigator.js        # Configuración de navegación
```

## Tecnologías Utilizadas

- React Native
- Firebase Authentication
- Firestore
- react-native-elements
- expo-image-picker
- expo-image-manipulator

## A considerar

- Para el caso de imagenes no pudimos usar firebase/storage por que no es posible con el plan gratuito pero fue posible haciendo compresion de imagenes con firestore.

## Demo

https://github.com/user-attachments/assets/b961c1a9-fa01-4a97-8838-5f8286531692

## Capturas de Pantalla

### Pantalla de Inicio de Sesión
![simulator_screenshot_493A6882-1E33-4FEE-98E1-4A4453A60799](https://github.com/user-attachments/assets/3c7af541-d5e3-4322-b456-b995664b4df6)
![simulator_screenshot_DB02DB7B-5244-49D1-946B-A6B07A522E94](https://github.com/user-attachments/assets/a923fbd6-2052-4d3a-ac4e-f57b4b863b47)

### Pantalla de Registro
![simulator_screenshot_505BDDA4-C435-485A-98F4-BCFC461329DE](https://github.com/user-attachments/assets/bf35a7da-7ed6-438f-8afc-41d704eb19de)
![simulator_screenshot_158493EA-FAFC-43EF-B0E1-3928155CA7E6](https://github.com/user-attachments/assets/4ccd8915-cb49-4a14-b698-72ba2d05c4d7)


### Pantalla de Perfil
![simulator_screenshot_95ADAF2C-0792-4E8E-9B7C-E38AC9436BF9](https://github.com/user-attachments/assets/6547d05f-a59d-4dfc-b329-2acfcc52bd0a)
![simulator_screenshot_4D4D7BE3-F430-408D-BA3A-41AB0B279C08](https://github.com/user-attachments/assets/9af0b0fc-1598-40f5-a2d0-d89b0ce7f530)


## Próximos Pasos

- [ ] Implementar recuperación de contraseña
- [ ] Añadir autenticación con Google/Apple
- [ ] Mejorar diseño y experiencia de usuario
- [ ] Implementar internacionalización

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

PaoloLabs - paololabsplus@gmail.com
