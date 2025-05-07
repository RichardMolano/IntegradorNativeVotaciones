# Paso a paso para crear el proyecto:

# Crea el proyecto con TypeScript

npx create-expo-app mi-proyecto-expo-ts -t expo-template-blank-typescript

# Esto va a crear una carpeta llamada mi-proyecto-expo-ts con TypeScript preconfigurado.

# abrir el proyecto en la terminal VSCode

cd mi-proyecto-expo-ts

# Ejecutar el proyecto

npm start

# archivos iniciales del proyecto

mi-proyecto-expo-ts/
Ôö£ÔöÇÔöÇ App.tsx ÔåÉ Archivo principal de la app
Ôö£ÔöÇÔöÇ tsconfig.json ÔåÉ Configuraci├│n de TypeScript
Ôö£ÔöÇÔöÇ app.json ÔåÉ Configuraci├│n del proyecto Expo
Ôö£ÔöÇÔöÇ assets/ ÔåÉ Im├ígenes y recursos est├íticos
ÔööÔöÇÔöÇ ...

# resumen de la estructura del proyecto:

mi-proyecto-expo-ts/
Ôö£ÔöÇÔöÇ App.tsx
Ôö£ÔöÇÔöÇ app/ ÔåÉ Navegaci├│n (React Navigation)
Ôöé ÔööÔöÇÔöÇ navigation.tsx
Ôö£ÔöÇÔöÇ components/ ÔåÉ Componentes reutilizables
Ôöé ÔööÔöÇÔöÇ Header.tsx
Ôö£ÔöÇÔöÇ constants/ ÔåÉ Constantes como colores, textos, rutas
Ôöé ÔööÔöÇÔöÇ colors.ts
Ôö£ÔöÇÔöÇ hooks/ ÔåÉ Hooks personalizados (custom hooks)
Ôöé ÔööÔöÇÔöÇ useCounter.ts
Ôö£ÔöÇÔöÇ screens/ ÔåÉ Vistas o pantallas
Ôöé Ôö£ÔöÇÔöÇ HomeScreen.tsx
Ôöé ÔööÔöÇÔöÇ ProductScreen.tsx
Ôö£ÔöÇÔöÇ assets/ ÔåÉ Im├ígenes, fuentes, sonidos
Ôö£ÔöÇÔöÇ tsconfig.json
Ôö£ÔöÇÔöÇ package.json
Ôö£ÔöÇÔöÇ app.json

# estructura formal del proyecto

MI-PROYECTO-EXPO-TS/
Ôöé
Ôö£ÔöÇÔöÇ .expo/ # Archivos internos de Expo (ocultos por defecto)
Ôö£ÔöÇÔöÇ app/
Ôöé Ôö£ÔöÇÔöÇ navigation.tsx # Archivo para configurar la navegaci├│n (React Navigation)
Ôöé Ôö£ÔöÇÔöÇ assets/ # Carpeta para im├ígenes, ├¡conos, etc.
Ôöé Ôö£ÔöÇÔöÇ constants/ # Constantes reutilizables (colores, estilos, etc.)
Ôöé Ôö£ÔöÇÔöÇ node_modules/ # M├│dulos instalados con npm
Ôöé ÔööÔöÇÔöÇ screens/ # Pantallas de la aplicaci├│n
Ôöé Ôö£ÔöÇÔöÇ HomeScreen.tsx # Pantalla de inicio
Ôöé Ôö£ÔöÇÔöÇ InventoryScreen.tsx # Pantalla para el inventario
Ôöé Ôö£ÔöÇÔöÇ ProductScreen.tsx # Pantalla para productos
Ôöé Ôö£ÔöÇÔöÇ ProfileScreen.tsx # Pantalla de perfil de usuario
Ôöé
Ôö£ÔöÇÔöÇ .gitignore # Archivos y carpetas a ignorar por Git
Ôö£ÔöÇÔöÇ app.json # Configuraci├│n general del proyecto Expo
Ôö£ÔöÇÔöÇ App.tsx # Componente ra├¡z de la aplicaci├│n
Ôö£ÔöÇÔöÇ index.ts # Punto de entrada principal
Ôö£ÔöÇÔöÇ package-lock.json # Versi├│n exacta de dependencias instaladas
Ôö£ÔöÇÔöÇ package.json # Dependencias y scripts del proyecto
Ôö£ÔöÇÔöÇ readme.md # Documentaci├│n del proyecto
ÔööÔöÇÔöÇ tsconfig.json # Configuraci├│n del compilador TypeScript

# Configurar la navegaci├│n (React Navigation)

npx expo install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-navigation/native-stack
npx expo install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons

# Styles

npm create gluestack@latest

# nesesario??

npm install -g expo-cli
