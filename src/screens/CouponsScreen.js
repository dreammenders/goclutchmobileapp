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

const CouponsScreen = ({ navigation }) => {
  const [coupons] = useState([
    { id: '1', code: 'SAVE20', discount: '20% OFF', description: 'On all services', expiry: '30 Dec 2024' },
    { id: '2', code: 'FLAT500', discount: '₹500 OFF', description: 'Minimum ₹1000', expiry: '15 Dec 2024' },
    { id: '3', code: 'WELCOME10', discount: '10% OFF', description: 'First booking', expiry: '31 Dec 2024' },
  ]);

  const renderCouponItem = ({ item }) => (
    <View style={styles.couponCard}>
      <View style={styles.couponLeft}>
        <View style={styles.couponIcon}>
          <MaterialCommunityIcons name="ticket" size={24} color={Colors.PRIMARY} />
        </View>
      </View>
      <View style={styles.couponMiddle}>
        <Text style={styles.couponCode}>{item.code}</Text>
        <Text style={styles.couponDiscount}>{item.discount}</Text>
        <Text style={styles.couponDescription}>{item.description}</Text>
        <Text style={styles.couponExpiry}>Expires: {item.expiry}</Text>
      </View>
      <TouchableOpacity style={styles.claimButton}>
        <Text style={styles.claimButtonText}>Claim</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coupons & Offers</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    gap: Spacing.M,
  },
  couponCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  couponLeft: {
    marginRight: Spacing.M,
  },
  couponIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couponMiddle: {
    flex: 1,
  },
  couponCode: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  couponDiscount: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 4,
  },
  couponExpiry: {
    fontSize: 11,
    color: Colors.WARNING,
    fontWeight: '500',
  },
  claimButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  claimButtonText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
});

export default CouponsScreen;
