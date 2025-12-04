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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import mobileApi from '../api/mobileApi';
import ServicePackageCard from '../components/ServicePackageCard';
import CarouselBanner from '../components/CarouselBanner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing based on screen width
const responsiveSize = (size) => {
  const baseWidth = 375; // iPhone 6/7/8 width as base
  return Math.round((size * screenWidth) / baseWidth);
};

const ServiceDetailsScreen = ({ navigation, route }) => {
  const { service, modelId, variantId } = route.params || {};
  const [plans, setPlans] = useState([]);
  const [offers, setOffers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    loadServiceData();
  }, [service, modelId, variantId]);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPlans(),
        loadOffers(),
        loadBanners(),
        loadRelatedServices(),
        loadAllServices()
      ]);
    } catch (error) {
      console.error('Error loading service data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlans = async () => {
    try {
      let result;
      if (modelId && variantId) {
        result = await mobileApi.getPlansByModelAndVariant(modelId, variantId, { serviceId: service.id });
      } else {
        result = await mobileApi.getPlansByService(service.id);
      }
      setPlans(result?.data?.plans || []);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadOffers = async () => {
    try {
      const result = await mobileApi.getServiceOffersByService(service.id);
      setOffers(result?.data?.offers || []);
    } catch (error) {
      console.error('Error loading offers:', error);
    }
  };

  const loadBanners = async () => {
    try {
      const result = await mobileApi.getServiceBannersByService(service.id);
      setBanners(result?.data?.banners || []);
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  const loadRelatedServices = async () => {
    try {
      const result = await mobileApi.getRelatedServices(service.id);
      setRelatedServices(result?.data?.related || []);
    } catch (error) {
      console.error('Error loading related services:', error);
    }
  };

  const loadAllServices = async () => {
    try {
      const result = await mobileApi.getServices();
      setAllServices(result?.data?.services || []);
    } catch (error) {
      console.error('Error loading all services:', error);
    }
  };

  const getDiscountPercentage = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };



  const handleViewDetails = (serviceData) => {
    navigation.navigate('PremiumServiceDetails', {
      service: serviceData
    });
  };

  const transformServiceData = () => {
    if (!service) return null;

    const firstPlan = plans.length > 0 ? plans[0] : null;
    const firstOffer = offers.length > 0 ? offers[0] : null;

    const durationMonths = firstPlan?.duration_months || 6;
    const warrantyMonths = firstPlan?.warranty_months || 3;
    const originalPrice = firstPlan?.original_price || firstPlan?.price || 4813;
    const discountedPrice = firstPlan?.discount_price || firstPlan?.price || 3369;
    const discountPercentage = firstPlan ? (firstPlan.discount_percentage || getDiscountPercentage(originalPrice, discountedPrice)) : 30;

    let serviceFeatures = [];
    if (service.description) {
      serviceFeatures = service.description.split('\n').filter(item => item.trim().length > 0);
    }


    let promoOffer = {
      title: "Special Offer",
      cashback: "Go Clutch Coin Cashback",
      finalPrice: discountedPrice
    };

    if (firstOffer) {
      promoOffer = {
        title: firstOffer.title || "Special Offer",
        cashback: firstOffer.cashback_description || "Go Clutch Coin Cashback",
        finalPrice: discountedPrice - (firstOffer.discount_amount || 0)
      };
    }

    return {
      isRecommended: true,
      serviceTitle: service.name || 'Service',
      features: serviceFeatures,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      discountPercentage: discountPercentage,
      imageUrl: service.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=SERVICE",
      sessionalOffPrice: service.sessional_off_price || 0,
      sessionalOffText: service.sessional_off_text || null,
      promoOffer: promoOffer
    };
  };

  const serviceData = transformServiceData();

  const heroBanners = [
    {
      id: 'banner1',
      image: require('../../assets/accessories/Banners/1.png'),
    },
    {
      id: 'banner2',
      image: require('../../assets/accessories/Banners/2.png'),
    },
    {
      id: 'banner3',
      image: require('../../assets/accessories/Banners/3.png'),
    },
  ];

  const getQuickServices = () => {
    if (allServices.length === 0) {
      return [
        { id: 1, name: 'Periodic Service', icon: 'wrench' },
        { id: 2, name: 'Denting & Painting', icon: 'brush' },
        { id: 3, name: 'Major Services', icon: 'car-cog' },
        { id: 4, name: 'AC Service', icon: 'air-conditioner' },
        { id: 5, name: 'Car Detailing', icon: 'car-polish' },
        { id: 6, name: 'Tyres', icon: 'tire' },
      ];
    }
    return allServices.map((svc, idx) => ({
      id: svc.id,
      name: svc.name,
      icon: svc.icon_name || 'wrench'
    }));
  };

  const quickServices = getQuickServices();

  const handleServicePress = (service) => {
    // Navigate to the selected service details
    navigation.navigate('ServiceDetails', {
      service: {
        id: service.id,
        name: service.name,
        // Add other service properties as needed
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fe5110" />
          <Text style={styles.loadingText}>Loading service details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!serviceData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Service not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>{service?.name || 'Service Details'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Quick Services Navigator */}
        <View style={styles.servicesNavigator}>
          <Text style={styles.navigatorTitle}>Quick Access Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollContent}
          >
            {quickServices.map((quickService) => {
              const isActive = quickService.name === service?.name;
              return (
                <TouchableOpacity
                  key={quickService.id}
                  style={[
                    styles.serviceCard,
                    isActive && styles.activeServiceCard
                  ]}
                  onPress={() => handleServicePress(quickService)}
                  activeOpacity={0.7}
                >
                  <View style={styles.serviceIconContainer}>
                    <MaterialCommunityIcons
                      name={quickService.icon}
                      size={24}
                      color={isActive ? Colors.PRIMARY : Colors.TEXT_SECONDARY}
                    />
                  </View>
                  <Text style={[
                    styles.serviceName,
                    isActive && styles.activeServiceName
                  ]}>
                    {quickService.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Hero Banner Carousel */}
        <CarouselBanner banners={heroBanners} autoPlayInterval={3000} />

        {/* Display All Plans */}
        {plans.length > 0 ? (
          plans.map((plan, index) => {
            const planData = {
              isRecommended: plan.is_popular ? true : false,
              serviceTitle: plan.name || 'Service Plan',
              features: plan.description ? plan.description.split('\n').filter(item => item.trim().length > 0) : [],
              originalPrice: plan.original_price || plan.price,
              discountedPrice: plan.discount_price || plan.price,
              discountPercentage: plan.discount_percentage || getDiscountPercentage(plan.original_price || plan.price, plan.discount_price || plan.price),
              imageUrl: plan.image_url,
              promoOffer: {
                title: plan.duration_months && plan.warranty_months ? `Validity: ${plan.duration_months} months | Warranty: ${plan.warranty_months} months` : '',
                cashback: "Go Clutch Coin Cashback",
                finalPrice: plan.discount_price || plan.price
              },
              sessionalOffPrice: plan.sessional_off_price || 0,
              sessionalOffText: plan.sessional_off_text || null
            };
            return (
              <ServicePackageCard
                key={plan.id}
                {...planData}
                onPress={() => handleViewDetails(plan)}
              />
            );
          })
        ) : (
          <ServicePackageCard
            {...serviceData}
            onPress={() => handleViewDetails(serviceData)}
          />
        )}

        {/* Dynamic Service Banners */}
        {banners.map((banner, index) => (
          <View key={banner.id || index} style={styles.acBannerContainer}>
            <View style={styles.acBannerContent}>
              {banner.icon_name && (
                <View style={styles.acBannerIconContainer}>
                  <MaterialCommunityIcons name={banner.icon_name} size={50} color="#FFFFFF" />
                </View>
              )}
              <View style={styles.acBannerTextContainer}>
                <Text style={styles.acBannerTitle}>{banner.title}</Text>
                <Text style={styles.acBannerSubtitle}>{banner.description}</Text>
                {banner.banner_content && Array.isArray(JSON.parse(banner.banner_content || '[]')) && (
                  <Text style={styles.acBannerDescription}>
                    {JSON.parse(banner.banner_content || '[]').map((item, idx) => `• ${item}`).join('\n')}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}

        {/* Premium Services Section - Dynamic from Related Services */}
        {relatedServices.length > 0 && (
          <View style={styles.premiumServicesSection}>
            <View style={styles.premiumServicesContainer}>
              {relatedServices.map((relatedService, index) => (
                <ServicePackageCard
                  key={relatedService.id || index}
                  isRecommended={relatedService.relationship_type === 'premium'}
                  serviceTitle={relatedService.title || relatedService.service_name}
                  features={relatedService.description ? relatedService.description.split('\n').filter(item => item.trim().length > 0) : []}
                  originalPrice={relatedService.original_price || relatedService.discounted_price}
                  discountedPrice={relatedService.discounted_price}
                  discountPercentage={relatedService.discount_percentage || getDiscountPercentage(relatedService.original_price, relatedService.discounted_price)}
                  imageUrl={relatedService.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=SERVICE"}
                  promoOffer={{
                    title: `Special Offer - RS. ${relatedService.original_price - relatedService.discounted_price}`,
                    cashback: "Go Clutch Coin Cashback",
                    finalPrice: relatedService.discounted_price
                  }}
                  sessionalOffPrice={relatedService.sessional_off_price || 0}
                  sessionalOffText={relatedService.sessional_off_text || null}
                  onPress={() => handleViewDetails(relatedService)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Premium Service Layout */}
        <View style={styles.premiumLayout}>
          {/* Service Benefits Section */}
          <View style={styles.benefitsSection}>
            <Text style={styles.benefitsTitle}>Why Choose Our Periodic Service?</Text>
            <View style={styles.benefitsGrid}>
              {[
                { icon: 'shield-check', title: 'Genuine Parts', desc: 'OEM approved components' },
                { icon: 'clock-time-four', title: 'Quick Service', desc: '45-60 minutes completion' },
                { icon: 'certificate', title: 'Warranty', desc: '6 months service warranty' },
                { icon: 'account-supervisor', title: 'Expert Technicians', desc: 'Certified professionals' }
              ].map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <MaterialCommunityIcons name={benefit.icon} size={24} color={Colors.PRIMARY} />
                  </View>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: Spacing.XS,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: Spacing.XS,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  servicesNavigator: {
    backgroundColor: '#FFFFFF',
<<<<<<< HEAD
    paddingVertical: 0,
=======
    paddingVertical: Spacing.S,
>>>>>>> 7362dbab821bb7903539df1513d6bcc484fdefcd
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.M,
    borderBottomWidth: 0,
    borderBottomColor: '#E0E0E0',
  },
  navigatorTitle: {
    fontSize: responsiveSize(14),
    fontWeight: '600',
<<<<<<< HEAD
    color: '#000000',
=======
    color: '#666666',
>>>>>>> 7362dbab821bb7903539df1513d6bcc484fdefcd
    marginBottom: Spacing.XS,
  },
  servicesScrollContent: {
    paddingRight: Spacing.SCREEN_HORIZONTAL,
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: responsiveSize(10),
    paddingVertical: Spacing.XS,
    paddingHorizontal: Spacing.S,
    marginRight: Spacing.XS,
    minWidth: responsiveSize(70),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeServiceCard: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.PRIMARY,
  },
  serviceIconContainer: {
    width: responsiveSize(32),
    height: responsiveSize(32),
    borderRadius: responsiveSize(16),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.XS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceName: {
    fontSize: responsiveSize(11),
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
    lineHeight: responsiveSize(14),
  },
  activeServiceName: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },

  // Premium Layout Styles
  premiumLayout: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.L,
    backgroundColor: '#FFFFFF',
  },


  // Benefits Section
  benefitsSection: {
    marginTop: Spacing.XL,
  },
  benefitsTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: Spacing.L,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitItem: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  benefitIcon: {
    width: responsiveSize(48),
    height: responsiveSize(48),
    borderRadius: responsiveSize(24),
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  benefitTitle: {
    fontSize: responsiveSize(14),
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: responsiveSize(4),
  },
  benefitDesc: {
    fontSize: responsiveSize(12),
    color: '#333333',
    textAlign: 'center',
    lineHeight: responsiveSize(16),
  },

  // Premium Services Section
  premiumServicesSection: {
    marginTop: Spacing.M,
  },
  premiumServicesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.L,
  },
  premiumServicesContainer: {
    gap: Spacing.M,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: responsiveSize(16),
    fontSize: responsiveSize(16),
    color: '#000000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: responsiveSize(16),
    color: '#000000',
    textAlign: 'center',
  },

  // Single Banner Styles
  singleBannerContainer: {
    marginTop: Spacing.S,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: Spacing.L,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
    marginRight: Spacing.M,
  },
  bannerTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    color: '#000000',
    marginBottom: responsiveSize(4),
  },
  bannerSubtitle: {
    fontSize: responsiveSize(14),
    fontWeight: '500',
    color: Colors.PRIMARY,
    marginBottom: responsiveSize(8),
  },
  bannerDescription: {
    fontSize: responsiveSize(12),
    color: '#666666',
    lineHeight: responsiveSize(18),
  },
  bannerImageContainer: {
    alignItems: 'center',
  },
  bannerImagePlaceholder: {
    width: responsiveSize(80),
    height: responsiveSize(80),
    borderRadius: responsiveSize(40),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  // AC Banner Styles
  acBannerContainer: {
    marginTop: Spacing.S,
    marginHorizontal: Spacing.SCREEN_HORIZONTAL,
    backgroundColor: '#00BCD4',
    borderRadius: 16,
    padding: Spacing.L,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  acBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acBannerIconContainer: {
    width: responsiveSize(70),
    height: responsiveSize(70),
    borderRadius: responsiveSize(35),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  acBannerTextContainer: {
    flex: 1,
  },
  acBannerTitle: {
    fontSize: responsiveSize(20),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: responsiveSize(4),
  },
  acBannerSubtitle: {
    fontSize: responsiveSize(14),
    fontWeight: '500',
    color: '#E0F7FA',
    marginBottom: responsiveSize(8),
  },
  acBannerDescription: {
    fontSize: responsiveSize(12),
    color: '#FFFFFF',
    lineHeight: responsiveSize(18),
    opacity: 0.9,
  },
  plansHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  plansHeadingTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginLeft: Spacing.S,
  },
});

export default ServiceDetailsScreen;
