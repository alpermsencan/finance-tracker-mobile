import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, SafeAreaView } from 'react-native';
import { api, Budget } from '../services/api';

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const fetchBudgets = async () => {
    try {
      const data = await api.getBudgets();
      setBudgets(data);
    } catch (err: any) {
      console.warn('Budgets fetch warning:', err.message);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreateBudget = async () => {
    if (!category || !limit) {
      Alert.alert('Eksik Alan', 'Lütfen kategori ve limit tutarını girin.');
      return;
    }

    try {
      await api.createBudget({
        category,
        limitAmount: parseFloat(limit),
        startDate: '2026-10-01',
        endDate: '2026-10-31',
      });
      setModalVisible(false);
      setCategory('');
      setLimit('');
      fetchBudgets();
      Alert.alert('Başarılı', 'Bütçe limiti kaydedildi.');
    } catch (err: any) {
      Alert.alert('Hata', err.response?.data?.error || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kategori Bütçeleri</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Yeni Limit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isWarning = item.progressPercentage >= 80;
          const isExceeded = item.progressPercentage >= 100;
          const barColor = isExceeded ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={[styles.percentage, { color: barColor }]}>%{item.progressPercentage}</Text>
              </View>

              <View style={styles.track}>
                <View style={[styles.fill, { width: `${Math.min(item.progressPercentage, 100)}%`, backgroundColor: barColor }]} />
              </View>

              <View style={styles.footer}>
                <Text style={styles.spentText}>
                  Harcanan: {item.currentSpent} ₺ / Limit: {item.limitAmount} ₺
                </Text>
                {item.warning && <Text style={[styles.warningText, { color: barColor }]}>{item.warning}</Text>}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Tanımlı bütçe limiti bulunmuyor.</Text>
          </View>
        }
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Kategori Bütçesi</Text>
            <TextInput
              style={styles.input}
              placeholder="Kategori Adı (Örn: Market)"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Aylık Limit Tutarı (₺)"
              keyboardType="numeric"
              value={limit}
              onChangeText={setLimit}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateBudget}>
                <Text style={styles.saveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFFFFF', elevation: 1 },
  title: { fontSize: 20, fontWeight: '800', color: '#111827' },
  addBtn: { backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  category: { fontSize: 15, fontWeight: '700', color: '#111827' },
  percentage: { fontSize: 15, fontWeight: '800' },
  track: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden', marginVertical: 6 },
  fill: { height: '100%', borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  spentText: { fontSize: 12, color: '#6B7280' },
  warningText: { fontSize: 12, fontWeight: '800' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 14 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 14 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
  cancelBtn: { padding: 12 },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  saveBtn: { backgroundColor: '#2563EB', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 8 },
  saveText: { color: '#FFFFFF', fontWeight: '700' },
});
