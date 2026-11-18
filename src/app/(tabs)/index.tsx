import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CARD_IMAGES = ['🐶', '🐱', '🦊', '🐼'];

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGameScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);

  // AppState tracking
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeGame();
    requestPermission();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current?.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App resumed from background!');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const initializeGame = () => {
    
    const duplicated = [...CARD_IMAGES, ...CARD_IMAGES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(duplicated);
    setSelectedCards([]);
    setMoves(0);
  };

  async function requestPermission() {
    await Notifications.requestPermissionsAsync();
  }

  async function triggerNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Memory Game 🧠",
        body: "Congratulations! You matched all card pairs!",
      },
      trigger: null,
    });
  }

  const handleCardPress = (id: number) => {
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched || selectedCards.length === 2) {
      return;
    }

    const updatedCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(updatedCards);
    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {

  // Match found
  const updatedMatchedCards = cards.map(c =>
    c.id === firstId || c.id === secondId
      ? { ...c, isFlipped: true, isMatched: true }
      : c
  );

  setCards(updatedMatchedCards);
  setSelectedCards([]);

  // Check whether all cards are matched
  const allMatched = updatedMatchedCards.every(
    card => card.isMatched
  );

  if (allMatched) {
    triggerNotification();

    setHistory(prev => [
      `Completed in ${moves + 1} moves`,
      ...prev
    ]);
  }
    
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Match Game</Text>
      <Text style={styles.subtitle}>Total Moves: {moves}</Text>

      <View style={styles.gridContainer}>
        {cards.map(card => (
          <Pressable
            key={card.id}
            style={[styles.card, (card.isFlipped || card.isMatched) && styles.cardFlipped]}
            onPress={() => handleCardPress(card.id)}
          >
            <Text style={styles.cardText}>
              {card.isFlipped || card.isMatched ? card.value : '❓'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.restartButton} onPress={initializeGame}>
        <Text style={styles.buttonText}>Restart Game</Text>
      </Pressable>

      <Pressable style={styles.ruleButton} onPress={() => router.push('/rules')}>
        <Text style={styles.ruleButtonText}>View Rules (Modal)</Text>
      </Pressable>

      <Text style={styles.historyTitle}>Recent Performance:</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.historyItem}>
            <Text>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 20 },
  card: { width: 70, height: 70, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  cardFlipped: { backgroundColor: '#E5E5EA' },
  cardText: { fontSize: 28 },
  restartButton: { backgroundColor: '#34C759', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  ruleButton: { backgroundColor: '#5856D6', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ruleButtonText: { color: '#fff', fontSize: 14 },
  historyTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  historyItem: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 6, marginBottom: 5 }
});