import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from "react-native";

const DetailsScreen = ({ flight, onBack }) => {
    if (!flight) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No flight data available</Text>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Extract all flight data
    const icao24 = flight[0] || "N/A";
    const callsign = flight[1] || "N/A";
    const origin = flight[2] || "Unknown";
    const timePosition = flight[3] || 0;
    const lastContact = flight[4] || 0;
    const longitude = flight[5];
    const latitude = flight[6];
    const altitude = flight[7] || 0;
    const onGround = flight[8];
    const velocity = flight[9] || 0;
    const trueTrack = flight[10];
    const verticalRate = flight[11];
    const sensors = flight[12];
    const geoAltitude = flight[13];
    const squawk = flight[14];
    const spi = flight[15];
    const positionSource = flight[16];

    const formatTime = (timestamp) => {
        if (!timestamp) return "N/A";
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    };

    const InfoCard = ({ icon, label, value, color = "#2196F3" }) => (
        <View style={[styles.infoCard, { borderLeftColor: color }]}>
            <Text style={styles.cardIcon}>{icon}</Text>
            <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>{label}</Text>
                <Text style={styles.cardValue}>{value}</Text>
            </View>
        </View>
    );

    const StatBox = ({ label, value, color = "#2196F3" }) => (
        <View style={[styles.statBox, { backgroundColor: color + "15" }]}>
            <Text style={[styles.statValue, { color }]}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Flight Details</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Main Info Card */}
                <View style={styles.mainCard}>
                    <View style={styles.mainCardHeader}>
                        <Text style={styles.mainCallsign}>✈️ {callsign.trim()}</Text>
                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: onGround ? "#FF5252" : "#4CAF50" },
                            ]}
                        >
                            <Text style={styles.statusText}>
                                {onGround ? "GROUNDED" : "AIRBORNE"}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.mainOrigin}>📍 {origin}</Text>
                    <Text style={styles.mainIcao}>ICAO24: {icao24}</Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <StatBox
                        label="Altitude"
                        value={`${Math.round(altitude)} m`}
                        color="#2196F3"
                    />
                    <StatBox
                        label="Speed"
                        value={`${Math.round(velocity)} m/s`}
                        color="#FF9800"
                    />
                </View>

                <View style={styles.statsRow}>
                    <StatBox
                        label="Geo Alt"
                        value={geoAltitude ? `${Math.round(geoAltitude)} m` : "N/A"}
                        color="#9C27B0"
                    />
                    <StatBox
                        label="V. Rate"
                        value={verticalRate ? `${verticalRate.toFixed(1)} m/s` : "N/A"}
                        color="#00BCD4"
                    />
                </View>

                {/* Position Information */}
                <Text style={styles.sectionTitle}>📍 Position</Text>
                <InfoCard
                    icon="🌐"
                    label="Latitude"
                    value={latitude ? latitude.toFixed(6) : "N/A"}
                    color="#4CAF50"
                />
                <InfoCard
                    icon="🌐"
                    label="Longitude"
                    value={longitude ? longitude.toFixed(6) : "N/A"}
                    color="#4CAF50"
                />
                <InfoCard
                    icon="🧭"
                    label="True Track"
                    value={trueTrack !== null ? `${trueTrack.toFixed(2)}°` : "N/A"}
                    color="#FF9800"
                />
                <InfoCard
                    icon="📡"
                    label="Position Source"
                    value={positionSource !== undefined ? String(positionSource) : "N/A"}
                    color="#9C27B0"
                />

                {/* Time Information */}
                <Text style={styles.sectionTitle}>⏰ Time</Text>
                <InfoCard
                    icon="🕐"
                    label="Last Contact"
                    value={formatTime(lastContact)}
                    color="#2196F3"
                />
                <InfoCard
                    icon="🕑"
                    label="Time Position"
                    value={formatTime(timePosition)}
                    color="#2196F3"
                />

                {/* Technical Information */}
                <Text style={styles.sectionTitle}>🔧 Technical</Text>
                <InfoCard
                    icon="📟"
                    label="Squawk Code"
                    value={squawk || "N/A"}
                    color="#FF5722"
                />
                <InfoCard
                    icon="📡"
                    label="Sensors"
                    value={sensors ? JSON.stringify(sensors) : "N/A"}
                    color="#607D8B"
                />
                <InfoCard
                    icon="⚠️"
                    label="SPI Status"
                    value={spi !== undefined ? (spi ? "Active" : "Inactive") : "N/A"}
                    color="#F44336"
                />

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};

export default DetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#2196F3",
        borderRadius: 8,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    mainCard: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        borderLeftWidth: 6,
        borderLeftColor: "#2196F3",
    },
    mainCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    mainCallsign: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1976D2",
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    mainOrigin: {
        fontSize: 18,
        color: "#555",
        marginBottom: 8,
    },
    mainIcao: {
        fontSize: 14,
        color: "#999",
        fontStyle: "italic",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    statBox: {
        flex: 1,
        marginHorizontal: 6,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "600",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginTop: 12,
        marginBottom: 12,
        paddingLeft: 4,
    },
    infoCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderLeftWidth: 4,
    },
    cardIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 12,
        color: "#999",
        fontWeight: "600",
        marginBottom: 4,
        textTransform: "uppercase",
    },
    cardValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    errorText: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginTop: 40,
    },
});

