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
  const { service } = route.params || {};
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, [service]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const plansData = await mobileApi.getPlansByService(service.id);
      setPlans(plansData || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load service plans');
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
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

    // Use first plan if available, otherwise use default values
    const firstPlan = plans.length > 0 ? plans[0] : null;
    const durationMonths = firstPlan?.duration_months || 6;
    const warrantyMonths = firstPlan?.warranty_months || 3;
    const originalPrice = firstPlan?.price || 4813;
    const discountedPrice = firstPlan?.discount_price || firstPlan?.price || 3369;
    const discountPercentage = firstPlan ? getDiscountPercentage(originalPrice, discountedPrice) : 30;

    // Define specific features based on service type
    let serviceFeatures = [];
    if (service.name === 'AC Service') {
      serviceFeatures = [
        'AC gas refill and leak check',
        'Air filter cleaning & replacement',
        'Cooling performance test',
        '6 months warranty coverage'
      ];
    } else if (service.name === 'Major Services') {
      serviceFeatures = [
        'Comprehensive vehicle inspection',
        'Engine and transmission diagnostics',
        'Brake system evaluation',
        'Electrical system check'
      ];
    } else if (service.name === 'Car Detailing') {
      serviceFeatures = [
        'Professional paint rubbing & polishing',
        'Removes scratches and swirl marks',
        'Restores original paint shine',
        '3 months warranty coverage'
      ];
    } else {
      // Default features for other services
      serviceFeatures = [
        `Every ${durationMonths} Months / ${durationMonths * 10000} Kms`,
        `Takes ${durationMonths} Hours`,
        `${warrantyMonths} Months Warranty`,
        `Includes ${durationMonths * 2} Services`
      ];
    }

    return {
      isRecommended: true, // You can make this dynamic based on service properties
      serviceTitle: service.name === 'AC Service' ? 'Standard AC Service' : (service.name === 'Major Services' ? 'Full Car Inspection' : (service.name === 'Denting & Painting' ? 'Single Panel' : (service.name === 'Car Detailing' ? 'Car Rubbing & Polishing' : (service.name || 'Service')))),
      features: serviceFeatures,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      discountPercentage: discountPercentage,
      imageUrl: service.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=SERVICE",
      promoOffer: {
        title: "Winter offer - RS. 200",
        cashback: "Go Clutch Coin Cashback - 100",
        finalPrice: `Go CLutch Final Discounted Price - ${discountedPrice - 200}`
      }
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

  const quickServices = [
    { id: 1, name: 'Periodic Service', icon: 'wrench' },
    { id: 2, name: 'Denting & Painting', icon: 'brush' },
    { id: 3, name: 'Major Services', icon: 'car-cog' },
    { id: 4, name: 'AC Service', icon: 'air-conditioner' },
    { id: 5, name: 'Car Detailing', icon: 'car-polish' },
    { id: 6, name: 'Tyres', icon: 'tire' },
    { id: 7, name: 'Car Spa & Wash', icon: 'car-wash' },
    { id: 8, name: 'Clutch & Suspension', icon: 'car-shift-pattern' },
  ];

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

        {/* Periodic Service Plans Heading */}
        {/* <View style={styles.plansHeading}>
          <MaterialCommunityIcons name="calendar-clock" size={24} color={Colors.PRIMARY} />
          <Text style={styles.plansHeadingTitle}>Periodic Service Plans</Text>
        </View> */}

        <ServicePackageCard
          {...serviceData}
          onPress={() => handleViewDetails(serviceData)}
        />

        {/* Single Banner for AC Services */}
        {(service?.name === 'AC Service' || service?.name === 'Car AC\nService') && (
          <View style={styles.acBannerContainer}>
            <View style={styles.acBannerContent}>
              <View style={styles.acBannerIconContainer}>
                <MaterialCommunityIcons name="air-conditioner" size={50} color="#FFFFFF" />
              </View>
              <View style={styles.acBannerTextContainer}>
                <Text style={styles.acBannerTitle}>🌡️ Premium AC Service</Text>
                <Text style={styles.acBannerSubtitle}>Beat the heat with expert AC maintenance</Text>
                <Text style={styles.acBannerDescription}>
                  • Complete AC system diagnosis{'\n'}
                  • Gas recharge & leak repair{'\n'}
                  • Filter cleaning & replacement{'\n'}
                  • Cooling performance test{'\n'}
                  • 6 months warranty included
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Premium Services Section */}
        <View style={styles.premiumServicesSection}>
          <View style={styles.premiumServicesContainer}>
            {[
              {
                isRecommended: true,
                serviceTitle: (service?.name === 'Tire Service' || service?.name === 'Tyres') ? 'Tyre Replacement' : (service?.name === 'AC Service' ? 'Premium AC Service' : (service?.name === 'Major Services' ? 'Major Overhauling' : (service?.name === 'Denting & Painting' ? 'Full body Paint' : (service?.name === 'Periodic Service' ? 'Premium Service' : 'Ceramic Coating')))),
                features: (service?.name === 'Tire Service' || service?.name === 'Tyres') ? [
                  'Complete tire replacement service',
                  'Wheel balancing and alignment',
                  'Tire pressure monitoring',
                  'Safety inspection included'
                ] : (service?.name === 'AC Service' ? [
                  'Complete AC system overhaul',
                  'Compressor and condenser service',
                  'Evaporator deep cleaning',
                  'Advanced leak detection & repair'
                ] : (service?.name === 'Major Services' ? [
                  'Complete engine overhauling',
                  'Transmission system rebuild',
                  'Suspension and brake overhaul',
                  'Extended performance warranty'
                ] : (service?.name === 'Denting & Painting' ? [
                  'Complete vehicle body painting',
                  'Color matching and blending',
                  'Scratch and dent repair',
                  'Professional finish guarantee'
                ] : (service?.name === 'Periodic Service' ? [
                  'Comprehensive vehicle inspection',
                  'Premium oil and filter replacement',
                  'Advanced diagnostics and tuning',
                  'Extended warranty coverage'
                ] : [
                  '9H ceramic coating application',
                  'UV protection & gloss enhancement',
                  'Hydrophobic properties',
                  'Long-lasting protection (2 years)'
                ])))),
                originalPrice: 8000,
                discountedPrice: 6400,
                discountPercentage: 20,
                imageUrl: service.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=CERAMIC",
                promoOffer: {
                  title: "Ceramic offer - RS. 400",
                  cashback: "Go Clutch Coin Cashback - 200",
                  finalPrice: `Go CLutch Final Discounted Price - ${6400 - 400}`
                }
              },
              // Additional cards for car detailing services and tire services
              ...(service?.name?.toLowerCase().includes('detail') ? [
                {
                  isRecommended: false,
                  serviceTitle: '3M Teflon Coating',
                  features: [
                    'Premium 3M Teflon protection',
                    'Scratch & stain resistance',
                    'Easy cleaning properties',
                    '1 year warranty coverage'
                  ],
                  originalPrice: 4500,
                  discountedPrice: 3600,
                  discountPercentage: 20,
                  imageUrl: service.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=3M",
                  promoOffer: {
                    title: "3M Teflon offer - RS. 250",
                    cashback: "Go Clutch Coin Cashback - 125",
                    finalPrice: `Go CLutch Final Discounted Price - ${3600 - 250}`
                  }
                },
                {
                  isRecommended: false,
                  serviceTitle: 'PPF Coating',
                  features: [
                    'Paint Protection Film application',
                    'Self-healing properties',
                    'UV & stone chip protection',
                    '5 year warranty included'
                  ],
                  originalPrice: 12000,
                  discountedPrice: 9600,
                  discountPercentage: 20,
                  imageUrl: service.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=PPF",
                  promoOffer: {
                    title: "PPF offer - RS. 600",
                    cashback: "Go Clutch Coin Cashback - 300",
                    finalPrice: `Go CLutch Final Discounted Price - ${9600 - 600}`
                  }
                }
              ] : []).concat(
                (service?.name === 'Tire Service' || service?.name === 'Tyres') ? [
                  {
                    isRecommended: false,
                    serviceTitle: 'Wheel Alignment',
                    features: [
                      'Professional wheel alignment service',
                      'Improved vehicle handling & stability',
                      'Extended tire lifespan',
                      'Better fuel efficiency'
                    ],
                    originalPrice: 1500,
                    discountedPrice: 1200,
                    discountPercentage: 20,
                    imageUrl: service.image_url || "https://via.placeholder.com/120x120/FF8C42/FFFFFF?text=ALIGNMENT",
                    promoOffer: {
                      title: "Alignment offer - RS. 100",
                      cashback: "Go Clutch Coin Cashback - 50",
                      finalPrice: `Go CLutch Final Discounted Price - ${1200 - 100}`
                    }
                  }
                ] : []
              )
            ].map((premiumService, index) => (
              <ServicePackageCard
                key={index}
                {...premiumService}
                onPress={() => handleViewDetails(premiumService)}
              />
            ))}
          </View>
        </View>

        {/* Single Banner for Periodic Service */}
        {service?.name === 'Periodic Service' && (
          <View style={styles.singleBannerContainer}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>🚗 Complete Car Care Package</Text>
                <Text style={styles.bannerSubtitle}>Get comprehensive maintenance for your vehicle</Text>
                <Text style={styles.bannerDescription}>
                  • Engine oil & filter replacement{'\n'}
                  • Air filter & cabin filter service{'\n'}
                  • Brake system inspection{'\n'}
                  • Battery & electrical check{'\n'}
                  • 6 months warranty coverage
                </Text>
              </View>
              <View style={styles.bannerImageContainer}>
                <View style={styles.bannerImagePlaceholder}>
                  <MaterialCommunityIcons name="car-cog" size={60} color={Colors.PRIMARY} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Single Banner for Denting & Painting Service */}
        {(service?.name === 'Denting & Painting' || service?.name === 'Denting &\nPainting') && (
          <View style={styles.singleBannerContainer}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>🎨 Premium Paint Protection</Text>
                <Text style={styles.bannerSubtitle}>Restore your car's perfect finish</Text>
                <Text style={styles.bannerDescription}>
                  • Professional dent removal{'\n'}
                  • Perfect color matching{'\n'}
                  • Scratch & swirl mark repair{'\n'}
                  • Multi-layer paint application{'\n'}
                  • 12 months paint warranty
                </Text>
              </View>
              <View style={styles.bannerImageContainer}>
                <View style={styles.bannerImagePlaceholder}>
                  <MaterialCommunityIcons name="brush" size={60} color={Colors.PRIMARY} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Single Banner for Major Services */}
        {service?.name === 'Major Services' && (
          <View style={styles.singleBannerContainer}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>🔧 Complete Vehicle Overhaul</Text>
                <Text style={styles.bannerSubtitle}>Comprehensive maintenance for peak performance</Text>
                <Text style={styles.bannerDescription}>
                  • Engine rebuilding & optimization{'\n'}
                  • Transmission system overhaul{'\n'}
                  • Suspension & brake replacement{'\n'}
                  • Electrical system diagnostics{'\n'}
                  • 24 months extended warranty
                </Text>
              </View>
              <View style={styles.bannerImageContainer}>
                <View style={styles.bannerImagePlaceholder}>
                  <MaterialCommunityIcons name="car-cog" size={60} color={Colors.PRIMARY} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Single Banner for Tyre Maintenance */}
        {(service?.name === 'Tyres' || service?.name === 'Tire Service') && (
          <View style={styles.singleBannerContainer}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>🛞 Premium Tyre Solutions</Text>
                <Text style={styles.bannerSubtitle}>Safety and performance on every road</Text>
                <Text style={styles.bannerDescription}>
                  • Premium brand tyre replacement{'\n'}
                  • Computerized wheel alignment{'\n'}
                  • Advanced balancing technology{'\n'}
                  • TPMS sensor programming{'\n'}
                  • 6 months alignment warranty
                </Text>
              </View>
              <View style={styles.bannerImageContainer}>
                <View style={styles.bannerImagePlaceholder}>
                  <MaterialCommunityIcons name="tire" size={60} color={Colors.PRIMARY} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Premium Periodic Service Layout */}
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
  },
  headerTitle: {
    fontSize: responsiveSize(18),
    fontWeight: '600',
    color: '#000000',
  },
  scrollContainer: {
    flex: 1,
  },
  servicesNavigator: {
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  navigatorTitle: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: '#000000',
    marginBottom: Spacing.S,
  },
  servicesScrollContent: {
    paddingRight: Spacing.SCREEN_HORIZONTAL,
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: responsiveSize(12),
    paddingVertical: Spacing.S,
    paddingHorizontal: Spacing.M,
    marginRight: Spacing.S,
    minWidth: responsiveSize(80),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeServiceCard: {
    backgroundColor: '#FFF3E0',
    borderColor: Colors.PRIMARY,
  },
  serviceIconContainer: {
    width: responsiveSize(40),
    height: responsiveSize(40),
    borderRadius: responsiveSize(20),
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
    fontSize: responsiveSize(12),
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
    marginTop: Spacing.XL,
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
    marginTop: Spacing.L,
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
    marginTop: Spacing.L,
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
});

export default ServiceDetailsScreen;
