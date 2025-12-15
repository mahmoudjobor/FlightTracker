import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

const DetailsScreen = ({ flight, onBack }) => {
    if (!flight) return null;

    const callsign = (flight[1] || "").trim() || "N/A";
    const origin = flight[2] || "N/A";
    const altitude = flight[7] != null ? `${Math.round(flight[7])} m` : "N/A";
    const speed = flight[9] != null ? `${Math.round(flight[9])} m/s` : "N/A";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{callsign}</Text>
            <Text style={styles.sub}>Origin: {origin}</Text>
            <Text style={styles.sub}>Altitude: {altitude}</Text>
            <Text style={styles.sub}>Speed: {speed}</Text>
            <View style={{ marginTop: 16 }}>
                <Button title="Back" onPress={onBack} />
            </View>
        </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    title: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
    sub: { fontSize: 16, color: "#333", marginBottom: 4 },
});
