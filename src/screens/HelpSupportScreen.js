import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const HelpSupportScreen = ({ navigation }) => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  
  const faqs = [
    { id: '1', question: 'How do I book a service?', answer: 'You can book services from the home screen by selecting your service type and location.' },
    { id: '2', question: 'What is the cancellation policy?', answer: 'You can cancel within 30 minutes of booking for full refund.' },
    { id: '3', question: 'How long does service usually take?', answer: 'Service time depends on the type but typically ranges from 30 minutes to 2 hours.' },
  ];

  const contactMethods = [
    { id: '1', method: 'Phone', value: '+91 9133959551', icon: 'phone' },
    { id: '2', method: 'Email', value: 'support@goclutch.com', icon: 'email' },
    { id: '3', method: 'Chat', value: 'Start Live Chat', icon: 'chat' },
  ];

  const renderFAQItem = ({ item }) => (
    <TouchableOpacity
      style={styles.faqItem}
      onPress={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <MaterialCommunityIcons
          name={expandedFAQ === item.id ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.PRIMARY}
        />
      </View>
      {expandedFAQ === item.id && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  const renderContactMethod = ({ item }) => (
    <TouchableOpacity style={styles.contactCard}>
      <View style={styles.contactIcon}>
        <MaterialCommunityIcons name={item.icon} size={24} color={Colors.PRIMARY} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactMethod}>{item.method}</Text>
        <Text style={styles.contactValue}>{item.value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.TEXT_SECONDARY} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <FlatList
            data={contactMethods}
            renderItem={renderContactMethod}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.contactList}
          />
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <FlatList
            data={faqs}
            renderItem={renderFAQItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.faqList}
          />
        </View>

        <TouchableOpacity style={styles.ticketButton}>
          <MaterialCommunityIcons name="ticket-outline" size={20} color={Colors.LIGHT_BACKGROUND} />
          <Text style={styles.ticketButtonText}>Create Support Ticket</Text>
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
  contactSection: {
    marginBottom: Spacing.XL,
  },
  sectionTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  contactList: {
    gap: Spacing.M,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  contactInfo: {
    flex: 1,
  },
  contactMethod: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  faqSection: {
    marginBottom: Spacing.XL,
  },
  faqList: {
    gap: Spacing.M,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    flex: 1,
    marginRight: Spacing.S,
  },
  faqAnswer: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.M,
    lineHeight: 20,
  },
  ticketButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.S,
  },
  ticketButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
});

export default HelpSupportScreen;
