import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const ReferralScreen = ({ navigation }) => {
  const referralCode = 'GOCLUTCH2024';
  const referralLink = 'https://goclutch.app/refer/GOCLUTCH2024';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join GoClutch for roadside assistance! Use my referral code ${referralCode} and get exclusive benefits. ${referralLink}`,
        title: 'Refer & Earn with GoClutch',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.referralCard}>
          <View style={styles.referralIcon}>
            <MaterialCommunityIcons name="gift" size={40} color={Colors.PRIMARY} />
          </View>
          <Text style={styles.referralTitle}>Earn Rewards!</Text>
          <Text style={styles.referralDescription}>
            Share your referral code with friends and earn rewards for every successful referral
          </Text>
        </View>

        <View style={styles.codeSection}>
          <Text style={styles.sectionTitle}>Your Referral Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.code}>{referralCode}</Text>
            <TouchableOpacity style={styles.copyButton}>
              <MaterialCommunityIcons name="content-copy" size={20} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.linkSection}>
          <Text style={styles.sectionTitle}>Referral Link</Text>
          <View style={styles.linkBox}>
            <Text style={styles.link} numberOfLines={1}>{referralLink}</Text>
            <TouchableOpacity style={styles.copyButton}>
              <MaterialCommunityIcons name="content-copy" size={20} color={Colors.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.PRIMARY} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Friend Gets ₹500</Text>
              <Text style={styles.benefitDesc}>Your friend gets ₹500 credit</Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.PRIMARY} />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>You Get ₹500</Text>
              <Text style={styles.benefitDesc}>And you earn ₹500 bonus</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <MaterialCommunityIcons name="share-social" size={20} color={Colors.LIGHT_BACKGROUND} />
          <Text style={styles.shareButtonText}>Share Referral Code</Text>
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
  referralCard: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.XL,
    alignItems: 'center',
    marginBottom: Spacing.XL,
  },
  referralIcon: {
    marginBottom: Spacing.M,
  },
  referralTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
    marginBottom: Spacing.S,
  },
  referralDescription: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    textAlign: 'center',
    lineHeight: 20,
  },
  codeSection: {
    marginBottom: Spacing.XL,
  },
  sectionTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  code: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  linkSection: {
    marginBottom: Spacing.XL,
  },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  link: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    flex: 1,
    marginRight: Spacing.S,
  },
  copyButton: {
    padding: Spacing.S,
  },
  benefitsSection: {
    marginBottom: Spacing.XL,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    gap: Spacing.M,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.S,
  },
  shareButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
});

export default ReferralScreen;
