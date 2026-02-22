import React, { useState, useMemo } from "react";
import { SafeAreaView, View, Text, TextInput, Button, ScrollView, StyleSheet, Dimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [date, setDate] = useState("2025-02-20");
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("30");
  const [protein, setProtein] = useState("20");
  const [logs, setLogs] = useState([]);

  const handleAddLog = () => {
    if (!exercise || !date) return;
    const newLog = {
      id: Date.now(),
      date,
      exercise,
      duration: Number(duration) || 0,
      protein: Number(protein) || 0,
    };
    setLogs(prev => [...prev, newLog]);
    setExercise("");
  };

  // 日ごとの合計時間を折れ線グラフ用に集計
  const lineData = useMemo(() => {
    const map = {};
    logs.forEach(l => {
      map[l.date] = (map[l.date] || 0) + l.duration;
    });
    const labels = Object.keys(map).sort();
    const data = labels.map(d => map[d]);
    return { labels, data };
  }, [logs]);

  // 今日のプロテイン vs 目標（例: 100g）を円グラフに
  const pieData = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayProtein = logs
      .filter(l => l.date === today)
      .reduce((s, l) => s + l.protein, 0);
    const target = 100;
    return [
      {
        name: "今日の摂取量",
        protein: todayProtein,
        color: "#00eaff",
        legendFontColor: "#fff",
        legendFontSize: 12,
      },
      {
        name: "残り目標",
        protein: Math.max(target - todayProtein, 0),
        color: "#ff3b3b",
        legendFontColor: "#fff",
        legendFontSize: 12,
      },
    ];
  }, [logs]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🔥 Workout Tracker</Text>

        {/* 入力フォーム */}
        <View style={styles.card}>
          <Text style={styles.label}>日付 (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="2025-02-20"
            placeholderTextColor="#777"
          />
          <Text style={styles.label}>種目</Text>
          <TextInput
            style={styles.input}
            value={exercise}
            onChangeText={setExercise}
            placeholder="ベンチプレス"
            placeholderTextColor="#777"
          />
          <Text style={styles.label}>筋トレ時間（分）</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
          />
          <Text style={styles.label}>プロテイン（g）</Text>
          <TextInput
            style={styles.input}
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
          />
          <Button title="＋ 記録を追加" onPress={handleAddLog} />
        </View>

        {/* 折れ線グラフ：日ごとの筋トレ時間 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📈 日ごとの筋トレ時間</Text>
          {lineData.labels.length > 0 ? (
            <LineChart
              data={{
                labels: lineData.labels,
                datasets: [{ data: lineData.data }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#000",
                backgroundGradientFrom: "#111",
                backgroundGradientTo: "#111",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 234, 255, ${opacity})`,
                labelColor: () => "#fff",
              }}
              bezier
              style={{ borderRadius: 12 }}
            />
          ) : (
            <Text style={styles.emptyText}>まだデータがありません</Text>
          )}
        </View>

        {/* 円グラフ：今日のプロテイン vs 目標 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🥤 今日のプロテイン vs 目標</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              color: () => "#fff",
            }}
            accessor="protein"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </View>

        {/* ログ一覧（簡易表示） */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📘 ログ一覧</Text>
          {logs.map(l => (
            <Text key={l.id} style={styles.logItem}>
              {l.date} / {l.exercise} / {l.duration}分 / {l.protein}g
            </Text>
          ))}
          {logs.length === 0 && <Text style={styles.emptyText}>まだ記録がありません</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  scroll: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00eaff",
    textAlign: "center",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  label: { color: "#ccc", marginTop: 8, marginBottom: 4 },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: { color: "#777", fontSize: 12 },
  logItem: { color: "#eee", fontSize: 12, marginBottom: 4 },
});