import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function RulesModal() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Rules</Text>
      <Text style={styles.text}>1. Tap cards to flip them and find matching pairs.</Text>
      <Text style={styles.text}>2. Match all pairs with minimum moves to win!</Text>
      
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Close Modal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10, textAlign: 'center', color: '#333' },
  button: { marginTop: 20, backgroundColor: '#FF3B30', padding: 12, borderRadius: 8, width: 150, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});