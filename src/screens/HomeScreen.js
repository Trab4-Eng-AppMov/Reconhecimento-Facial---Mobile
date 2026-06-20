import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import PerfilScreen from './PerfilScreen';
import ReceitasScreen from './ReceitasScreen';

export default function HomeScreen() {
  const [index, setIndex] = useState(0);

  const routes = [
    { key: 'receitas', title: 'Receitas', focusedIcon: 'food', unfocusedIcon: 'food-outline' },
    { key: 'perfil', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ];

  const renderScene = BottomNavigation.SceneMap({
    receitas: ReceitasScreen,
    perfil: PerfilScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#e53935"
      barStyle={styles.barra}
    />
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: '#fff',
  },
});
