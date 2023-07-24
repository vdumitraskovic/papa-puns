import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useFetchRandomJoke } from "./api";

export default function App() {
  const { data, isLoading } = useFetchRandomJoke();

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator />}
      {!isLoading && data && <Text style={styles.text}>{data.joke}</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});
