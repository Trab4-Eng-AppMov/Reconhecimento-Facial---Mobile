import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, colors } from "../core/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    Alert.alert(
      "Etapa 1 concluída",
      "A tela de login está pronta! Na Etapa 2 este botão fará o login de verdade com o Firebase."
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={{ padding: 24, gap: 18 }}>
          <View style={{ alignItems: "center", marginBottom: 8 }}>
            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="scan-circle-outline" size={56} color="#fff" />
            </View>
            <Text style={[styles.title, { marginTop: 14 }]}>Reconhecimento Facial</Text>
            <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
          </View>

          <View>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="voce@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.muted}
            />
          </View>

          <View>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholderTextColor={colors.muted}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={{ color: colors.muted }}>Não tem conta?</Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Em breve", "O cadastro será adicionado na Etapa 2.")}
            >
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
