import React from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const cart = () => {
  return (
    <SafeAreaView style={styles.container}>
     <Text style={styles.text}>
          cart
     </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    width: '100%',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 24,
    marginTop: 20,
  },
});

export default cart;
