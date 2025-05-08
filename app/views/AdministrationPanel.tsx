import React from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { Text, Card } from "react-native-paper";
import { LineChart, ProgressChart } from "react-native-chart-kit";
import { colors } from "../../constants/colors";

// Datos de los resultados de votación
const votingResults = [
  { id: "3", name: "Laura Mendoza", votes: 150 },
  { id: "1", name: "Ana Torres", votes: 120 },
  { id: "2", name: "Carlos Gómez", votes: 85 },
].sort((a, b) => a.votes - b.votes);

// Datos para la gráfica
const chartConfig = {
  backgroundColor: "#bb86fc",
  backgroundGradientFrom: "#1e1e1e",
  backgroundGradientTo: "#1e1e1e",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 2) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: "12",
    fontWeight: "bold",
  },
};

const screenWidth = Dimensions.get("window").width - 32;

export default function VotingResultsPanel() {
  // Total de votos para calcular el progreso
  const totalVotes = votingResults.reduce((sum, c) => sum + c.votes, 0);

  // Crear el array de datos para la gráfica
  const data = {
    data: votingResults.map((c) => c.votes / totalVotes),
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resultados de Votación</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Total de votos: {totalVotes}</Text>
        </Card.Content>
      </Card>

      {/* Gráfica de progreso en una Card */}

      <ProgressChart
        data={data}
        width={screenWidth}
        height={220}
        strokeWidth={16}
        radius={32}
        chartConfig={chartConfig}
        hideLegend={true}
        style={styles.chart}
      />

      {/* Mostrar resultados individuales de cada candidato */}
      {votingResults.map((c) => (
        <Card key={c.id} style={styles.card}>
          <Card.Title title={c.name} subtitle={`Votos: ${c.votes}`} />
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#121212",
    padding: 16,
  },
  title: {
    fontSize: 22,
    color: colors.text || "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  chart: {
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: "#0000",
  },
  card: {
    backgroundColor: "#1e1e1e",
    marginBottom: 16,
  },
});
