import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import firebase from '../firebaseConfig';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function cadastrar() {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const resultado = await firebase.auth().createUserWithEmailAndPassword(email, senha);
      const uid = resultado.user.uid;
      await firebase.firestore().collection('usuarios').doc(uid).set({
        nome,
        email,
        foto: '',
      });
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao cadastrar', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titulo}>Criar Conta</Title>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />

      <Button
        mode="contained"
        onPress={cadastrar}
        loading={loading}
        disabled={loading}
        style={styles.botao}
      >
        Cadastrar
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.botaoLink}
      >
        Já tem conta? Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 32,
    color: '#e53935',
  },
  input: {
    marginBottom: 12,
  },
  botao: {
    marginTop: 8,
    paddingVertical: 4,
    backgroundColor: '#e53935',
  },
  botaoLink: {
    marginTop: 8,
  },
});
