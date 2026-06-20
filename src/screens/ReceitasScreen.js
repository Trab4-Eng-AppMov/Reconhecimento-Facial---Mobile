import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, Modal, ScrollView, Image } from 'react-native';
import { Text, TextInput, Button, Title, Card, FAB, ActivityIndicator } from 'react-native-paper';
import firebase from '../firebaseConfig';

const receitaVazia = { nome: '', ingredientes: '', tempo: '', foto: '' };

export default function ReceitasScreen() {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [receitaAtual, setReceitaAtual] = useState(receitaVazia);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const unsub = firebase
      .firestore()
      .collection('receitas')
      .orderBy('nome')
      .onSnapshot(snapshot => {
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReceitas(lista);
        setLoading(false);
      });
    return () => unsub();
  }, []);

  function abrirNovaReceita() {
    setReceitaAtual(receitaVazia);
    setEditandoId(null);
    setModalVisivel(true);
  }

  function abrirEditarReceita(receita) {
    setReceitaAtual({
      nome: receita.nome,
      ingredientes: receita.ingredientes,
      tempo: String(receita.tempo),
      foto: receita.foto,
    });
    setEditandoId(receita.id);
    setModalVisivel(true);
  }

  function fecharModal() {
    setModalVisivel(false);
    setReceitaAtual(receitaVazia);
    setEditandoId(null);
  }

  async function salvarReceita() {
    if (!receitaAtual.nome || !receitaAtual.ingredientes || !receitaAtual.tempo) {
      Alert.alert('Erro', 'Preencha nome, ingredientes e tempo de preparo.');
      return;
    }
    setSalvando(true);
    try {
      const dados = {
        nome: receitaAtual.nome,
        ingredientes: receitaAtual.ingredientes,
        tempo: Number(receitaAtual.tempo),
        foto: receitaAtual.foto || '',
      };
      if (editandoId) {
        await firebase.firestore().collection('receitas').doc(editandoId).update(dados);
        Alert.alert('Sucesso', 'Receita atualizada!');
      } else {
        await firebase.firestore().collection('receitas').add(dados);
        Alert.alert('Sucesso', 'Receita criada!');
      }
      fecharModal();
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setSalvando(false);
    }
  }

  function confirmarExclusao(id, nome) {
    Alert.alert(
      'Excluir Receita',
      `Deseja excluir "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => excluirReceita(id) },
      ]
    );
  }

  async function excluirReceita(id) {
    try {
      await firebase.firestore().collection('receitas').doc(id).delete();
      Alert.alert('Sucesso', 'Receita excluída!');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  }

  function renderReceita({ item }) {
    return (
      <Card style={styles.card}>
        {item.foto ? (
          <Card.Cover source={{ uri: item.foto }} style={styles.cardCover} />
        ) : null}
        <Card.Content style={styles.cardContent}>
          <Title style={styles.cardTitulo}>{item.nome}</Title>
          <Text style={styles.cardTempo}>Tempo: {item.tempo} min</Text>
          <Text style={styles.cardLabel}>Ingredientes:</Text>
          <Text style={styles.cardIngredientes}>{item.ingredientes}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => abrirEditarReceita(item)} textColor="#e53935">
            Editar
          </Button>
          <Button onPress={() => confirmarExclusao(item.id, item.nome)} textColor="#999">
            Excluir
          </Button>
        </Card.Actions>
      </Card>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Title style={styles.titulo}>Receitas</Title>

      {receitas.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.textoVazio}>Nenhuma receita cadastrada.</Text>
          <Text style={styles.textoVazioSub}>Toque no + para adicionar.</Text>
        </View>
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={item => item.id}
          renderItem={renderReceita}
          contentContainerStyle={styles.lista}
        />
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={abrirNovaReceita}
        color="#fff"
      />

      <Modal visible={modalVisivel} animationType="slide" onRequestClose={fecharModal}>
        <ScrollView style={styles.modal}>
          <Title style={styles.modalTitulo}>
            {editandoId ? 'Editar Receita' : 'Nova Receita'}
          </Title>

          <TextInput
            label="Nome da Receita"
            value={receitaAtual.nome}
            onChangeText={v => setReceitaAtual(prev => ({ ...prev, nome: v }))}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Ingredientes"
            value={receitaAtual.ingredientes}
            onChangeText={v => setReceitaAtual(prev => ({ ...prev, ingredientes: v }))}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />

          <TextInput
            label="Tempo de Preparo (minutos)"
            value={receitaAtual.tempo}
            onChangeText={v => setReceitaAtual(prev => ({ ...prev, tempo: v }))}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <TextInput
            label="URL da Foto (opcional)"
            value={receitaAtual.foto}
            onChangeText={v => setReceitaAtual(prev => ({ ...prev, foto: v }))}
            style={styles.input}
            mode="outlined"
          />

          <Button
            mode="contained"
            onPress={salvarReceita}
            loading={salvando}
            disabled={salvando}
            style={styles.botaoSalvar}
          >
            {editandoId ? 'Atualizar' : 'Salvar'}
          </Button>

          <Button
            mode="outlined"
            onPress={fecharModal}
            disabled={salvando}
            style={styles.botaoCancelar}
          >
            Cancelar
          </Button>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 24,
    marginVertical: 16,
    color: '#e53935',
  },
  lista: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  cardCover: {
    height: 160,
  },
  cardContent: {
    paddingTop: 12,
  },
  cardTitulo: {
    fontSize: 18,
    color: '#333',
  },
  cardTempo: {
    color: '#e53935',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardLabel: {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  cardIngredientes: {
    color: '#666',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#e53935',
  },
  textoVazio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  textoVazioSub: {
    fontSize: 14,
    color: '#999',
  },
  modal: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  modalTitulo: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 20,
    marginTop: 16,
    color: '#e53935',
  },
  input: {
    marginBottom: 12,
  },
  botaoSalvar: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 4,
    backgroundColor: '#e53935',
  },
  botaoCancelar: {
    marginBottom: 32,
  },
});
