import { opensky } from "../services/opensky";
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
} from "react-native";

const FlightItem = ({ item, onPress }) => {
    const flight = item[0];
    const callsign = (item[1] || "").trim();
    const origin = item[2] || "N/A";
    const altitude = item[7] != null ? `${Math.round(item[7])} m` : "N/A";
    const speed = item[9] != null ? `${Math.round(item[9])} m/s` : "N/A";

    return (
        <TouchableOpacity onPress={() => onPress && onPress(item)}>
            <View style={styles.item}>
                <Text style={styles.flight}>{callsign || flight}</Text>
                <Text style={styles.callsign}>{flight}</Text>
                <Text style={styles.sub}>{origin} • {altitude} • {speed}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const ListOfFlights = ({ onSelect }) => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFlights = useCallback(async () => {
        try {
            setError(null);
            const data = await opensky();
            console.log("OpenSky states sample:", data.states && data.states.slice(0, 5));
            setFlights(data.states || []);
        } catch (err) {
            setError(err?.message || String(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchFlights();
    }, [fetchFlights]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error ? <Text style={styles.error}>Error: {error}</Text> : null}

            <FlatList
                data={flights}
                keyExtractor={(item, index) => (item && item[0]) || String(index)}
                renderItem={({ item }) => (
                    <FlightItem item={item} onPress={(it) => onSelect && onSelect(it)} />
                )}
                ItemSeparatorComponent={() => <View style={styles.sep} />}
                ListEmptyComponent={() => <Text>No flights found.</Text>}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchFlights();
                        }}
                    />
                }
            />
        </View>
    );
};

export default ListOfFlights;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#bcd3dbff",
    },
    flight: {
        fontSize: 18,
        fontWeight: "700",
    },
    item: {
        paddingVertical: 10,
    },
    callsign: {
        fontSize: 16,
        fontWeight: "600",
    },
    sub: {
        color: "#555",
    },
    sep: {
        height: 1,
        backgroundColor: "#eee",
    },
    error: {
        color: "#b00020",
        marginBottom: 8,
    },
});
