import { StatusBar } from "expo-status-bar";
import { 
  StyleSheet, 
  View, 
  Animated, 
  Easing,
  Pressable,
} from "react-native";
import { useFetchRandomJoke } from "./api";
import { PaperProvider, Card, Text, ActivityIndicator, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useEffect, useState } from "react";

const JOKE_EMOJIS = ["😄", "😂", "🤣", "😅", "😆", "😉", "😋", "😎", "😍", "🤪", "😜", "😝", "🤗", "🤭", "🤫"];

export default function App() {
  const { 
    data, 
    isInitial,
    isLoading,
    isError,
    isSuccess,
    refetch 
  } = useFetchRandomJoke();
  const spinnerFadeAnim = useRef(new Animated.Value(1)).current;
  const cardScaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [currentEmoji, setCurrentEmoji] = useState(JOKE_EMOJIS[0]);

  useEffect(() => {
    if (data) {
      // Fade out spinner and zoom in card with rotation
      Animated.parallel([
        Animated.timing(spinnerFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(cardScaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.spring(rotateAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isLoading) {
      // Start continuous rotation
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        })
      ).start();
    }
  }, [isLoading]);

  const handlePressIn = () => {
    Animated.spring(cardScaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(cardScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handleNewJoke = () => {
    // Randomly select a new emoji
    const randomEmoji = JOKE_EMOJIS[Math.floor(Math.random() * JOKE_EMOJIS.length)];
    setCurrentEmoji(randomEmoji);
    refetch();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.contentContainer}>
          {isInitial && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={[styles.loadingText, { color: "#FFFFFF" }]}>Loading joke...</Text>
            </View>
          )}
          <Animated.View 
            style={[
              styles.cardContainer, 
              {
                transform: [
                  { scale: cardScaleAnim },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <Pressable 
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut}
            >
              <View style={styles.cardWrapper}>
                <View style={styles.card}>
                  <Card.Content>
                    {isError ? (
                      <Text style={styles.errorText}>
                        An error occurred. Please try again.
                      </Text>
                    ) : (
                      <View style={styles.jokeContainer}>
                        <Text style={styles.jokeEmoji}>{currentEmoji}</Text>
                        <Text variant="headlineMedium" style={styles.jokeText}>
                          {data?.joke}
                        </Text>
                        <Button 
                          mode="contained" 
                          onPress={handleNewJoke}
                          style={styles.button}
                          icon="refresh"
                        >
                          New Joke
                        </Button>
                      </View>
                    )}
                  </Card.Content>
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1976D2",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  cardContainer: {
    width: "100%",
    maxWidth: 400,
  },
  cardWrapper: {
    position: "relative",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 8,
    boxShadow: "0 5px 5px 0 rgba(0, 0, 0, 0.20), 0 5px 20px 10px rgba(0, 0, 0, 0.15)",
    zIndex: 2,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  jokeContainer: {
    padding: 20,
    position: "relative",
  },
  jokeEmoji: {
    position: "absolute",
    top: -20,
    right: -20,
    fontSize: 64,
    zIndex: 2,
    transform: [{ rotate: "15deg" }],
  },
  jokeText: {
    textAlign: "left",
    marginBottom: 24,
    lineHeight: 28,
    fontSize: 18,
    color: "#333",
    paddingRight: 40,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    padding: 20,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#1976D2",
    alignSelf: "flex-start",
    zIndex: 3,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
});
