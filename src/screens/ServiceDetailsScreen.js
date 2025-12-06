import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import mobileApi from '../api/mobileApi';
import ServicePackageCard from '../components/ServicePackageCard';
import PlansList from '../components/PlansList';
import CarouselBanner from '../components/CarouselBanner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing based on screen width
const responsiveSize = (size) => {
  const baseWidth = 375; // iPhone 6/7/8 width as base
  return Math.round((size * screenWidth) / baseWidth);
};

// Banner images for service cards
const bannerImages = [
  require('../../assets/accessories/Banners/1.png'),
  require('../../assets/accessories/Banners/2.png'),
  require('../../assets/accessories/Banners/3.png'),
  require('../../assets/accessories/Banners/4.png'),
];

// Get banner image based on index
const getBannerImage = (index) => {
  return bannerImages[index % bannerImages.length];
};

// Dynamic gradient colors for each service (cycles through premium palettes)
const getServiceGradient = (index) => {
  const gradients = [
    ['#6366F1', '#8B5CF6'], // Indigo to Purple
    ['#EC4899', '#F43F5E'], // Pink to Rose
    ['#10B981', '#059669'], // Emerald to Green
    ['#F59E0B', '#EF4444'], // Amber to Red
    ['#3B82F6', '#06B6D4'], // Blue to Cyan
    ['#8B5CF6', '#D946EF'], // Purple to Fuchsia
    ['#14B8A6', '#06B6D4'], // Teal to Cyan
    ['#F97316', '#DC2626'], // Orange to Red
  ];
  return gradients[index % gradients.length];
};

