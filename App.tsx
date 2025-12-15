import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import ListOfFlights from "./android/app/screens/ListOfFlights";
import DetailsScreen from "./android/app/screens/DetailsScreen";

const App = () => {
  const [route, setRoute] = useState({ name: "list", params: null });

  return (
    <SafeAreaView style={styles.safe}>
      {route.name === "list" && (
        <ListOfFlights
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
  safe: { flex: 1 },
});
