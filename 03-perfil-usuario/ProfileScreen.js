import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../core/firebase";
import { useAuth } from "../core/AuthContext";
import { styles, colors } from "../core/theme";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [curso, setCurso] = useState("");
  const [bio, setBio] = useState("");

  const carregar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "usuarios", user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setNome(d.nome ?? user.displayName ?? "");
        setTelefone(d.telefone ?? "");
        setCurso(d.curso ?? "");
        setBio(d.bio ?? "");
      } else {
        setNome(user.displayName ?? "");
        setTelefone("");
        setCurso("");
        setBio("");
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );
  
  async function salvar() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome não pode ficar vazio.");
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          nome: nome.trim(),
          email: user.email,
          telefone: telefone.trim(),
          curso: curso.trim(),
          bio: bio.trim(),
          atualizadoEm: serverTimestamp(),
        },
        { merge: true }
      );
      Alert.alert("Pronto", "Perfil atualizado com sucesso.");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  function excluir() {
    Alert.alert(
      "Excluir dados do perfil",
      "Isso apagará suas informações de perfil no banco de dados. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "usuarios", user.uid));
              setNome(user.displayName ?? "");
              setTelefone("");
              setCurso("");
              setBio("");
              Alert.alert("Excluído", "Os dados do perfil foram removidos.");
            } catch (e) {
              Alert.alert("Erro", "Não foi possível excluir o perfil.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: 20, gap: 16 }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={carregar} />}
    >
      <View style={{ alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 34, fontWeight: "800" }}>
            {(nome || "?").trim().charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={{ fontSize: 13, color: colors.muted }}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Field label="Nome completo" value={nome} onChangeText={setNome} placeholder="Seu nome" />
        <Field
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
        />
        <Field label="Curso" value={curso} onChangeText={setCurso} placeholder="Ex.: Ciência da Computação" />
        <Field
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Fale um pouco sobre você"
          multiline
        />
      </View>

      <TouchableOpacity
        style={[styles.button, saving && { opacity: 0.7 }]}
        onPress={salvar}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar alterações</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.buttonDanger]} onPress={excluir}>
        <Text style={styles.buttonText}>Excluir dados do perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline} onPress={logout}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="log-out-outline" size={18} color={colors.primary} />
          <Text style={styles.buttonOutlineText}>Sair da conta</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, multiline, ...props }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 90, textAlignVertical: "top" }]}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}
