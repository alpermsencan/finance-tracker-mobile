import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function ScanBillScreen({ navigation }: any) {
  const [scannedData, setScannedData] = useState<{
    vendor: string;
    amount: number;
    dueDate: string;
    confidence: number;
  } | null>(null);

  const handleSimulateScan = (vendor: string, amount: number, dueDate: string) => {
    setScannedData({
      vendor,
      amount,
      dueDate,
      confidence: 88,
    });
  };

  const handleConfirm = () => {
    if (!scannedData) return;
    navigation.navigate('AddBill', { prefilledBill: scannedData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📷 Fatura OCR Tarayıcı</Text>
      <Text style={styles.subtitle}>Faturayı kamerayla tarayın veya örnek faturalarla test edin.</Text>

      {/* Test presets */}
      <View style={styles.presets}>
        <Text style={styles.presetTitle}>Hızlı Test Simülatörü:</Text>
        <TouchableOpacity style={styles.presetBtn} onPress={() => handleSimulateScan('BEDAŞ Elektrik', 820.5, '2026-10-15')}>
          <Text style={styles.presetText}>⚡ BEDAŞ Elektrik Faturası Tara (820.50 TL)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetBtn} onPress={() => handleSimulateScan('İSKİ Su İdaresi', 340.0, '2026-10-20')}>
          <Text style={styles.presetText}>💧 İSKİ Su Faturası Tara (340.00 TL)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetBtn} onPress={() => handleSimulateScan('Turkcell Ev İnterneti', 490.0, '2026-10-08')}>
          <Text style={styles.presetText}>🌐 Turkcell İnternet Faturası (490.00 TL)</Text>
        </TouchableOpacity>
      </View>

      {scannedData && (
        <View style={styles.resultCard}>
          <Text style={styles.resultHeader}>Tespit Edilen Fatura Verileri</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Kurum:</Text>
            <Text style={styles.value}>{scannedData.vendor}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tutar:</Text>
            <Text style={[styles.value, styles.amount]}>{scannedData.amount} TL</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vade:</Text>
            <Text style={styles.value}>{scannedData.dueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Doğruluk:</Text>
            <Text style={[styles.value, { color: '#059669' }]}>%{scannedData.confidence}</Text>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
            <Text style={styles.confirmText}>✓ Fatura Ekleme Formuna Aktar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F9FAFB', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginVertical: 6 },
  presets: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 14, marginVertical: 16, elevation: 1 },
  presetTitle: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 10 },
  presetBtn: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 12, borderRadius: 8, marginBottom: 8 },
  presetText: { fontSize: 13, fontWeight: '700', color: '#1E40AF' },
  resultCard: { backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, elevation: 2, marginTop: 10 },
  resultHeader: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  label: { fontSize: 13, color: '#6B7280' },
  value: { fontSize: 14, fontWeight: '700', color: '#111827' },
  amount: { color: '#2563EB', fontSize: 16 },
  confirmBtn: { backgroundColor: '#10B981', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  confirmText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
