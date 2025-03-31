import { StatusBar } from "expo-status-bar";
import { 
  StyleSheet, 
  View, 
  Animated, 
  Dimensions,
  Easing,
  Pressable,
} from "react-native";
import { useFetchRandomJoke } from "./api";
import { PaperProvider, Card, Text, ActivityIndicator, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useEffect } from "react";

const { width } = Dimensions.get("window");

export default function App() {
  const { data, isLoading, error, refetch } = useFetchRandomJoke();
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Početna animacija sa delay-om i boljim easing-om
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const handleNewJoke = () => {
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.4, 0, 0.2, 1), // Material Design easing
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
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
          <Animated.View 
            style={[
              styles.cardContainer, 
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <Pressable 
              onPressIn={handlePressIn} 
              onPressOut={handlePressOut}
            >
              <Card style={styles.card}>
                <Card.Content>
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" />
                      <Text style={styles.loadingText}>Loading joke...</Text>
                    </View>
                  ) : error ? (
                    <Text style={styles.errorText}>
                      An error occurred. Please try again.
                    </Text>
                  ) : (
                    <View style={styles.jokeContainer}>
                      <Text variant="headlineMedium" style={styles.jokeText}>
                        {data?.joke}
                      </Text>
                      <Button 
                        mode="contained" 
                        onPress={handleNewJoke}
                        style={styles.button}
                      >
                        New Joke
                      </Button>
                    </View>
                  )}
                </Card.Content>
              </Card>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    elevation: 4,
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
  },
  jokeText: {
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 28,
    fontSize: 18,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    fontSize: 16,
    padding: 20,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
});
