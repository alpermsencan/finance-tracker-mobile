import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { api } from '../services/api';

export default function AddBillScreen({ navigation, route }: any) {
  const prefilled = route?.params?.prefilledBill;

  const [vendorName, setVendorName] = useState(prefilled?.vendor || '');
  const [amount, setAmount] = useState(prefilled?.amount ? String(prefilled.amount) : '');
  const [dueDate, setDueDate] = useState(prefilled?.dueDate || new Date().toISOString().split('T')[0]);
  const [vendorCategory, setVendorCategory] = useState('Elektrik');
  const [isRecurring, setIsRecurring] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!vendorName || !amount || !dueDate) {
      Alert.alert('Eksik Bilgi', 'Lütfen kurum adı, tutar ve son ödeme tarihini doldurunuz.');
      return;
    }

    try {
      setSaving(true);
      await api.createBill({
        vendorName,
        amount: parseFloat(amount),
        currency: 'TRY',
        dueDate,
        vendorCategory,
        recurrenceInterval: isRecurring ? 'monthly' : undefined,
      });

      Alert.alert('Başarılı', 'Fatura başarıyla kaydedildi!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Kayıt Başarısız', err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Yeni Fatura Tanımla</Text>

      <Text style={styles.label}>Kurum / Alacaklı Adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: BEDAŞ, İSKİ, Turkcell"
        value={vendorName}
        onChangeText={setVendorName}
      />

      <Text style={styles.label}>Fatura Tutarı (TL)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Son Ödeme Tarihi (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        placeholder="2026-10-15"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.catRow}>
        {['Elektrik', 'Su', 'Doğalgaz', 'İnternet', 'Abonelik'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, vendorCategory === cat && styles.catChipActive]}
            onPress={() => setVendorCategory(cat)}
          >
            <Text style={[styles.catText, vendorCategory === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.switchBox, isRecurring && styles.switchBoxActive]}
        onPress={() => setIsRecurring(!isRecurring)}
      >
        <Text style={styles.switchLabel}>🔄 Her Ay Otomatik Yenilenen Abonelik (Kira / Netflix vb.)</Text>
        <Text style={styles.switchStatus}>{isRecurring ? 'Açık' : 'Kapalı'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
        <Text style={styles.saveBtnText}>{saving ? 'Kaydediliyor...' : 'Faturayı Kaydet'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FFFFFF', flexGrow: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 14 },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F3F4F6' },
  catChipActive: { backgroundColor: '#2563EB' },
  catText: { fontSize: 12, fontWeight: '600', color: '#4B5563' },
  catTextActive: { color: '#FFFFFF' },
  switchBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 12, borderRadius: 10, marginBottom: 24 },
  switchBoxActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  switchLabel: { fontSize: 12, fontWeight: '600', color: '#1F2937', flex: 1 },
  switchStatus: { fontWeight: '700', color: '#2563EB', marginLeft: 8 },
  saveBtn: { backgroundColor: '#2563EB', padding: 16, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});
