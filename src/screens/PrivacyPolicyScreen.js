import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Last Updated: December 28, 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.sectionText}>
            GoClutch ("we", "our", "us", or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We may collect information about you in a variety of ways. The information we may collect on the Site includes:
          </Text>
          <Text style={styles.bulletPoint}>• Personal Data: Name, email address, phone number, location</Text>
          <Text style={styles.bulletPoint}>• Payment Information: Credit/debit card details, wallet information</Text>
          <Text style={styles.bulletPoint}>• Device Information: Device type, operating system, unique device identifiers</Text>
          <Text style={styles.bulletPoint}>• Usage Data: Features accessed, pages visited, time spent</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Use of Your Information</Text>
          <Text style={styles.sectionText}>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
          </Text>
          <Text style={styles.bulletPoint}>• Process your transactions and send related information</Text>
          <Text style={styles.bulletPoint}>• Email you regarding your account or subscription</Text>
          <Text style={styles.bulletPoint}>• Fulfill and manage your requests</Text>
          <Text style={styles.bulletPoint}>• Improve our services and user experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Disclosure of Your Information</Text>
          <Text style={styles.sectionText}>
            We may share your information with third parties in the following situations:
          </Text>
          <Text style={styles.bulletPoint}>• Service providers who assist us in operating our Application</Text>
          <Text style={styles.bulletPoint}>• For business transfers in case of merger or acquisition</Text>
          <Text style={styles.bulletPoint}>• When required by law or to protect our legal rights</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Security of Your Information</Text>
          <Text style={styles.sectionText}>
            We use administrative, technical, and physical security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have questions or comments about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>privacy@goclutch.com</Text>
          <Text style={styles.contactInfo}>+91 9133959551</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Changes to This Privacy Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other operational, legal, or regulatory reasons.
          </Text>
        </View>

        <View style={styles.acceptedNote}>
          <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
          <Text style={styles.acceptedText}>
            By using GoClutch, you acknowledge that you have read and understood this Privacy Policy.
          </Text>
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
  lastUpdated: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XL,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: Spacing.XL,
  },
  sectionTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  sectionText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 22,
    marginBottom: Spacing.M,
  },
  bulletPoint: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: Spacing.S,
    marginLeft: Spacing.M,
  },
  contactInfo: {
    fontSize: Typography.BODY_S,
    color: Colors.PRIMARY,
    fontWeight: '600',
    marginTop: Spacing.S,
  },
  acceptedNote: {
    flexDirection: 'row',
    backgroundColor: '#D1FAE5',
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    gap: Spacing.S,
    alignItems: 'flex-start',
    marginTop: Spacing.XL,
  },
  acceptedText: {
    flex: 1,
    fontSize: Typography.BODY_S,
    color: '#065F46',
    lineHeight: 20,
  },
});

export default PrivacyPolicyScreen;
