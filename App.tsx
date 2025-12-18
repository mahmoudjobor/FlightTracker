import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";

import ListOfFlights from "./android/app/screens/ListOfFlights";
import DetailsScreen from "./android/app/screens/DetailsScreen";
import MapScreen from "./android/app/screens/MapScreen";

const App = () => {
  const [route, setRoute] = useState({ name: "list", params: null });

  const NavBar = () => (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[
          styles.navButton,
          route.name === "list" && styles.navButtonActive,
        ]}
        onPress={() => setRoute({ name: "list", params: null })}
      >
        <Text
          style={[
            styles.navText,
            route.name === "list" && styles.navTextActive,
          ]}
        >
          List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.navButton,
          route.name === "map" && styles.navButtonActive,
        ]}
        onPress={() => setRoute({ name: "map", params: null })}
      >
        <Text
          style={[styles.navText, route.name === "map" && styles.navTextActive]}
        >
          Map
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {route.name !== "details" && <NavBar />}

      {route.name === "list" && (
        <ListOfFlights
          onSelect={(item) => setRoute({ name: "details", params: { item } })}
        />
      )}

      {route.name === "map" && (
        <MapScreen
          onSelect={(item) => setRoute({ name: "details", params: { item } })}
        />
      )}

      {route.name === "details" && (
        <DetailsScreen
          flight={route.params?.item}
          onBack={() => setRoute({ name: "list", params: null })}
        />
      )}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  navButtonActive: {
    backgroundColor: "#2196F3",
  },
  navText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  navTextActive: {
    color: "#fff",
  },
});
