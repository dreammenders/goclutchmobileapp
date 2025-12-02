import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const PaymentMethodsScreen = ({ navigation }) => {
  const [paymentMethods] = useState([
    { id: '1', type: 'card', label: 'Visa Card', value: '**** **** **** 4521', icon: 'credit-card' },
    { id: '2', type: 'upi', label: 'UPI', value: 'user@okhdfcbank', icon: 'mobile-pay' },
    { id: '3', type: 'wallet', label: 'GoClutch Wallet', value: 'Available', icon: 'wallet' },
  ]);

  const renderPaymentMethod = ({ item }) => (
    <View style={styles.paymentCard}>
      <View style={styles.paymentIcon}>
        <MaterialCommunityIcons name={item.icon} size={24} color={Colors.PRIMARY} />
      </View>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentLabel}>{item.label}</Text>
        <Text style={styles.paymentValue}>{item.value}</Text>
      </View>
      <View style={styles.paymentActions}>
        <TouchableOpacity style={styles.editIconButton}>
          <MaterialCommunityIcons name="pencil" size={18} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteIconButton}>
          <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information" size={20} color={Colors.PRIMARY} />
          <Text style={styles.infoText}>Manage your payment methods securely</Text>
        </View>

        <FlatList
          data={paymentMethods}
          renderItem={renderPaymentMethod}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color={Colors.LIGHT_BACKGROUND} />
          <Text style={styles.addButtonText}>Add Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  backButton: {
    marginRight: Spacing.M,
  },
  headerTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  scrollContent: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.L,
    paddingBottom: Spacing.XL,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.PRIMARY}15`,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.XL,
    gap: Spacing.S,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.BODY_S,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  listContent: {
    gap: Spacing.M,
    marginBottom: Spacing.M,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  paymentValue: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: Spacing.S,
  },
  editIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.S,
  },
  addButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
});

export default PaymentMethodsScreen;
