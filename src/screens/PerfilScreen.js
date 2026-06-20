import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Title, Card, Avatar } from 'react-native-paper';
import firebase from '../firebaseConfig';

export default function PerfilScreen() {
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);

  const usuario = firebase.auth().currentUser;

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    try {
      const doc = await firebase.firestore().collection('usuarios').doc(usuario.uid).get();
      if (doc.exists) {
        const dados = doc.data();
        setNome(dados.nome || '');
        setFoto(dados.foto || '');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  async function salvarPerfil() {
    if (!nome) {
      Alert.alert('Erro', 'O nome não pode ser vazio.');
      return;
    }
    setLoading(true);
    try {
      await firebase.firestore().collection('usuarios').doc(usuario.uid).update({
        nome,
        foto,
      });
      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza que deseja excluir sua conta? Essa ação é irreversível.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: excluirConta },
      ]
    );
  }

  async function excluirConta() {
    setLoading(true);
    try {
      await firebase.firestore().collection('usuarios').doc(usuario.uid).delete();
      await usuario.delete();
    } catch (error) {
      Alert.alert('Erro', error.message);
      setLoading(false);
    }
  }

  function sair() {
    firebase.auth().signOut();
  }

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.titulo}>Meu Perfil</Title>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Avatar.Text
            size={64}
            label={nome ? nome[0].toUpperCase() : '?'}
            style={styles.avatar}
          />
          <Text style={styles.email}>{usuario?.email}</Text>
        </Card.Content>
      </Card>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
        disabled={!editando}
      />

      <TextInput
        label="URL da Foto (opcional)"
        value={foto}
        onChangeText={setFoto}
        style={styles.input}
        mode="outlined"
        disabled={!editando}
      />

      {editando ? (
        <View style={styles.botoesEdicao}>
          <Button
            mode="contained"
            onPress={salvarPerfil}
            loading={loading}
            disabled={loading}
            style={[styles.botao, { flex: 1, marginRight: 8 }]}
          >
            Salvar
          </Button>
          <Button
            mode="outlined"
            onPress={() => setEditando(false)}
            disabled={loading}
            style={{ flex: 1 }}
          >
            Cancelar
          </Button>
        </View>
      ) : (
        <Button
          mode="contained"
          onPress={() => setEditando(true)}
          style={styles.botao}
        >
          Editar Perfil
        </Button>
      )}

      <Button
        mode="outlined"
        onPress={sair}
        style={styles.botaoSair}
        textColor="#e53935"
      >
        Sair
      </Button>

      <Button
        mode="text"
        onPress={confirmarExclusao}
        textColor="#999"
        style={styles.botaoExcluir}
      >
        Excluir Conta
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 20,
    color: '#e53935',
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    backgroundColor: '#e53935',
    marginBottom: 8,
  },
  email: {
    color: '#666',
    fontSize: 14,
  },
  input: {
    marginBottom: 12,
  },
  botoesEdicao: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 12,
  },
  botao: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 4,
    backgroundColor: '#e53935',
  },
  botaoSair: {
    marginBottom: 8,
    borderColor: '#e53935',
  },
  botaoExcluir: {
    marginBottom: 24,
  },
});
