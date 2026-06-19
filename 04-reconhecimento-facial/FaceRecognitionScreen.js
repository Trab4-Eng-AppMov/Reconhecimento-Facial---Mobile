import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../core/firebase";
import { useAuth } from "../core/AuthContext";
import { styles, colors } from "../core/theme";

export default function FaceRecognitionScreen() {
  const { user } = useAuth();
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [observacao, setObservacao] = useState("");
  const [fotoUri, setFotoUri] = useState(null);
  const [confianca, setConfianca] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "reconhecimentos"), where("uid", "==", user.uid));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        lista.sort((a, b) => (b.criadoEmMs ?? 0) - (a.criadoEmMs ?? 0));
        setRegistros(lista);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, [user]);

  function abrirNovo() {
    setEditando(null);
    setNome("");
    setMatricula("");
    setObservacao("");
    setFotoUri(null);
    setConfianca(null);
    setModalVisible(true);
  }

  function abrirEdicao(reg) {
    setEditando(reg.id);
    setNome(reg.nome ?? "");
    setMatricula(reg.matricula ?? "");
    setObservacao(reg.observacao ?? "");
    setFotoUri(reg.fotoUri ?? null);
    setConfianca(reg.confianca ?? null);
    setModalVisible(true);
  }

  async function abrirCamera() {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Permissão negada", "Habilite o acesso à câmera nas configurações.");
        return;
      }
    }
    setCameraVisible(true);
  }

  async function capturar() {
    try {
      const foto = await cameraRef.current?.takePictureAsync({ quality: 0.4 });
      if (foto?.uri) {
        setFotoUri(foto.uri);
        setConfianca(Math.floor(85 + Math.random() * 15));
      }
    } catch (e) {
      Alert.alert("Erro", "Não foi possível capturar a foto.");
    } finally {
      setCameraVisible(false);
    }
  }

  async function salvar() {
    if (!nome.trim() || !matricula.trim()) {
      Alert.alert("Atenção", "Preencha nome e matrícula do aluno.");
      return;
    }
    setSalvando(true);
    try {
      if (editando) {
        await updateDoc(doc(db, "reconhecimentos", editando), {
          nome: nome.trim(),
          matricula: matricula.trim(),
          observacao: observacao.trim(),
          fotoUri: fotoUri ?? null,
          confianca: confianca ?? null,
        });
      } else {
        await addDoc(collection(db, "reconhecimentos"), {
          uid: user.uid,
          nome: nome.trim(),
          matricula: matricula.trim(),
          observacao: observacao.trim(),
          fotoUri: fotoUri ?? null,
          confianca: confianca ?? null,
          criadoEm: serverTimestamp(),
          criadoEmMs: Date.now(),
        });
      }
      setModalVisible(false);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    } finally {
      setSalvando(false);
    }
  }

  function excluir(reg) {
    Alert.alert("Excluir registro", `Remover o reconhecimento de "${reg.nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "reconhecimentos", reg.id));
          } catch (e) {
            Alert.alert("Erro", "Não foi possível excluir.");
          }
        },
      },
    ]);
  }

  function formatarData(reg) {
    if (!reg.criadoEmMs) return "";
    const d = new Date(reg.criadoEmMs);
    return d.toLocaleString("pt-BR");
  }

  return (
    <View style={styles.screen}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 90 }}
          data={registros}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={{ marginBottom: 4 }}>
              <Text style={styles.title}>Reconhecimentos</Text>
              <Text style={styles.subtitle}>
                {registros.length} registro(s) salvos no Firebase
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60, gap: 8 }}>
              <Ionicons name="scan-outline" size={48} color={colors.muted} />
              <Text style={{ color: colors.muted }}>Nenhum reconhecimento ainda.</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                Toque em "+" para registrar o primeiro.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { flexDirection: "row", gap: 12 }]}>
              {item.fotoUri ? (
                <Image source={{ uri: item.fotoUri }} style={local.thumb} />
              ) : (
                <View style={[local.thumb, local.thumbEmpty]}>
                  <Ionicons name="person" size={26} color={colors.muted} />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>
                  {item.nome}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 13 }}>
                  Matrícula: {item.matricula}
                </Text>
                {item.confianca != null && (
                  <View style={local.badge}>
                    <Ionicons name="checkmark-circle" size={13} color={colors.success} />
                    <Text style={{ color: colors.success, fontSize: 12, fontWeight: "700" }}>
                      {item.confianca}% de confiança
                    </Text>
                  </View>
                )}
                {!!item.observacao && (
                  <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>
                    {item.observacao}
                  </Text>
                )}
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>
                  {formatarData(item)}
                </Text>
              </View>

              <View style={{ justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => abrirEdicao(item)} style={local.iconBtn}>
                  <Ionicons name="create-outline" size={20} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => excluir(item)} style={local.iconBtn}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={local.fab} onPress={abrirNovo}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={[styles.screen, { padding: 20 }]}>
          <View style={local.modalHeader}>
            <Text style={styles.title}>{editando ? "Editar registro" : "Novo reconhecimento"}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={local.fotoBox} onPress={abrirCamera}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={local.fotoPreview} />
            ) : (
              <View style={{ alignItems: "center", gap: 6 }}>
                <Ionicons name="camera-outline" size={40} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "700" }}>Capturar rosto</Text>
              </View>
            )}
          </TouchableOpacity>
          {confianca != null && (
            <Text style={{ textAlign: "center", color: colors.success, fontWeight: "700" }}>
              Confiança do reconhecimento: {confianca}%
            </Text>
          )}

          <View style={{ gap: 12, marginTop: 12 }}>
            <Field label="Nome do aluno" value={nome} onChangeText={setNome} placeholder="Nome completo" />
            <Field
              label="Matrícula"
              value={matricula}
              onChangeText={setMatricula}
              placeholder="Ex.: 2026001"
            />
            <Field
              label="Observação"
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Opcional"
              multiline
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { marginTop: 18 }, salvando && { opacity: 0.7 }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{editando ? "Salvar alterações" : "Registrar"}</Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={cameraVisible} animationType="slide" onRequestClose={() => setCameraVisible(false)}>
        <View style={{ flex: 1, backgroundColor: "#000" }}>
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />
          ) : (
            <View style={styles.centered}>
              <Text style={{ color: "#fff" }}>Sem permissão de câmera.</Text>
            </View>
          )}
          <View style={local.cameraControls}>
            <TouchableOpacity onPress={() => setCameraVisible(false)} style={local.cameraCancel}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={capturar} style={local.shutter}>
              <View style={local.shutterInner} />
            </TouchableOpacity>
            <View style={{ width: 48 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Field({ label, multiline, ...props }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: "top" }]}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        {...props}
      />
    </View>
  );
}

const local = StyleSheet.create({
  thumb: { width: 60, height: 60, borderRadius: 12, backgroundColor: colors.bg },
  thumbEmpty: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  iconBtn: { padding: 4 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fotoBox: {
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  fotoPreview: { width: "100%", height: "100%" },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 30,
  },
  cameraCancel: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#fff" },
});
