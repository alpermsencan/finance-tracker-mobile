import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bill } from '../services/api';

interface BillCardProps {
  bill: Bill;
  onPress?: () => void;
}

export const BillCard: React.FC<BillCardProps> = ({ bill, onPress }) => {
  const isPaid = bill.status === 'paid';
  const isOverdue = bill.status === 'overdue';

  const badgeBg = isPaid ? '#ECFDF5' : isOverdue ? '#FEF2F2' : '#FFFBEB';
  const badgeColor = isPaid ? '#059669' : isOverdue ? '#DC2626' : '#D97706';
  const badgeText = isPaid ? 'Ödendi' : isOverdue ? 'Gecikti' : 'Bekliyor';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.row}>
        <Text style={styles.vendor}>{bill.vendorName}</Text>
        <View style={[styles.badge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
        </View>
      </View>

      <Text style={styles.amount}>
        {bill.amount.toLocaleString('tr-TR')} {bill.currency}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.dueDate}>Vade: {bill.dueDate.split('T')[0]}</Text>
        {bill.daysRemaining !== undefined && bill.status === 'pending' && (
          <Text style={styles.daysRemaining}>
            {bill.daysRemaining === 1 ? '⚠️ Yarın son gün!' : `⏳ ${bill.daysRemaining} gün kaldı`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vendor: { fontSize: 16, fontWeight: '700', color: '#111827' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  amount: { fontSize: 20, fontWeight: '800', color: '#2563EB', marginVertical: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dueDate: { fontSize: 12, color: '#6B7280' },
  daysRemaining: { fontSize: 12, fontWeight: '700', color: '#D97706' },
});
