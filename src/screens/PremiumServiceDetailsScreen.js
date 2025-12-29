import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import mobileApi from '../api/mobileApi';
import CarouselBanner from '../components/CarouselBanner';
import FloatingCartOverlay from '../components/FloatingCartOverlay';
import { useCart } from '../context/CartContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const responsiveSize = (size) => {
  const baseWidth = 375;
  return Math.round((size * screenWidth) / baseWidth);
};

const PremiumServiceDetailsScreen = ({ navigation, route }) => {
  const { service } = route.params || {};
  const insets = useSafeAreaInsets();
  const [inclusions, setInclusions] = useState([]);
  const [dynamicFeatures, setDynamicFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (service?.serviceId) {
      fetchServiceDetails();
    }
  }, [service?.serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await mobileApi.getServiceDetails(service.serviceId);
      
      if (response?.success && response?.data) {
        const { inclusions: incl, features: feat } = response.data;
        setInclusions(Array.isArray(incl) ? incl : []);
        setDynamicFeatures(Array.isArray(feat) ? feat : []);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
      setInclusions([]);
      setDynamicFeatures([]);
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={60} color={Colors.PRIMARY} />
          <Text style={styles.errorText}>Service details not found</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    serviceTitle,
    features = [],
    originalPrice,
    discountedPrice,
    finalPrice,
    sessionalOffPrice = 0,
    sessionalOffText = '',
    discountPercentage,
    imageUrl,
    promoOffer,
    isRecommended,
  } = service;



  // Safe price formatting helper
  const formatPrice = (price) => {
    try {
      const num = Number(price) || 0;
      return isNaN(num) ? '0' : num.toLocaleString();
    } catch (err) {
      console.error('Error formatting price:', err);
      return '0';
    }
  };

  const calculateSavings = () => {
    try {
      const original = Number(originalPrice) || 0;
      const final = Number(finalPrice) || 0;
      const savings = Math.max(0, original - final);
      return isNaN(savings) ? 0 : savings;
    } catch (err) {
      console.error('Error calculating savings:', err);
      return 0;
    }
  };



  const heroBanners = [
    {
      id: 'banner1',
      icon: '⚙️',
      title: 'Professional Service',
      subtitle: 'Expert technicians with certified skills',
      colors: ['#fe5110', '#ff7043'],
    },
    {
      id: 'banner2',
      icon: '✨',
      title: 'Quality Assurance',
      subtitle: 'Genuine parts and premium quality',
      colors: ['#6366F1', '#818cf8'],
    },
    {
      id: 'banner3',
      icon: '⏱️',
      title: 'Quick Turnaround',
      subtitle: 'Fast service without compromising quality',
      colors: ['#10b981', '#34d399'],
    },
    {
      id: 'banner4',
      icon: '🛡️',
      title: 'Extended Warranty',
      subtitle: '6 months guarantee on all services',
      colors: ['#f59e0b', '#fbbf24'],
    },
    {
      id: 'banner5',
      icon: '💰',
      title: 'Best Pricing',
      subtitle: 'Competitive rates with special discounts',
      colors: ['#ec4899', '#f472b6'],
    },
  ];

  const testimonials = [
    {
      id: '1',
      name: 'Rohit Sharma',
      location: 'Bengaluru',
      feedback: 'Great experience throughout the service. The team kept me updated and delivered on time.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Sneha Desai',
      location: 'Hyderabad',
      feedback: 'Super convenient booking and reliable technicians. My car feels brand new after every visit.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Vikram Patel',
      location: 'Mumbai',
      feedback: 'Transparent pricing, quick turnaround, and genuine spares. Highly recommend Go Clutch.',
      rating: 5,
    },
  ];

  const bannerWidth = Math.max(screenWidth - Spacing.SCREEN_HORIZONTAL * 2, 280);
  const bannerHeight =
    screenWidth < 400
      ? Math.max(160, Math.min(200, bannerWidth * 0.5))
      : screenWidth < 600
      ? Math.max(180, Math.min(240, bannerWidth * 0.55))
      : Math.max(200, Math.min(280, bannerWidth * 0.6));
  const testimonialCardWidth = Math.max(
    screenWidth - Spacing.SCREEN_HORIZONTAL * 2 - Spacing.M,
    260
  );

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle} numberOfLines={2}>
            {serviceTitle}
          </Text>
        </View>
        {isRecommended && (
          <View style={styles.recommendedBadgeSmall}>
            <MaterialCommunityIcons name="check-circle" size={20} color="#2ECC71" />
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner Carousel Section */}
        <CarouselBanner banners={heroBanners} autoPlayInterval={4000} />

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Original Price</Text>
              <Text style={styles.originalPriceText}>
                ₹{formatPrice(originalPrice)}
              </Text>
            </View>
            <View style={styles.priceArrow}>
              <MaterialCommunityIcons name="arrow-right" size={24} color={Colors.PRIMARY} />
            </View>
            <View>
              <Text style={styles.priceLabel}>Your Price</Text>
              <Text style={styles.discountedPriceText}>
                ₹{formatPrice(finalPrice)}
              </Text>
            </View>
          </View>

          <View style={styles.savingsRow}>
            <MaterialCommunityIcons name="tag-multiple" size={20} color="#2ECC71" />
            <View style={styles.savingsText}>
              <Text style={styles.savingsLabel}>You Save</Text>
              <Text style={styles.savingsAmount}>
                ₹{formatPrice(calculateSavings())}
              </Text>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>What's Included</Text>
          </View>

          {/* Images Grid - 3 columns */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.PRIMARY} />
              <Text style={styles.loadingText}>Loading details...</Text>
            </View>
          ) : (
            <>
              <View style={styles.imagesGrid}>
                {Array.isArray(inclusions) && inclusions.length > 0 ? (
                  inclusions.map((item) => (
                    <View key={item.id} style={styles.imageGridItem}>
                      <View style={styles.imageBox}>
                        <Image
                          source={{ uri: item.image_url }}
                          style={styles.includeImage}
                          resizeMode="cover"
                          onError={() => console.log(`Error loading image for ${item.title}`)}
                        />
                      </View>
                      <Text style={styles.imageTitle}>{item.title}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noFeaturesText}>No inclusions available</Text>
                )}
              </View>

              {/* Extra Go Clutch Services Section */}
              {Array.isArray(dynamicFeatures) && dynamicFeatures.length > 0 && (
                <View style={styles.extraServicesSection}>
                  <View style={styles.extraServicesTitleContainer}>
                    <MaterialCommunityIcons name="star-circle" size={responsiveSize(24)} color={Colors.PRIMARY} />
                    <Text style={styles.extraServicesTitle}>Extra Go Clutch Services</Text>
                  </View>
                </View>
              )}

              {/* Features List */}
              <View style={styles.featuresList}>
                {Array.isArray(dynamicFeatures) && dynamicFeatures.length > 0 ? (
                  dynamicFeatures.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <View style={styles.featureDot} />
                      <Text style={styles.featureText}>{feature.title}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noFeaturesText}>No features available</Text>
                )}
              </View>
            </>
          )}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="shield-check" size={24} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitle}>Go Clutch Benefits</Text>
          </View>

          <FlatList
            data={[
              {
                id: '1',
                title: 'Recommended Spares',
                icon: 'package-variant',
              },
              {
                id: '2',
                title: 'Live Updates',
                icon: 'update',
              },
              {
                id: '3',
                title: 'Same Day Delivery',
                icon: 'truck-fast',
              },
            ]}
            renderItem={({ item }) => (
              <View style={styles.benefitCarouselItem}>
                <View style={styles.benefitCarouselIcon}>
                  <MaterialCommunityIcons name={item.icon} size={32} color={Colors.PRIMARY} />
                </View>
                <Text style={styles.benefitCarouselLabel}>{item.title}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.benefitCarouselContent}
            scrollEventThrottle={16}
          />
        </View>

        <View
          style={[
            styles.subscriptionBannerContainer,
            { width: bannerWidth, height: bannerHeight },
          ]}
        >
          <Image
            source={require('../../assets/subscription/subscriptionbanner.png')}
            style={styles.subscriptionBannerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.testimonialsSection}>
          <View style={styles.sectionHeaderLarge}>
            <MaterialCommunityIcons name="chat-outline" size={28} color={Colors.PRIMARY} />
            <Text style={styles.sectionTitleLarge}>Customer Testimonials</Text>
          </View>
          <FlatList
            data={testimonials}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.testimonialCard, { width: testimonialCardWidth }]}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.testimonialAvatar}>
                    <Text style={styles.testimonialAvatarText}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.testimonialInfo}>
                    <Text style={styles.testimonialName}>{item.name}</Text>
                    <Text style={styles.testimonialLocation}>{item.location}</Text>
                  </View>
                  <View style={styles.testimonialRating}>
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name="star"
                        size={responsiveSize(14)}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.testimonialText}>{item.feedback}</Text>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialCarouselContent}
            ItemSeparatorComponent={() => <View style={{ width: Spacing.M }} />}
            snapToInterval={testimonialCardWidth + Spacing.M}
            decelerationRate="fast"
            snapToAlignment="start"
            scrollEventThrottle={16}
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <FloatingCartOverlay />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: Spacing.XS,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.M,
  },
  headerTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  recommendedBadgeSmall: {
    padding: Spacing.XS,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.L,
  },
  imageSection: {
    padding: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#F9F9F9',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: responsiveSize(280),
    borderRadius: responsiveSize(16),
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: responsiveSize(12),
    right: responsiveSize(12),
    backgroundColor: '#D32F2F',
    borderRadius: responsiveSize(8),
    paddingVertical: responsiveSize(8),
    paddingHorizontal: responsiveSize(12),
    alignItems: 'center',
  },
  discountBadgeText: {
    fontSize: responsiveSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  discountBadgeLabel: {
    fontSize: responsiveSize(12),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pricingCard: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginVertical: Spacing.M,
    backgroundColor: '#F9F9F9',
    borderRadius: responsiveSize(12),
    padding: Spacing.M,
    borderWidth: 1.5,
    borderColor: '#FF9800',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.M,
  },
  priceLabel: {
    fontSize: responsiveSize(12),
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  originalPriceText: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: Colors.TEXT_MUTED,
    textDecorationLine: 'line-through',
  },
  discountedPriceText: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  priceArrow: {
    alignItems: 'center',
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    borderRadius: responsiveSize(8),
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  savingsText: {
    marginLeft: Spacing.S,
    flex: 1,
  },
  savingsLabel: {
    fontSize: responsiveSize(12),
    color: '#2ECC71',
    fontWeight: '600',
  },
  savingsAmount: {
    fontSize: responsiveSize(16),
    fontWeight: '700',
    color: '#2ECC71',
  },
  featuresSection: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginTop: 0,
    marginBottom: Spacing.M,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  sectionTitle: {
    fontSize: responsiveSize(16),
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.S,
  },
  sectionHeaderLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  sectionTitleLarge: {
    fontSize: responsiveSize(16),
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.S,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.XL,
  },
  loadingText: {
    marginTop: Spacing.M,
    fontSize: responsiveSize(14),
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  imageGridItem: {
    width: '31%',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: responsiveSize(12),
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: Spacing.S,
  },
  includeImage: {
    width: '100%',
    height: '100%',
  },
  imageTitle: {
    fontSize: responsiveSize(12),
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: responsiveSize(16),
  },
  extraServicesSection: {
    marginTop: Spacing.M,
    marginBottom: Spacing.S,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  extraServicesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.S,
  },
  extraServicesTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    flex: 1,
  },
  featuresList: {
    backgroundColor: '#F9F9F9',
    borderRadius: responsiveSize(12),
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 0,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.M,
  },
  featureDot: {
    width: responsiveSize(8),
    height: responsiveSize(8),
    borderRadius: responsiveSize(4),
    backgroundColor: Colors.PRIMARY,
    marginRight: Spacing.M,
    marginTop: responsiveSize(6),
  },
  featureText: {
    fontSize: responsiveSize(14),
    color: Colors.TEXT_PRIMARY,
    flex: 1,
    lineHeight: responsiveSize(20),
  },
  noFeaturesText: {
    fontSize: responsiveSize(13),
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: Spacing.M,
  },
  benefitsSection: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginTop: 0,
    marginBottom: Spacing.M,
  },
  benefitCarouselContent: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    gap: Spacing.M,
  },
  benefitCarouselItem: {
    width: (screenWidth - Spacing.SCREEN_HORIZONTAL * 2 - Spacing.M * 4) / 3,
    height: responsiveSize(120),
    backgroundColor: '#F9F9F9',
    borderRadius: responsiveSize(12),
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCarouselIcon: {
    width: responsiveSize(50),
    height: responsiveSize(50),
    borderRadius: responsiveSize(25),
    backgroundColor: Colors.LIGHT_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  benefitCarouselLabel: {
    fontSize: responsiveSize(11),
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: responsiveSize(13),
  },
  subscriptionBannerContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: responsiveSize(12),
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: Spacing.L,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  subscriptionBannerImage: {
    width: '100%',
    height: '100%',
  },
  testimonialsSection: {
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    marginBottom: 0,
  },
  testimonialCarouselContent: {
    paddingTop: Spacing.S,
    paddingBottom: 0,
    paddingRight: Spacing.SCREEN_HORIZONTAL,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: responsiveSize(12),
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  testimonialAvatar: {
    width: responsiveSize(44),
    height: responsiveSize(44),
    borderRadius: responsiveSize(22),
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  testimonialAvatarText: {
    color: '#FFFFFF',
    fontSize: responsiveSize(16),
    fontWeight: '700',
  },
  testimonialInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: responsiveSize(14),
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: responsiveSize(2),
  },
  testimonialLocation: {
    fontSize: responsiveSize(12),
    color: Colors.TEXT_SECONDARY,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: Spacing.XS,
  },
  testimonialText: {
    fontSize: responsiveSize(13),
    color: Colors.TEXT_PRIMARY,
    lineHeight: responsiveSize(18),
  },
  spacer: {
    height: Spacing.M,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  errorText: {
    fontSize: responsiveSize(16),
    color: Colors.TEXT_PRIMARY,
    marginVertical: Spacing.M,
    textAlign: 'center',
  },
  backBtn: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: responsiveSize(8),
    paddingVertical: responsiveSize(10),
    paddingHorizontal: responsiveSize(20),
    marginTop: Spacing.M,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: responsiveSize(14),
    fontWeight: '600',
  },
});

export default PremiumServiceDetailsScreen;
