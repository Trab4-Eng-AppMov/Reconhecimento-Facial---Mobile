import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../core/firebase";
import { styles, colors } from "../core/theme";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !senha) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
    } catch (e) {
      Alert.alert("Não foi possível entrar", traduzErro(e.code));
    } finally {
      setLoading(false);
    }
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

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={{ flexDirection: "row", justifyContent: "center", gap: 6 }}>
            <Text style={{ color: colors.muted }}>Não tem conta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function traduzErro(code) {
  switch (code) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente mais tarde.";
    default:
      return "Verifique seus dados e a conexão com a internet.";
  }
}
