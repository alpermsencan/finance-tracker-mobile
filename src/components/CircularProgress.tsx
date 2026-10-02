import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CircularProgressProps {
  percentage: number;
  label: string;
  sublabel: string;
  size?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label,
  sublabel,
  size = 76,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={styles.percentageText}>%{Math.round(percentage)}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sublabel}>{sublabel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginHorizontal: 8 },
  ring: {
    borderWidth: 5,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: { fontSize: 13, fontWeight: '800', color: '#2563EB' },
  label: { fontSize: 12, fontWeight: '700', color: '#111827', marginTop: 6 },
  sublabel: { fontSize: 11, color: '#6B7280' },
});
