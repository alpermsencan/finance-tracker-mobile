import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { api, Bill, BalanceSummary, CurrencyRates, CURRENT_API_URL, setApiUrl } from '../services/api';
import { BillCard } from '../components/BillCard';
import { CircularProgress } from '../components/CircularProgress';

export default function DashboardScreen({ navigation }: any) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [balance, setBalance] = useState<BalanceSummary | null>(null);
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [customUrl, setCustomUrl] = useState<string>(CURRENT_API_URL);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [upcomingBills, balanceData, currencyData] = await Promise.all([
        api.getUpcomingBills(3).catch(() => []),
        api.getBalance().catch(() => ({
          month: '2026-10',
          incomeTotal: 45000,
          expenseTotal: 21500,
          netBalance: 23500,
          categories: { Market: 4200, Fatura: 3100, Kira: 14200 },
        })),
        api.getCurrencyRates().catch(() => ({
          usdToTry: 34.25,
          eurToTry: 37.8,
          goldPerGram: 2950,
        })),
      ]);

      setBills(upcomingBills);
      setBalance(balanceData);
      setRates(currencyData);
    } catch (err: any) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateUrl = () => {
    setApiUrl(customUrl);
    Alert.alert('Bağlantı Güncellendi', `API URL: ${customUrl}`);
    loadDashboardData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadDashboardData(); }} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Merhaba, Alper 👋</Text>
            <Text style={styles.subGreeting}>Finansal Durum Özeti</Text>
          </View>
          <TouchableOpacity style={styles.scanBtn} onPress={() => navigation.navigate('ScanBill')}>
            <Text style={styles.scanBtnText}>📷 Fatura Tara</Text>
          </TouchableOpacity>
        </View>

        {/* Currency Ticker Bar */}
        {rates && (
          <View style={styles.tickerCard}>
            <Text style={styles.tickerItem}>💵 USD: <Text style={styles.tickerValue}>{rates.usdToTry} ₺</Text></Text>
            <Text style={styles.tickerDivider}>|</Text>
            <Text style={styles.tickerItem}>💶 EUR: <Text style={styles.tickerValue}>{rates.eurToTry} ₺</Text></Text>
            <Text style={styles.tickerDivider}>|</Text>
            <Text style={styles.tickerItem}>🥇 Altın: <Text style={styles.tickerValue}>{rates.goldPerGram} ₺</Text></Text>
          </View>
        )}

        {/* Net Balance Card */}
        {balance && (
          <View style={styles.balanceCard}>
            <Text style={styles.balanceTitle}>Net Bakiye (Gelir - Gider)</Text>
            <Text style={styles.balanceAmount}>{balance.netBalance.toLocaleString('tr-TR')} ₺</Text>
            <View style={styles.statsRow}>
              <Text style={styles.incomeText}>+ {balance.incomeTotal.toLocaleString('tr-TR')} ₺</Text>
              <Text style={styles.expenseText}>- {balance.expenseTotal.toLocaleString('tr-TR')} ₺</Text>
            </View>
          </View>
        )}

        {/* Upcoming Bills Section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Yaklaşan Faturalar (1-3 Gün)</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Bills')}>
            <Text style={styles.seeAll}>Tümü</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#2563EB" style={{ marginVertical: 20 }} />
        ) : bills.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>🎉 Yaklaşan ödenmemiş faturanız yok!</Text>
          </View>
        ) : (
          bills.map((b) => <BillCard key={b.id} bill={b} />)
        )}

        {/* Savings Goals */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Tasarruf Hedefleri</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.savingsScroll}>
          <CircularProgress percentage={50} label="iPhone 15 Pro" sublabel="37.500 / 75.000 ₺" />
          <CircularProgress percentage={80} label="Japonya Tatili" sublabel="96.000 / 120.000 ₺" />
          <CircularProgress percentage={35} label="Altın Fonu" sublabel="7.000 / 20.000 ₺" />
        </ScrollView>

        {/* API URL Config Box */}
        <View style={styles.configBox}>
          <Text style={styles.configLabel}>Canlı Railway API Bağlantısı:</Text>
          <View style={styles.urlRow}>
            <TextInput
              style={styles.urlInput}
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="https://your-app.up.railway.app/api"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.urlSaveBtn} onPress={handleUpdateUrl}>
              <Text style={styles.urlSaveBtnText}>Bağlan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#111827' },
  subGreeting: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  scanBtn: { backgroundColor: '#10B981', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  scanBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  tickerCard: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFFFFF', padding: 10, borderRadius: 12, marginBottom: 16, elevation: 1 },
  tickerItem: { fontSize: 12, color: '#374151', fontWeight: '600' },
  tickerValue: { color: '#2563EB', fontWeight: '800' },
  tickerDivider: { color: '#E5E7EB' },
  balanceCard: { backgroundColor: '#2563EB', padding: 20, borderRadius: 18, marginBottom: 20 },
  balanceTitle: { color: '#DBEAFE', fontSize: 13, fontWeight: '600' },
  balanceAmount: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginVertical: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  incomeText: { color: '#A7F3D0', fontWeight: '700', fontSize: 14 },
  expenseText: { color: '#FCA5A5', fontWeight: '700', fontSize: 14 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  seeAll: { color: '#2563EB', fontWeight: '700', fontSize: 13 },
  emptyCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, alignItems: 'center' },
  emptyText: { color: '#059669', fontWeight: '600', fontSize: 14 },
  savingsScroll: { flexDirection: 'row', marginVertical: 10 },
  configBox: { backgroundColor: '#EFF6FF', padding: 14, borderRadius: 14, marginTop: 24, borderWidth: 1, borderColor: '#BFDBFE' },
  configLabel: { fontSize: 12, fontWeight: '700', color: '#1E40AF', marginBottom: 6 },
  urlRow: { flexDirection: 'row', gap: 8 },
  urlInput: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#93C5FD', borderRadius: 8, paddingHorizontal: 10, fontSize: 12, height: 38 },
  urlSaveBtn: { backgroundColor: '#2563EB', justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8 },
  urlSaveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
});