const ServiceDetailsScreen = ({ navigation, route }) => {
  const service = route.params?.service;
  let { modelId, variantId } = route.params || {};
  
  // Get model and variant from parent navigator params if not passed directly
  const parentParams = route?.params || navigation?.getState?.()?.routes?.[navigation?.getState?.()?.index]?.params || {};
  const selectedModel = parentParams?.selectedModel || modelId;
  const selectedVariant = parentParams?.selectedVariant || variantId;
  
  modelId = selectedModel?.id || modelId;
  variantId = selectedVariant?.id || variantId;
  const [plans, setPlans] = useState([]);
  const [banners, setBanners] = useState([]);
  const [heroBanners, setHeroBanners] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [plansServiceId, setPlansServiceId] = useState(null);
  const serviceBannerFlatListRef = React.useRef(null);

  const loadPlans = useCallback(async () => {
    try {
      const currentService = route.params?.service;
      const serviceId = currentService?.id;
      
      if (!serviceId) {
        setPlans([]);
        return;
      }
      
      setPlans([]);
      
      let result;
      if (modelId && variantId && String(modelId).trim() && String(variantId).trim()) {
        try {
          result = await mobileApi.getPlansByModelAndVariant(modelId, variantId, { serviceId });
        } catch (error) {
          result = await mobileApi.getPlansByService(serviceId);
        }
      } else {
        result = await mobileApi.getPlansByService(serviceId);
      }
      
      const newPlans = result?.data?.plans || [];
      setPlans(newPlans);
      setPlansServiceId(serviceId);
    } catch (error) {
      setPlans([]);
      setPlansServiceId(null);
    }
  }, [route.params?.service?.id, modelId, variantId]);

  const loadBanners = useCallback(async () => {
    try {
      if (service?.id) {
        const result = await mobileApi.getServiceBannersByService(service.id);
        const allBanners = result?.data?.banners || [];
        setBanners(allBanners.filter(b => b.type === 'info' || b.type === 'promo'));
      }
    } catch (error) {
      setBanners([]);
    }
  }, [service?.id]);

  const loadHeroBanners = useCallback(async () => {
    try {
      if (service?.id) {
        const result = await mobileApi.getServiceBannersByService(service.id);
        const heroBannerData = (result?.data?.banners || []).filter(b => b?.type === 'hero');
        setHeroBanners(Array.isArray(heroBannerData) ? heroBannerData : []);
      }
    } catch (error) {
      setHeroBanners([]);
    }
  }, [service?.id]);

  const loadBenefits = useCallback(async () => {
    try {
      if (service?.id) {
        const result = await mobileApi.getServiceBannersByService(service.id);
        const benefitsData = (result?.data?.banners || []).filter(b => b?.type === 'benefit');
        setBenefits(Array.isArray(benefitsData) ? benefitsData : []);
      }
    } catch (error) {
      setBenefits([]);
    }
  }, [service?.id]);

  const loadAllServices = useCallback(async () => {
    try {
      const result = await mobileApi.getServices();
      setAllServices(result?.data?.services || []);
    } catch (error) {
    }
  }, []);

  const loadServiceData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadPlans(),
        loadBanners(),
        loadHeroBanners(),
        loadBenefits(),
        loadAllServices()
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [loadPlans, loadBanners, loadHeroBanners, loadBenefits, loadAllServices]);



  useEffect(() => {
    if (service?.id) {
      setPlans([]);
      setPlansServiceId(null);
      setBanners([]);
      setHeroBanners([]);
      setBenefits([]);
      setLoading(true);
      
      setTimeout(() => {
        loadServiceData();
      }, 0);
    }
  }, [service?.id]);



  useFocusEffect(
    useCallback(() => {
      if (service?.id) {
        setPlans([]);
        setPlansServiceId(null);
        loadPlans();
      }
      return () => {
      };
    }, [service?.id, modelId, variantId, loadPlans])
  );

  // Auto-rotate service banners carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        // Scroll to next banner
        if (serviceBannerFlatListRef.current) {
          serviceBannerFlatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
        }
        return nextIndex;
      });
    }, 3000); // Rotate every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const calculateFinalPrice = useCallback((plan) => {
    const cutoffPrice = Number(plan?.original_price) || Number(plan?.price) || 0;
    const discountPercentage = Number(plan?.discount_percentage) || 0;
    const discountAmount = discountPercentage > 0 ? Math.round((cutoffPrice * discountPercentage) / 100) : 0;
    const result = {
      cutoffPrice: Math.max(0, cutoffPrice),
      discountAmount: Math.max(0, discountAmount),
      finalPrice: Math.max(0, cutoffPrice - discountAmount)
    };
    return result;
  }, []);

  const handleViewDetails = useCallback((plan) => {
    const currentService = route.params?.service;
    const pricing = calculateFinalPrice(plan);
    const sessionalOffPrice = Number(plan.sessional_off_price) || 0;
    const finalPriceAfterSessionalOff = Math.max(0, (pricing.finalPrice || 0) - sessionalOffPrice);
    
    console.log('🎯 [handleViewDetails] Current service:', currentService?.id, currentService?.name);
    console.log('   Plan:', plan.name, 'Price:', plan.price);
    console.log('   Pricing - cutoff:', pricing.cutoffPrice, 'final:', pricing.finalPrice);
    
    const detailedData = {
      serviceTitle: String(plan.name || 'Service Plan'),
      features: (plan.description && typeof plan.description === 'string') 
        ? plan.description.split('\n').filter(item => item?.trim?.().length > 0).map(f => String(f))
        : [],
      originalPrice: pricing.cutoffPrice || 0,
      discountedPrice: pricing.finalPrice || 0,
      finalPrice: finalPriceAfterSessionalOff,
      sessionalOffPrice: sessionalOffPrice,
      sessionalOffText: String(plan.sessional_off_text || ''),
      discountPercentage: plan.discount_percentage || 0,
      imageUrl: plan.image_url || '',
      promoOffer: {
        title: (plan.duration_months && plan.warranty_months) 
          ? `Validity: ${plan.duration_months} months | Warranty: ${plan.warranty_months} months`
          : 'Service Package',
        cashback: "Go Clutch Coin Cashback",
        finalPrice: finalPriceAfterSessionalOff || 0
      },
      isRecommended: plan.is_popular ? true : false,
      serviceId: currentService?.id,
      serviceName: currentService?.name,
      modelId: modelId,
      variantId: variantId,
      pricing_source: plan.pricing_type || 'default',
    };
    navigation.navigate('PremiumServiceDetails', {
      service: detailedData
    });
  }, [route.params?.service, modelId, variantId, calculateFinalPrice, navigation]);

  const getHeroBannersForDisplay = () => {
    if (heroBanners.length > 0) {
      return heroBanners.map(banner => ({
        id: banner.id,
        title: banner.title,
        description: banner.description,
        image_url: banner.image_url,
        icon_name: banner.icon_name,
      }));
    }
    return [];
  };

  const getQuickServices = () => {
    if (allServices.length === 0) {
      return [
        { id: 1, name: 'Periodic Service', icon: 'wrench', image_url: null },
        { id: 2, name: 'Denting & Painting', icon: 'brush', image_url: null },
        { id: 3, name: 'Major Services', icon: 'car-cog', image_url: null },
        { id: 4, name: 'AC Service', icon: 'air-conditioner', image_url: null },
        { id: 5, name: 'Car Detailing', icon: 'car-polish', image_url: null },
        { id: 6, name: 'Tyres', icon: 'tire', image_url: null },
      ];
    }
    return allServices.map((svc) => ({
      id: svc.id,
      name: svc.name,
      icon: svc.icon_name || 'wrench',
      image_url: svc.image_url || null
    }));
  };

  const quickServices = getQuickServices();

  const handleServicePress = (selectedService) => {
    navigation.navigate('ServiceDetails', {
      service: {
        id: selectedService.id,
        name: selectedService.name,
        description: selectedService.description || '',
        image_url: selectedService.image_url,
        icon_name: selectedService.icon_name,
      },
      modelId,
      variantId,
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

  if (!service) {
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

      <ScrollView key={`plans-section-${service?.id}`} style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Quick Services Navigator */}
        <View style={styles.servicesNavigator}>
          <Text style={styles.navigatorTitle}>Quick Access Services</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesScrollContent}
          >
            {Array.isArray(quickServices) && quickServices.map((quickService, index) => {
              if (!quickService || !quickService.id) return null;
              const isActive = String(quickService.name) === String(service?.name);
              const gradientColors = getServiceGradient(index);
              
              return (
                <TouchableOpacity
                  key={quickService.id}
                  style={[
                    styles.quickServiceCard,
                    isActive && styles.activeQuickServiceCard
                  ]}
                  onPress={() => handleServicePress(quickService)}
                  activeOpacity={0.7}
                >
                  <View style={styles.glassLayer} />
                  <LinearGradient
                    colors={[...gradientColors, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickServiceGradientBg}
                  />
                  <View style={styles.quickServiceIconWrapper}>
                    {quickService.image_url && typeof quickService.image_url === 'string' ? (
                      <View style={styles.quickServiceImageContainer}>
                        <LinearGradient
                          colors={[...gradientColors.map((c) => c + '15')]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.imageBackdrop}
                        />
                        <Image
                          source={{ uri: quickService.image_url }}
                          style={styles.quickServiceImage}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.quickServiceIconBg}
                      >
                        <MaterialCommunityIcons 
                          name={String(quickService.icon || 'wrench')} 
                          size={32} 
                          color="#FFFFFF" 
                        />
                      </LinearGradient>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.serviceName,
                      isActive && styles.activeServiceName
                    ]}
                    numberOfLines={2}
                  >
                    {String(quickService.name || 'Service')}
                  </Text>
                  <View style={styles.shimmerOverlay} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Hero Banner Carousel */}
        {getHeroBannersForDisplay().length > 0 ? (
          <CarouselBanner banners={getHeroBannersForDisplay()} autoPlayInterval={3000} />
        ) : null}

        {/* Service Plans Banners Carousel */}
        <View style={styles.serviceBannersContainer}>
          <FlatList
            ref={serviceBannerFlatListRef}
            data={bannerImages}
            renderItem={({ item }) => (
              <View style={styles.serviceBannersSection}>
                <Image
                  source={item}
                  style={styles.serviceBannerImage}
                />
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            snapToInterval={screenWidth}
            snapToAlignment="start"
            decelerationRate="fast"
            scrollEnabled={false}
            getItemLayout={(data, index) => ({
              length: screenWidth,
              offset: screenWidth * index,
              index,
            })}
          />
        </View>

        {/* Display All Service Plans as Cards */}
        {Array.isArray(plans) && plans.length > 0 && plansServiceId === service?.id && (
          <PlansList
            key={`plansList-${service?.id}-${plans.length}`}
            plans={plans}
            service={service}
            calculateFinalPrice={calculateFinalPrice}
            handleViewDetails={handleViewDetails}
          />
        )}

        {/* Dynamic Service Banners */}
        {Array.isArray(banners) && banners.map((banner, index) => {
          if (!banner) return null;
          let contentArray = [];
          if (banner.banner_content) {
            try {
              const parsed = typeof banner.banner_content === 'string' 
                ? JSON.parse(banner.banner_content)
                : banner.banner_content;
              contentArray = Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              contentArray = [];
            }
          }
          return (
            <View key={banner.id || index} style={styles.acBannerContainer}>
              <View style={styles.acBannerContent}>
                {banner.icon_name && (
                  <View style={styles.acBannerIconContainer}>
                    <MaterialCommunityIcons name={banner.icon_name} size={50} color="#FFFFFF" />
                  </View>
                )}
                <View style={styles.acBannerTextContainer}>
                  {banner.title && <Text style={styles.acBannerTitle}>{String(banner.title)}</Text>}
                  {banner.description && <Text style={styles.acBannerSubtitle}>{String(banner.description)}</Text>}
                  {contentArray.length > 0 && (
                    <View>
                      {contentArray.map((item, idx) => (
                        <Text key={idx} style={styles.acBannerDescription}>
                          • {String(item || '')}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {/* Service Benefits Section - Dynamic */}
        {Array.isArray(benefits) && benefits.length > 0 && (
          <View style={styles.premiumLayout}>
            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>{String(service?.name || 'Service')} Benefits</Text>
              <View style={styles.benefitsGrid}>
                {benefits.map((benefit, index) => {
                  if (!benefit) return null;
                  let benefitContent = [];
                  if (benefit.banner_content) {
                    try {
                      const parsed = typeof benefit.banner_content === 'string'
                        ? JSON.parse(benefit.banner_content)
                        : benefit.banner_content;
                      benefitContent = Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                      benefitContent = [];
                    }
                  }
                  
                  return (
                    <View key={benefit.id || index} style={styles.benefitItem}>
                      <View style={styles.benefitIcon}>
                        <MaterialCommunityIcons 
                          name={benefit.icon_name || 'shield-check'} 
                          size={24} 
                          color={Colors.PRIMARY} 
                        />
                      </View>
                      {benefit.title && <Text style={styles.benefitTitle}>{String(benefit.title)}</Text>}
                      {benefit.description && <Text style={styles.benefitDesc}>{String(benefit.description)}</Text>}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
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
  serviceBannersContainer: {
    marginVertical: Spacing.M,
    backgroundColor: '#FFFFFF',
  },
  serviceBannersSection: {
    width: screenWidth,
    height: responsiveSize(150),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.M,
    gap: Spacing.XS,
  },
  paginationDot: {
    width: responsiveSize(8),
    height: responsiveSize(8),
    borderRadius: responsiveSize(4),
    backgroundColor: '#D0D0D0',
  },
  paginationDotActive: {
    backgroundColor: Colors.PRIMARY,
    width: responsiveSize(24),
    borderRadius: responsiveSize(4),
  },
  servicesNavigator: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.S,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.M,
    borderBottomWidth: 0,
    borderBottomColor: '#E0E0E0',
  },
  navigatorTitle: {
    fontSize: responsiveSize(14),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: Spacing.S,
    letterSpacing: -0.3,
  },
  servicesScrollContent: {
    paddingRight: Spacing.SCREEN_HORIZONTAL,
    paddingLeft: Spacing.S,
  },
  quickServiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    minHeight: 100,
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeQuickServiceCard: {
    borderColor: Colors.PRIMARY,
    elevation: 3,
    shadowOpacity: 0.1,
    backgroundColor: '#FFFBF5',
  },
  glassLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(6px)',
  },
  quickServiceGradientBg: {
    position: 'absolute',
    top: -25,
    right: -25,
    width: 70,
    height: 70,
    borderRadius: 35,
    opacity: 0.1,
  },
  quickServiceIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    zIndex: 2,
  },
  quickServiceImageContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  imageBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  quickServiceImage: {
    width: '88%',
    height: '88%',
    zIndex: 2,
  },
  quickServiceIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  serviceName: {
    fontSize: responsiveSize(10),
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: responsiveSize(12),
    zIndex: 2,
  },
  activeServiceName: {
    color: Colors.PRIMARY,
    fontWeight: '800',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
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
