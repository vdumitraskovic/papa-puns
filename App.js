import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { useFetchRandomJoke } from "./api";
import { PaperProvider, Card, Text, ActivityIndicator, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { data, isLoading, error, refetch } = useFetchRandomJoke();

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Card style={styles.card}>
          <Card.Content>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading joke...</Text>
              </View>
            ) : error ? (
              <Text style={styles.errorText}>An error occurred. Please try again.</Text>
            ) : (
              <View style={styles.jokeContainer}>
                <Text variant="headlineMedium" style={styles.jokeText}>
                  {data?.joke}
                </Text>
                <Button 
                  mode="contained" 
                  onPress={refetch}
                  style={styles.button}
                >
                  New Joke
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1976D2",
    padding: 16,
    justifyContent: "center",
  },
  card: {
    margin: 16,
    elevation: 4,
    backgroundColor: "#FFFFFF",
    maxWidth: 600,
    alignSelf: "center",
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
