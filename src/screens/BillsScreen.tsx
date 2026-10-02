import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { api, Bill } from '../services/api';
import { BillCard } from '../components/BillCard';

export default function BillsScreen({ navigation }: any) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBills();
      setBills(data);
    } catch (err: any) {
      console.warn('Bills fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const filteredBills = bills.filter((b) => (filter === 'all' ? true : b.status === filter));

  return (
    <SafeAreaView style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        {(['all', 'pending', 'paid'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.tabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab === 'all' ? 'Tümü' : tab === 'pending' ? 'Bekleyenler' : 'Ödenenler'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bill List */}
      {loading ? (
        <ActivityIndicator color="#2563EB" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredBills}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BillCard bill={item} />}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Henüz fatura bulunamadı.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddBill')}>
        <Text style={styles.fabText}>+ Fatura Ekle</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  tabRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 8, gap: 8, elevation: 1 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, backgroundColor: '#F3F4F6' },
  tabActive: { backgroundColor: '#2563EB' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  tabTextActive: { color: '#FFFFFF' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#2563EB', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, elevation: 4 },
  fabText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
