import React from 'react';
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

const WalletScreen = ({ navigation }) => {
  const walletBalance = 2450;
  const transactions = [
    { id: '1', type: 'credit', amount: 500, description: 'Referral Bonus', date: 'Today' },
    { id: '2', type: 'debit', amount: 299, description: 'Service Payment', date: 'Yesterday' },
    { id: '3', type: 'credit', amount: 100, description: 'Cashback', date: '2 days ago' },
    { id: '4', type: 'debit', amount: 799, description: 'Premium Package', date: '5 days ago' },
  ];

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIcon, item.type === 'credit' ? styles.creditIcon : styles.debitIcon]}>
        <MaterialCommunityIcons
          name={item.type === 'credit' ? 'plus' : 'minus'}
          size={20}
          color={item.type === 'credit' ? '#10B981' : Colors.PRIMARY}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.type === 'credit' ? styles.creditAmount : styles.debitAmount]}>
        {item.type === 'credit' ? '+' : '-'}₹{item.amount}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.walletCard}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Wallet Balance</Text>
            <Text style={styles.balanceAmount}>₹{walletBalance}</Text>
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="plus" size={20} color={Colors.PRIMARY} />
              <Text style={styles.actionButtonText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialCommunityIcons name="send" size={20} color={Colors.PRIMARY} />
              <Text style={styles.actionButtonText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
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
  walletCard: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.XL,
    marginBottom: Spacing.XL,
  },
  balanceSection: {
    marginBottom: Spacing.XL,
  },
  balanceLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    opacity: 0.8,
    marginBottom: Spacing.S,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: Spacing.M,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
    alignItems: 'center',
    gap: Spacing.XS,
  },
  actionButtonText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
  transactionsSection: {
    marginTop: Spacing.M,
  },
  sectionTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.M,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  creditIcon: {
    backgroundColor: '#D1FAE5',
  },
  debitIcon: {
    backgroundColor: `${Colors.PRIMARY}15`,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  transactionAmount: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
  },
  creditAmount: {
    color: '#10B981',
  },
  debitAmount: {
    color: Colors.PRIMARY,
  },
});

export default WalletScreen;
