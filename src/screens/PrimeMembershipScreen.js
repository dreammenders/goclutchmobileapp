import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const GOLD_ACCENT = '#D97706';
const PLATINUM = '#8B5CF6';

const STORAGE_KEYS = {
  SELECTED_VEHICLE: '@selected_vehicle',
};

// Premium features for the Prime membership
const PRIME_BENEFITS = [
  {
    id: 'breakdown',
    icon: 'wrench',
    title: 'Unlimited Breakdown Help',
    detail: 'Anytime, anywhere assistance',
  },
  {
    id: 'towing',
    icon: 'tow-truck',
    title: 'Free Towing',
    detail: '1 complimentary tow',
  },
  {
    id: 'wash',
    icon: 'car-wash',
    title: 'Free Washes',
    detail: '2 premium foam washes',
  },
  {
    id: 'inspection',
    icon: 'clipboard-check',
    title: 'Inspections',
    detail: 'Unlimited 25-point checks',
  },
  {
    id: 'services',
    icon: 'percent',
    title: 'Service Discounts',
    detail: '30% off periodic services',
  },
  {
    id: 'labor',
    icon: 'tools',
    title: 'Labor Discounts',
    detail: '10% off clutch, AC, suspension',
  },
];

// Complete membership perks list
const MEMBERSHIP_PERKS = [
  'Unlimited breakdown assistance – 24/7 roadside support',
  '1 free towing per membership year',
  '2 complimentary premium foam washes (annual)',
  'Unlimited 25-point digital car inspections',
  '30% discount on periodic maintenance services',
  '10% discount on clutch, suspension, and AC labor',
  '10% discount on painting services',
  'Free battery health check and top-up',
  'Priority customer support line',
  'Valid for 13 months from purchase date',
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rohit Sharma',
    saved: '₹24,000',
    serviceCount: '8 services',
    text: 'Prime membership paid for itself on the first service. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sneha Desai',
    saved: '₹18,500',
    serviceCount: '5 services',
    text: 'Best investment for car maintenance. 24/7 support is a lifesaver.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Vikram Patel',
    saved: '₹21,000',
    serviceCount: '7 services',
    text: 'Unlimited breakdown help + massive discounts. Worth every rupee!',
    rating: 5,
  },
];

const FAQS = [
  {
    id: 1,
    question: 'How is Prime different from Gold membership?',
    answer: 'Prime offers 30% off services (vs 15-20% in Gold) with unlimited breakdown help and free towing. Perfect for high-mileage drivers.',
  },
  {
    id: 2,
    question: 'Can I use all services immediately?',
    answer: 'Yes! Your membership is active instantly. All benefits including discounts start working from day one.',
  },
  {
    id: 3,
    question: 'How many services can I use per month?',
    answer: 'Unlimited! Use as many services as you need. No caps, no restrictions, no hidden charges.',
  },
  {
    id: 4,
    question: 'Can I cancel anytime?',
    answer: 'Yes, cancel anytime within 30 days for full refund. After 30 days, remaining months remain valid for your use.',
  },
  {
    id: 5,
    question: 'What if I change my car?',
    answer: 'Prime is transferable to any car you own. Just let us know and we update your membership instantly.',
  },
  {
    id: 6,
    question: 'Is there a money-back guarantee?',
    answer: 'Absolutely! If you don\'t save at least the membership cost in discounts, we refund the difference.',
  },
];

const PrimeMembershipScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const ctaOpacity = useRef(new Animated.Value(1)).current;

  // Determine pricing based on vehicle segment
  const pricing = useMemo(() => {
    if (!selectedVehicle) {
      return { price: '₹999', monthly: 'per month', savingsAmount: '₹24,000' };
    }

    const brand = selectedVehicle.brand?.name || '';
    const segment = selectedVehicle.model?.segment || '';

    // Premium brands get higher pricing
    const premiumBrands = [
      'BMW', 'Mercedes', 'Audi', 'Jaguar', 'Land Rover',
      'Porsche', 'Range Rover', 'Tesla', 'Lexus', 'Infiniti'
    ];

    const isPremium =
      premiumBrands.includes(brand) ||
      segment?.toLowerCase().includes('luxury') ||
      segment?.toLowerCase().includes('premium');

    return {
      price: isPremium ? '₹1,499' : '₹999',
      monthly: 'per month',
      savingsAmount: isPremium ? '₹32,000' : '₹24,000',
      carType: isPremium ? 'Premium/Luxury' : 'Basic/City',
    };
  }, [selectedVehicle]);

  // Load vehicle data on mount
  useEffect(() => {
    loadVehicleData();
  }, []);

  const loadVehicleData = async () => {
    try {
      const vehicleData = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_VEHICLE);
      if (vehicleData) {
        setSelectedVehicle(JSON.parse(vehicleData));
      }
    } catch (error) {
      console.log('Error loading vehicle:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pulse animation for CTA button
  useEffect(() => {
    const ctaAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(ctaOpacity, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(ctaOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    ctaAnimation.start();
    return () => ctaAnimation.stop();
  }, [ctaOpacity]);

  const handleSubscribe = useCallback(() => {
    Alert.alert(
      'Join Prime Membership',
      `Subscribe to Prime at ${pricing.price} per month for 13 months?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: () => {
            Alert.alert('Success', 'You are now a Prime member! Welcome aboard 🎉');
          },
        },
      ]
    );
  }, [pricing]);

  const renderBenefitCard = useCallback(({ item }) => (
    <View style={styles.benefitCard}>
      <View style={styles.benefitIconWrapper}>
        <LinearGradient
          colors={[GOLD_ACCENT, PLATINUM]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.benefitIconGradient}
        >
          <MaterialCommunityIcons name={item.icon} size={28} color="#FFFFFF" />
        </LinearGradient>
      </View>
      <Text style={styles.benefitTitle}>{item.title}</Text>
      <Text style={styles.benefitDetail}>{item.detail}</Text>
    </View>
  ), []);

  const renderPerkItem = ({ item }) => (
    <View style={styles.perkItem}>
      <View style={styles.perkCheckmark}>
        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
      </View>
      <Text style={styles.perkText}>{item}</Text>
    </View>
  );

  const renderTestimonial = useCallback(({ item }) => (
    <View style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialAvatar}>
          <Text style={styles.testimonialAvatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.testimonialInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(item.rating)].map((_, i) => (
              <MaterialCommunityIcons
                key={i}
                name="star"
                size={11}
                color={GOLD_ACCENT}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.testimonialText} numberOfLines={3}>{item.text}</Text>
      <Text style={styles.savingsText}>
        Saved {item.saved} on {item.serviceCount}
      </Text>
    </View>
  ), []);

  const renderFaqItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setExpandedFaqId(expandedFaqId === item.id ? null : item.id)}
      style={styles.faqItem}
    >
      <View style={styles.faqQuestion}>
        <Text style={styles.faqQuestionText}>{item.question}</Text>
        <Ionicons
          name={expandedFaqId === item.id ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={GOLD_ACCENT}
        />
      </View>
      {expandedFaqId === item.id && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GOLD_ACCENT} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={28}
            color={Colors.TEXT_PRIMARY}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Prime Membership</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Banner */}
        <LinearGradient
          colors={['#FFF6E5', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View style={styles.heroHeader}>
            <View style={styles.badgeContainer}>
              <View style={styles.premiumBadge}>
                <MaterialCommunityIcons name="crown" size={14} color={GOLD_ACCENT} />
                <Text style={styles.badgeText}>Prime Membership</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>
              Premium Protection for Your Everyday Drives
            </Text>
            <Text style={styles.heroSubtitle}>
              Unlimited breakdown help, massive discounts, and priority support
            </Text>
          </View>

          {/* Price & Savings Highlight */}
          <View style={styles.priceSection}>
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>Starting at</Text>
              <Text style={styles.priceAmount}>{pricing.price}</Text>
              <Text style={styles.priceCaption}>13 months validity</Text>
            </View>
            <View style={styles.savingsCard}>
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#EC4899" />
              <Text style={styles.savingsLabel}>Save up to</Text>
              <Text style={styles.savingsAmount}>{pricing.savingsAmount}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Vehicle Info Card */}
        {selectedVehicle && (
          <View style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleLabel}>Your Vehicle</Text>
              <Text style={styles.vehicleName} numberOfLines={1}>
                {selectedVehicle.brand?.name} {selectedVehicle.model?.name}
              </Text>
              <Text style={styles.vehicleVariant} numberOfLines={1}>
                {selectedVehicle.variant?.name}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('BrandSelection')}
              style={styles.changeButton}
            >
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Prime Benefits Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Get</Text>
          <FlatList
            data={PRIME_BENEFITS}
            renderItem={renderBenefitCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            columnWrapperStyle={styles.benefitGridWrapper}
            contentContainerStyle={styles.benefitGrid}
          />
        </View>

        {/* Complete Perks List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Complete Membership Perks</Text>
          <FlatList
            data={MEMBERSHIP_PERKS}
            renderItem={renderPerkItem}
            keyExtractor={(_, index) => `perk-${index}`}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            contentContainerStyle={styles.perksList}
          />
        </View>

        {/* Key Stats Section */}
        <View style={styles.statsSection}>
          <LinearGradient
            colors={[PLATINUM, GOLD_ACCENT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsCard}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>16,776+</Text>
              <Text style={styles.statLabel}>Happy Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8★</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Money-Back Guarantee */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#DBEAFE', '#E0F2FE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.guaranteeCard}
          >
            <MaterialCommunityIcons name="shield-check" size={32} color="#0284C7" />
            <Text style={styles.guaranteeTitle}>Money-Back Guarantee</Text>
            <Text style={styles.guaranteeText}>
              If you don't save at least the membership cost in discounts during your membership period, we refund you the difference. Your satisfaction is guaranteed!
            </Text>
          </LinearGradient>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What Members Say</Text>
          <FlatList
            data={TESTIMONIALS}
            renderItem={renderTestimonial}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            contentContainerStyle={styles.testimonialsList}
          />
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <FlatList
            data={FAQS}
            renderItem={renderFaqItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            contentContainerStyle={styles.faqList}
          />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky CTA Button */}
      <Animated.View
        style={[
          styles.stickyCtaWrapper,
          { opacity: ctaOpacity, paddingBottom: insets.bottom },
        ]}
      >
        <LinearGradient
          colors={[GOLD_ACCENT, '#B45309']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaGradient}
        >
          <TouchableOpacity
            activeOpacity={0.92}
            onPress={handleSubscribe}
            style={styles.ctaButton}
          >
            <MaterialCommunityIcons name="crown" size={20} color="#FFFFFF" />
            <Text style={styles.ctaButtonText}>Join Prime • {pricing.price}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  backButton: {
    padding: Spacing.XS,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: Spacing.M,
    paddingTop: Spacing.M,
  },

  // Hero Banner
  heroBanner: {
    borderRadius: 16,
    padding: Spacing.L,
    marginBottom: Spacing.L,
  },
  heroHeader: {
    marginBottom: Spacing.L,
  },
  badgeContainer: {
    marginBottom: Spacing.XS,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.15)',
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.XS,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    marginLeft: Spacing.XS,
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: GOLD_ACCENT,
  },
  heroTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
    lineHeight: 32,
  },
  heroSubtitle: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 20,
  },

  // Price Section
  priceSection: {
    flexDirection: 'row',
    gap: Spacing.MEDIUM,
  },
  priceCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: Spacing.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  priceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: GOLD_ACCENT,
    marginBottom: Spacing.XS,
  },
  priceCaption: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  savingsCard: {
    flex: 1,
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderRadius: 12,
    padding: Spacing.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingsLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EC4899',
  },

  // Vehicle Card
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.M,
    marginBottom: Spacing.L,
    borderLeftWidth: 4,
    borderLeftColor: PLATINUM,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 4,
  },
  vehicleName: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  vehicleVariant: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  changeButton: {
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.XS,
    borderRadius: 8,
    backgroundColor: PLATINUM,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.BODY_S,
    fontWeight: '600',
  },

  // Section Styles
  section: {
    marginBottom: Spacing.L,
  },
  sectionTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },

  // Benefit Cards Grid
  benefitGrid: {
    justifyContent: 'space-between',
  },
  benefitGridWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.M,
  },
  benefitCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.M,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  benefitIconWrapper: {
    marginBottom: Spacing.XS,
  },
  benefitIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    marginBottom: 4,
  },
  benefitDetail: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
  },

  // Perks List
  perksList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: Spacing.MEDIUM,
    overflow: 'hidden',
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.MEDIUM,
  },
  perkCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: GOLD_ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
    marginTop: 2,
    flexShrink: 0,
  },
  perkText: {
    flex: 1,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
    lineHeight: 20,
  },

  // Stats Section
  statsSection: {
    marginBottom: Spacing.L,
  },
  statsCard: {
    borderRadius: 12,
    padding: Spacing.L,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Typography.BODY_S,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: Spacing.MEDIUM,
  },

  // Guarantee Card
  guaranteeCard: {
    borderRadius: 12,
    padding: Spacing.L,
    alignItems: 'center',
  },
  guaranteeTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: Spacing.M,
    marginBottom: Spacing.XS,
  },
  guaranteeText: {
    fontSize: Typography.BODY_M,
    color: '#0C4A6E',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Testimonials
  testimonialsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  testimonialCard: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GOLD_ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.MEDIUM,
  },
  testimonialAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Typography.BODY_M,
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: Spacing.XS,
  },
  savingsText: {
    fontSize: Typography.BODY_S,
    color: PLATINUM,
    fontWeight: '600',
  },

  // FAQ
  faqList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    paddingHorizontal: Spacing.MEDIUM,
    paddingVertical: Spacing.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginRight: Spacing.XS,
  },
  faqAnswer: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 20,
    marginTop: Spacing.M,
  },

  // Sticky CTA
  stickyCtaWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  ctaGradient: {
    paddingHorizontal: Spacing.M,
    paddingTop: Spacing.M,
    paddingBottom: Spacing.M,
  },
  ctaButton: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: Spacing.L,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.XS,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.BODY_M,
    fontWeight: '700',
  },
});

export default PrimeMembershipScreen;