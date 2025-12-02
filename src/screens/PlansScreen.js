import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const PlansScreen = ({ navigation }) => {
  const [activePlan, setActivePlan] = useState('gold');
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  
  let windowDimensions;
  try {
    windowDimensions = Dimensions.get('window');
  } catch (error) {
    windowDimensions = { width: 400, height: 812 };
  }
  
  const screenWidth = (windowDimensions && typeof windowDimensions === 'object' && windowDimensions.width) ? windowDimensions.width : 400;
  const horizontalPadding = Spacing.SCREEN_HORIZONTAL * 2;
  const contentWidth = Math.max(screenWidth - horizontalPadding, 280);
  const bannerHeight = screenWidth < 400
    ? Math.max(160, Math.min(200, contentWidth * 0.5))
    : screenWidth < 600
    ? Math.max(180, Math.min(240, contentWidth * 0.55))
    : Math.max(200, Math.min(280, contentWidth * 0.6));
  const cardWidth = contentWidth;

  const getBenefitGradient = (index) => {
    const gradients = [
      ['#6366F1', '#8B5CF6'],
      ['#EC4899', '#F43F5E'],
      ['#10B981', '#059669'],
      ['#F59E0B', '#EF4444'],
      ['#3B82F6', '#06B6D4'],
      ['#8B5CF6', '#D946EF'],
      ['#14B8A6', '#06B6D4'],
      ['#F97316', '#DC2626'],
      ['#6366F1', '#8B5CF6'],
    ];
    return gradients[index % gradients.length];
  };

  const userName = 'SANDEEP';
  const phoneNumber = '+91 9876543210';
  const vehicleNumber = 'KA 01 AB 1234';
  const cardNumber = '2847 5932 1247 8564';
  const cvv = '847';
  const planLevel = 'Gold';
  const validFromDate = '01/24';
  const expiryDate = '12/26';
  const accountNumber = '****** GC-2847';

  const toggleCardFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const actions = [
    { id: 'pin', label: 'Set/Reset PIN', icon: 'lock' },
    { id: 'freeze', label: 'Freeze Card', icon: 'snowflake' },
    { id: 'change', label: 'Change Plan', icon: 'refresh' },
    { id: 'details', label: 'Plan Details', icon: 'information' },
  ];

  const handleActionPress = (actionId) => {
    console.log(`Action pressed: ${actionId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.PAGE_BACKGROUND} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.TEXT_PRIMARY}
            />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Subscription Plan</Text>
          </View>

          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        </View>

        {/* Debit Card - Animated Flip Container */}
        <TouchableOpacity
          style={[styles.cardContainer, { width: cardWidth }]}
          onPress={toggleCardFlip}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[styles.cardFlip, { width: cardWidth }, frontAnimatedStyle, { backfaceVisibility: 'hidden' }]}
          >
            <LinearGradient
              colors={['#12071F', '#32145A', '#32145A', '#12071F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.debitCard}
            >
          {/* Decorative Background Pattern - Circles */}
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
          <View style={[styles.decorativeCircle, styles.circle3]} />

          {/* Decorative Background Pattern - Lines */}
          <View style={[styles.decorativeLine, styles.line1]} />
          <View style={[styles.decorativeLine, styles.line2]} />
          <View style={[styles.decorativeLine, styles.line3]} />

          {/* 3D Emboss Effect - Subtle inner shadow for depth */}
          <LinearGradient
            colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.08)', 'rgba(0, 0, 0, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.3 }}
            style={styles.cardEmbossLayer}
          />

          {/* Holographic shimmer effect - Multiple glows */}
          <View style={[styles.hologramicEffect, styles.glow1]} />
          <View style={[styles.hologramicEffect, styles.glow2]} />
          
          {/* Central Watermark Text - GoClutch */}
          <View style={styles.watermarkContainer}>
            <Text style={styles.watermarkText}>GoClutch</Text>
          </View>
          
          {/* Card Content */}
          <View style={styles.cardContent}>
            {/* Top Section with Chip and Logo */}
            <View style={styles.cardTop}>
              <View style={styles.chipSection}>
                <View style={styles.chip}>
                  <LinearGradient
                    colors={['#FFE082', '#FFD54F', '#FFC107', '#FFB300']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chipInner}
                  >
                    {/* Chip grid pattern */}
                    <View style={styles.chipGrid}>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View key={i} style={styles.chipDot} />
                      ))}
                    </View>
                    <MaterialCommunityIcons
                      name="wifi"
                      size={14}
                      color="#8B6914"
                      style={styles.chipIcon}
                    />
                  </LinearGradient>
                  {/* Chip highlight - reflective edge */}
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.chipShine}
                  />
                </View>
              </View>
            </View>

            {/* Account Number with Icon */}
            <View style={styles.accountNumberContainer}>
              <MaterialCommunityIcons name="credit-card" size={14} color="rgba(255, 255, 255, 0.6)" />
              <Text style={styles.cardNumber}>{accountNumber}</Text>
            </View>

            {/* Bottom Section */}
            <View style={styles.cardBottom}>
              <View style={styles.bottomLeftSection}>
                <View style={{marginTop: 8}}>
                  <Text style={styles.cardLabel}>GOLD MEMBER</Text>
                  <Text style={styles.cardNumberSmall}>****{cardNumber.slice(-6)}</Text>
                </View>
              </View>
              <View style={styles.bottomRightSection}>
                <Text style={styles.cardLabel}>VALID FROM</Text>
                <View style={styles.dateRangeContainer}>
                  <Text style={styles.cardExpiry}>{validFromDate}</Text>
                  <Text style={styles.dateSeperator}>-</Text>
                  <Text style={styles.cardExpiry}>{expiryDate}</Text>
                </View>
              </View>
            </View>
          </View>
            </LinearGradient>
          </Animated.View>

          {/* Card Back Side */}
          <Animated.View
            style={[styles.cardFlip, styles.cardBackFace, { width: cardWidth }, backAnimatedStyle, { backfaceVisibility: 'hidden' }]}
          >
            <LinearGradient
              colors={['#12071F', '#32145A', '#32145A', '#12071F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.debitCard}
            >
              <View style={styles.cardBackContent}>
                <View style={styles.cardBackLeftSection}>
                  <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="account" size={16} color="#FFFFFF" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>NAME</Text>
                      <Text style={styles.detailValue}>{userName}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="phone" size={16} color="#FFFFFF" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>PHONE</Text>
                      <Text style={styles.detailValue}>{phoneNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="car" size={16} color="#FFFFFF" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>VEHICLE</Text>
                      <Text style={styles.detailValue}>{vehicleNumber}</Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar-check" size={16} color="#FFFFFF" />
                    <View style={styles.detailContent}>
                      <Text style={styles.detailLabel}>VALIDITY</Text>
                      <Text style={styles.detailValue}>13 Months</Text>
                    </View>
                  </View>
                </View>

                  <View style={styles.cardBackInfoSection}>
                    <View style={styles.infoItem}>
                      <View style={styles.infoBullet} />
                      <Text style={styles.infoText}>This membership card can be used in all Go Clutch Centers</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <View style={styles.infoBullet} />
                      <Text style={styles.infoText}>Breakdown Service Recommended upto 5-8 KM</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.qrCodeContainer}>
                  <View style={styles.qrCodeBox}>
                    <View style={styles.qrCodeGrid}>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
                        <View key={row} style={styles.qrRow}>
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((col) => (
                            <View
                              key={`${row}-${col}`}
                              style={[
                                styles.qrCell,
                                (row === 0 || row === 1 || row === 2 || col === 0 || col === 1 || col === 2 || 
                                 row === 6 || row === 7 || col === 6 || col === 7 || 
                                 (row === 3 && col === 3) || (row === 4 && col === 3)) && styles.qrCellFilled
                              ]}
                            />
                          ))}
                        </View>
                      ))}
                    </View>
                  </View>
                  <Text style={styles.qrLabel}>SCAN</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* Prime Membership Benefits Grid */}
        <View style={styles.primeBenefitsSection}>
          <View style={styles.primeBenefitsTitleContainer}>
            <MaterialCommunityIcons name="crown" size={24} color={Colors.PRIMARY} style={styles.primeBenefitsIcon} />
            <Text style={styles.primeBenefitsTitle}>Prime Membership Benefits</Text>
          </View>
          <FlatList
            data={[
              { image: require('../../assets/subscription/Free Washing.png'), label: 'Car Washing', offer: '2 times on plan' },
              { image: require('../../assets/subscription/Labour on Suspension.png'), label: 'Suspension Labour', offer: '10% off' },
              { image: require('../../assets/subscription/Battery Jumstart.png'), label: 'Battery Jumpstart', offer: '2 times' },
              { image: require('../../assets/subscription/Car Painting.png'), label: 'Car Painting', offer: '10% off' },
              { image: require('../../assets/subscription/Clutch Labour.png'), label: 'Clutch Labour', offer: '10% off' },
              { image: require('../../assets/subscription/Free AC Inspection.png'), label: 'Free AC Inspection', offer: '2 times on plan' },
              { image: require('../../assets/subscription/Free Detailed Inspection Unlimited at Garage.png'), label: 'Free Detailed Inspection', offer: 'Unlimited at garage' },
              { image: require('../../assets/subscription/General Service.png'), label: 'General Service', offer: '30% off' },
              { image: require('../../assets/subscription/Towing Service.png'), label: 'Towing Service', offer: '1 time' },
            ]}
            renderItem={({ item, index }) => {
              const gradientColors = getBenefitGradient(index);
              return (
                <TouchableOpacity
                  style={styles.primeBenefitCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.primeBenefitGlassLayer} />
                  <LinearGradient
                    colors={[...gradientColors, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.primeBenefitGradientBg}
                  />
                  <Text style={styles.primeBenefitLabel}>{item.label}</Text>
                  <View style={styles.primeBenefitIconContainer}>
                    <LinearGradient
                      colors={[...gradientColors.map((c) => c + '06')]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.primeBenefitIconBg}
                    >
                      <Image
                        source={item.image}
                        style={styles.primeBenefitImage}
                        resizeMode="contain"
                      />
                    </LinearGradient>
                  </View>
                  <Text style={styles.primeBenefitOffer}>{item.offer}</Text>
                </TouchableOpacity>
              );
            }}
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.primeBenefitsGridContainer}
            columnWrapperStyle={styles.primeBenefitsRow}
          />
        </View>

        {/* Subscription Banner Image */}
        <View style={[styles.subscriptionBannerContainer, { height: bannerHeight, width: contentWidth }]}>
          <Image
            source={require('../../assets/subscription/subscriptionbanner.png')}
            style={styles.subscriptionBannerImage}
            resizeMode="cover"
          />
        </View>

        {/* Quick Benefits Section */}
        <View style={styles.quickBenefitsSection}>
          <Text style={styles.quickBenefitsTitle}>Quick Benefits</Text>
          <View style={styles.quickBenefitsList}>
            {[
              'Save upto 25000',
              '24/7 Support',
              'Discounted Prices',
            ].map((benefit, index) => (
              <View key={index} style={styles.quickBenefitPoint}>
                <View style={styles.bulletPoint} />
                <Text style={styles.quickBenefitPointText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <View style={styles.priceContainer}>
            <View style={styles.priceLeftSection}>
              <Text style={styles.strikeOffPrice}>₹1,999</Text>
              <Text style={styles.mainPrice}>₹999</Text>
              <Text style={styles.validityText}>13 Months Validity</Text>
            </View>
            <TouchableOpacity style={styles.bookNowButton} activeOpacity={0.7}>
              <LinearGradient
                colors={['#FFD700', '#FFC107']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bookNowGradient}
              >
                <Text style={styles.bookNowText}>Book Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing.XL }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },

  scrollContent: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.M,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.M,
    marginBottom: Spacing.L,
  },

  headerContent: {
    flex: 1,
    marginLeft: Spacing.S,
  },

  headerTitle: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },

  headerSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: 4,
  },

  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.SUCCESS,
  },

  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.SUCCESS,
  },

  /* Card Flip Container */
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.M,
  },

  cardFlip: {
    width: '100%',
    height: 220,
  },

  cardBackFace: {
    position: 'absolute',
  },

  cardBackContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  cardBackLeftSection: {
    flex: 1,
    justifyContent: 'space-between',
  },

  cardBackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  detailsSection: {
    marginBottom: 8,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  detailContent: {
    marginLeft: 10,
    flex: 1,
  },

  detailLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },

  benefitsBackSection: {
    marginTop: 8,
  },

  benefitsTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  benefitItemBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  benefitText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },

  cardBackInfoSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 10,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  infoBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.PRIMARY,
    marginTop: 6,
    marginRight: 10,
  },

  infoText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 14,
    flex: 1,
  },

  barcodeContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  barcode: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 1,
    height: 40,
    marginBottom: 6,
  },

  barcodeLine: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },

  barcodeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },

  qrCodeBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },

  qrCodeGrid: {
    width: '100%',
    height: '100%',
  },

  qrRow: {
    flex: 1,
    flexDirection: 'row',
  },

  qrCell: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },

  qrCellFilled: {
    backgroundColor: '#000000',
  },

  qrLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.S,
    paddingHorizontal: Spacing.M,
    marginBottom: Spacing.L,
    backgroundColor: 'rgba(254, 81, 16, 0.1)',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
  },

  viewDetailsText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },

  /* Debit Card */
  debitCard: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    elevation: 50,
    shadowColor: '#FFC94A',
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 30 },
    shadowRadius: 45,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 201, 74, 0.6)',
  },

  cardPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1,
  },

  decorativeCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },

  circle1: {
    width: 200,
    height: 200,
    top: -90,
    right: -90,
    backgroundColor: 'rgba(255, 201, 74, 0.15)',
  },

  circle2: {
    width: 140,
    height: 140,
    bottom: -50,
    left: -60,
    backgroundColor: 'rgba(255, 201, 74, 0.12)',
  },

  circle3: {
    width: 110,
    height: 110,
    bottom: 5,
    right: -25,
    backgroundColor: 'rgba(255, 201, 74, 0.14)',
  },

  decorativeLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },

  line1: {
    width: 200,
    height: 2,
    top: '30%',
    left: -50,
    transform: [{ rotate: '45deg' }],
  },

  line2: {
    width: 150,
    height: 1.5,
    bottom: '25%',
    right: -40,
    transform: [{ rotate: '-30deg' }],
  },

  line3: {
    width: 100,
    height: 1,
    top: '60%',
    right: '10%',
  },

  cardShineLayer1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    pointerEvents: 'none',
  },

  cardShineLayer2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    pointerEvents: 'none',
  },

  cardShineLayer3: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    pointerEvents: 'none',
  },

  cardEmbossLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    pointerEvents: 'none',
  },

  hologramicEffect: {
    position: 'absolute',
    borderRadius: 100,
    pointerEvents: 'none',
  },

  glow1: {
    width: 280,
    height: 280,
    top: '-10%',
    right: '-20%',
    backgroundColor: 'rgba(254, 81, 16, 0.12)',
  },

  glow2: {
    width: 220,
    height: 220,
    bottom: '-15%',
    left: '-25%',
    backgroundColor: 'rgba(230, 57, 0, 0.10)',
  },

  watermarkContainer: {
    position: 'absolute',
    top: 24,
    left: '50%',
    transform: [{translateX: -50}],
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 1,
  },

  watermarkText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFC94A',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
  },

  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },

  premiumBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFD700',
    marginLeft: 3,
    letterSpacing: 0.5,
  },

  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  chipSection: {
    flex: 1,
  },

  chip: {
    width: 40,
    height: 32,
    borderRadius: 7,
    padding: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    overflow: 'hidden',
  },

  chipInner: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  chipGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: 0.4,
  },

  chipDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#8B6914',
  },

  chipIcon: {
    marginTop: 4,
  },

  chipShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    pointerEvents: 'none',
  },

  accountNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardNumber: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  cardNumberSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  cardLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 1,
  },

  bottomLeftSection: {
    flex: 1,
  },

  bottomRightSection: {
    flex: 0.5,
    justifyContent: 'flex-end',
  },

  cardHolder: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  cardExpiry: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },

  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  dateSeperator: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 6,
  },

  sectionTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
    letterSpacing: 0.3,
  },

  /* Actions Section */
  actionsSection: {
    marginBottom: Spacing.L,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  actionButton: {
    width: '48%',
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: 12,
    padding: Spacing.M,
    alignItems: 'center',
    borderWidth: 0,
    elevation: 5,
    shadowColor: '#FA6B2F',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    overflow: 'hidden',
  },

  actionIconBg: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },

  redDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: Colors.ERROR,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  actionLabel: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
  },

  /* Prime Membership Benefits Section */
  primeBenefitsSection: {
    marginBottom: Spacing.S,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },

  primeBenefitsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL - 4,
    marginBottom: Spacing.M,
  },

  primeBenefitsIcon: {
    marginRight: 8,
  },

  primeBenefitsTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    letterSpacing: -0.5,
  },

  primeBenefitsGridContainer: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL - 4,
    paddingTop: 2,
    paddingBottom: 2,
  },

  primeBenefitsRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  primeBenefitCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 12,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primeBenefitGlassLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
  },

  primeBenefitGradientBg: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.15,
  },

  primeBenefitIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 2,
  },

  primeBenefitIconBg: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  primeBenefitImage: {
    width: '86%',
    height: '86%',
    zIndex: 2,
  },

  primeBenefitLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
    lineHeight: 14,
    zIndex: 2,
    marginBottom: 2,
    paddingHorizontal: 2,
  },

  primeBenefitOffer: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
    zIndex: 2,
    lineHeight: 13,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  /* Benefits Section */
  benefitsSection: {
    marginBottom: Spacing.L,
  },

  benefitsBox: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: 12,
    borderWidth: 0,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#FA6B2F',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(254, 81, 16, 0.12)',
  },

  benefitItem_last: {
    borderBottomWidth: 0,
  },

  benefitIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(254, 81, 16, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
    borderWidth: 1.5,
    borderColor: 'rgba(254, 81, 16, 0.25)',
    elevation: 2,
    shadowColor: '#FA6B2F',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
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

  /* Quick Benefits Section */
  quickBenefitsSection: {
    marginBottom: Spacing.L,
    marginHorizontal: 0,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderRadius: 12,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.M,
    elevation: 3,
    shadowColor: '#FA6B2F',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  quickBenefitsTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '800',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
    letterSpacing: -0.5,
  },

  quickBenefitsList: {
    gap: Spacing.S,
  },

  quickBenefitPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.XS,
  },

  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.PRIMARY,
    marginRight: Spacing.M,
    marginTop: 2,
  },

  quickBenefitPointText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    flex: 1,
  },

  /* Subscription Banner */
  subscriptionBannerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 200,
    marginBottom: Spacing.L,
    marginTop: Spacing.S,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },

  subscriptionBannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  /* Pricing Section */
  pricingSection: {
    marginBottom: Spacing.XL,
    paddingBottom: Spacing.L,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#32145A',
    borderRadius: 16,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    elevation: 4,
    shadowColor: '#12071F',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },

  priceLeftSection: {
    flex: 1,
  },

  strikeOffPrice: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },

  mainPrice: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },

  validityText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  bookNowButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: Spacing.M,
  },

  bookNowGradient: {
    paddingHorizontal: Spacing.L,
    paddingVertical: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookNowText: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: '#8B6914',
  },

  /* Enhanced gradient accents for sections */
  sectionAccent: {
    position: 'absolute',
    width: 4,
    height: 24,
    left: 0,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
});

export default PlansScreen;