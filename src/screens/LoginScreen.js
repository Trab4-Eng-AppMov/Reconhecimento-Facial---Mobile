import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button, Title } from 'react-native-paper';
import firebase from '../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      await firebase.auth().signInWithEmailAndPassword(email, senha);
    } catch (error) {
      Alert.alert('Erro ao entrar', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titulo}>App Receitas</Title>

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
        onPress={entrar}
        loading={loading}
        disabled={loading}
        style={styles.botao}
      >
        Entrar
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('Cadastro')}
        style={styles.botaoLink}
      >
        Não tem conta? Cadastre-se
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
