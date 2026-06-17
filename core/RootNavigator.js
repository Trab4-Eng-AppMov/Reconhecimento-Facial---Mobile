import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";

import { useAuth } from "./AuthContext";
import { colors, styles } from "./theme";

import LoginScreen from "../01-autenticacao/LoginScreen";
import RegisterScreen from "../02-cadastro-usuario/RegisterScreen";

const Stack = createNativeStackNavigator();


function BoasVindas() {
  const { user, logout } = useAuth();
  return (
    <View style={[styles.centered, { padding: 24 }]}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={[styles.subtitle, { textAlign: "center", marginTop: 8 }]}>
        Login realizado com: {user?.email}
        {"\n\n"}As telas de Perfil e Reconhecimento Facial chegam nas próximas etapas.
      </Text>
      <TouchableOpacity style={[styles.buttonOutline, { marginTop: 24 }]} onPress={logout}>
        <Text style={styles.buttonOutlineText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <BoasVindas />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
