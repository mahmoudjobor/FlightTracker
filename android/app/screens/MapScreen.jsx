import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { opensky } from '../services/opensky';
import React, { useState, useEffect } from 'react';

const MapScreen = ({ onSelect }) => {

    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);
    const [mapTimedOut, setMapTimedOut] = useState(false);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const data = await opensky();
                setFlights(data.states || []);
            } catch (error) {
                console.error("Error fetching flight data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!mapReady) setMapTimedOut(true);
        }, 8000);
        return () => clearTimeout(timeout);
    }, [mapReady]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Loading Flights...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 33.8547,
                    longitude: 35.8623,
                    latitudeDelta: 80,
                    longitudeDelta: 80,
                }}
                onMapReady={() => setMapReady(true)}
                onMapLoaded={() => setMapReady(true)}
                showsUserLocation={true}
                showsMyLocationButton={true}
                provider={PROVIDER_GOOGLE}
            >
                {flights.slice(0, 50).map((flight, index) => {
                    const latitude = flight[6];
                    const longitude = flight[5];
                    const callsign = flight[1]?.trim() || "N/A";
                    const origin = flight[2] || "Unknown";
                    const altitude = flight[7] || 0;
                    const speed = flight[9] || 0;
                    const trueTrack = flight[10] || 0;

                    // Skip if no coordinates
                    if (latitude == null || longitude == null) return null;
                    if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;

                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: latitude,
                                longitude: longitude,
                            }}
                            rotation={trueTrack}
                            anchor={{ x: 0.5, y: 0.5 }}
                        >
                            <View style={styles.planeMarker}>
                                <Text style={styles.planeIcon}>✈️</Text>
                            </View>

                            <Callout
                                style={styles.callout}
                                onPress={() => onSelect && onSelect(flight)}
                            >
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>✈️ {callsign}</Text>
                                    <Text style={styles.calloutRoute}>📍 From: {origin}</Text>
                                    <View style={styles.calloutDivider} />
                                    <View style={styles.calloutStats}>
                                        <Text style={styles.calloutStat}>
                                            🔼 {Math.round(altitude)}m
                                        </Text>
                                        <Text style={styles.calloutStat}>
                                            💨 {Math.round(speed)}m/s
                                        </Text>
                                    </View>
                                    <TouchableOpacity style={styles.calloutButton}>
                                        <Text style={styles.calloutButtonText}>
                                            View Details →
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>

            {!mapReady && mapTimedOut && (
                <View style={styles.mapErrorOverlay} pointerEvents="none">
                    <Text style={styles.mapErrorTitle}>Map didn’t load</Text>
                    <Text style={styles.mapErrorText}>
                        invalid Google Maps API key.
                    </Text>
                </View>
            )}

            <View style={styles.statsBar}>
                <Text style={styles.statsText}>
                    🌍 {flights.length} Total Flights
                </Text>
                <Text style={styles.statsSubtext}>
                    Showing 50 on map
                </Text>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    planeMarker: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    planeIcon: {
        fontSize: 28,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    callout: {
        width: 250,
    },
    calloutContainer: {
        padding: 12,
        width: 250,
    },
    calloutTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976D2',
        marginBottom: 8,
    },
    calloutRoute: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    calloutDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    calloutStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    calloutStat: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    calloutButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    calloutButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    statsBar: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    statsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976D2',
        textAlign: 'center',
    },
    statsSubtext: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },

    mapErrorOverlay: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 14,
        elevation: 3,
    },
    mapErrorTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D32F2F',
        marginBottom: 6,
        textAlign: 'center',
    },
    mapErrorText: {
        fontSize: 12,
        color: '#444',
        textAlign: 'center',
    },
});

export default MapScreen;