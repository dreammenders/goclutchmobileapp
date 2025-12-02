import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

const LoginScreen = ({ navigation }) => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [screenData, setScreenData] = useState({ width: 400, height: 812 });
  const flatListRef = useRef(null);
  const mobileInputRef = useRef(null);

  const getResponsiveSize = (small, medium, large) => {
    const { width } = screenData || { width: 400 };
    const isSmallDevice = width < 375;
    const isMediumDevice = width >= 375 && width < 414;
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
  };

  // Banner data with images from assets/login folder
  const loginBanners = [
    {
      id: 1,
      image: require('../../assets/login/1.png'),
    },
    {
      id: 2,
      image: require('../../assets/login/2.png'),
    },
    {
      id: 3,
      image: require('../../assets/login/3.png'),
    },
  ];

  useEffect(() => {
    try {
      setScreenData(Dimensions.get('window') || { width: 400, height: 812 });
    } catch (error) {
      console.warn('Error getting dimensions:', error);
    }

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  const validateMobileNumber = (number) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const formatMobileNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    setMobileNumber(limited);
  };

  const handleSendOTP = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Required', 'Please enter your mobile number');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    navigation.navigate('OTPVerification', {
      mobileNumber: mobileNumber,
      countryCode: countryCode,
    });
  };

  const renderBanner = ({ item }) => {
    const currentScreenData = screenData || { width: 400, height: 812 };
    const isCurrentLandscape = (currentScreenData?.width || 400) > (currentScreenData?.height || 812);
    const bannerHeight = isCurrentLandscape ? (currentScreenData?.height || 812) * 0.35 : (currentScreenData?.height || 812) * 0.28;

    return (
      <Image
        source={item.image}
        style={[
          styles.bannerImage,
          { width: currentScreenData?.width || 400, height: bannerHeight }
        ]}
        resizeMode="cover"
      />
    );
  };

  const onScroll = ({ nativeEvent }) => {
    if (nativeEvent?.layoutMeasurement?.width && nativeEvent?.contentOffset?.x !== undefined) {
      const slide = Math.round(nativeEvent.contentOffset.x / (nativeEvent.layoutMeasurement?.width || 1));
      if (slide !== currentBannerIndex && slide >= 0 && slide < loginBanners.length) {
        setCurrentBannerIndex(slide);
      }
    }
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {loginBanners.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentBannerIndex ? Colors.PRIMARY : '#E0E0E0',
              width: index === currentBannerIndex ? getResponsiveSize(20, 22, 24) : 6,
            },
          ]}
        />
      ))}
    </View>
  );

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current && loginBanners.length > 1) {
        try {
          const nextIndex = (currentBannerIndex + 1) % loginBanners.length;
          flatListRef.current.scrollToIndex({
            index: nextIndex,
            animated: true,
          });
          setCurrentBannerIndex(nextIndex);
        } catch (error) {
          // Auto-scroll error silently handled
        }
      }
    }, 3500); // Change slide every 3.5 seconds

    return () => clearInterval(interval);
  }, [currentBannerIndex, loginBanners.length]);

  // Responsive calculations
  const isLandscape = screenData?.width > screenData?.height;
  const currentWidth = screenData?.width || 400;
  const currentHeight = screenData?.height || 812;
  
  // Dynamic responsive values
  const horizontalPadding = getResponsiveSize(20, 24, 28);
  const carouselHeight = isLandscape ? currentHeight * 0.5 : currentHeight * 0.4;
  const welcomeTitleSize = getResponsiveSize(28, 32, 36);
  const welcomeSubtitleSize = getResponsiveSize(14, 15, 16);
  const buttonHeight = getResponsiveSize(52, 56, 60);

  const isValidMobile = mobileNumber.length === 10 && validateMobileNumber(mobileNumber);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Banner Carousel Section */}
        <View style={[
          styles.carouselSection,
          { 
            height: carouselHeight
          }
        ]}>
          <FlatList
            ref={flatListRef}
            data={loginBanners}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            style={styles.carousel}
            automaticallyAdjustContentInsets={false}
          />
        </View>

        {/* Main Content */}
        <ScrollView 
          style={styles.contentSection}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { 
              paddingHorizontal: horizontalPadding,
              paddingTop: 0
            }
          ]}
        >
          {/* Welcome Section */}
          <View style={[
            styles.welcomeSection,
            { marginBottom: getResponsiveSize(28, 32, 36) }
          ]}>
            <Text style={[styles.welcomeTitle, { fontSize: welcomeTitleSize }]}>
              Welcome to GoClutch
            </Text>
            <Text style={[styles.welcomeSubtitle, { fontSize: welcomeSubtitleSize }]}>
              Enter your mobile number to get started
            </Text>
          </View>

          {/* Mobile Input Card */}
          <View style={[
            styles.inputCard,
            { 
              padding: getResponsiveSize(20, 24, 28),
              marginBottom: getResponsiveSize(24, 28, 32)
            }
          ]}>
            <Text style={[
              styles.inputLabel,
              { fontSize: getResponsiveSize(13, 14, 15) }
            ]}>
              Mobile Number
            </Text>
            
            <View style={[
              styles.inputWrapper, 
              isInputFocused && styles.inputWrapperFocused,
              { height: getResponsiveSize(52, 56, 60) }
            ]}>
              <View style={styles.countryCodeSection}>
                <Text style={[
                  styles.countryCodeText,
                  { fontSize: getResponsiveSize(15, 16, 17) }
                ]}>
                  {countryCode}
                </Text>
                <View style={styles.dividerLine} />
              </View>
              
              <TextInput
                ref={mobileInputRef}
                style={[
                  styles.mobileInput,
                  { fontSize: getResponsiveSize(15, 16, 17) }
                ]}
                placeholder="Enter your mobile number"
                placeholderTextColor="#A0A0A0"
                value={mobileNumber}
                onChangeText={formatMobileNumber}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus={false}
                returnKeyType="done"
                onSubmitEditing={handleSendOTP}
              />
            </View>

            <Text style={[
              styles.inputHint,
              { fontSize: getResponsiveSize(11, 12, 13) }
            ]}>
              We'll send you a verification code via SMS
            </Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.continueButton, 
              !isValidMobile && styles.continueButtonDisabled,
              { height: buttonHeight }
            ]}
            onPress={handleSendOTP}
            activeOpacity={0.9}
            disabled={!isValidMobile}
          >
            <LinearGradient
              colors={isValidMobile ? Colors.PRIMARY_GRADIENT : ['#E5E5E5', '#E5E5E5']}
              style={[styles.continueButtonGradient, { height: buttonHeight }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[
                styles.continueButtonText, 
                !isValidMobile && styles.continueButtonTextDisabled,
                { fontSize: getResponsiveSize(15, 16, 17) }
              ]}>
                Send Verification Code
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={getResponsiveSize(18, 20, 22)} 
                color={isValidMobile ? "#FFFFFF" : "#A0A0A0"} 
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Terms */}
          <Text style={[
            styles.termsText,
            { 
              fontSize: getResponsiveSize(11, 12, 13),
              marginTop: getResponsiveSize(16, 20, 24)
            }
          ]}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  carouselSection: {
    paddingBottom: 0,
    paddingHorizontal: 0,
    paddingTop: 32,
    backgroundColor: 'transparent',
  },
  carousel: {
    flex: 0,
  },
  bannerImage: {
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    marginTop: -8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  welcomeSection: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: -1.2,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputLabel: {
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    marginBottom: 12,
  },
  inputWrapperFocused: {
    borderColor: Colors.PRIMARY,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  countryCodeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  countryCodeText: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dividerLine: {
    width: 1,
    height: 24,
    backgroundColor: '#E9ECEF',
    marginLeft: 12,
  },
  mobileInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  inputHint: {
    color: '#999999',
    fontWeight: '400',
  },
  continueButton: {
    borderRadius: 20,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  continueButtonDisabled: {
    shadowOpacity: 0.05,
    elevation: 2,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  continueButtonText: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 10,
    letterSpacing: 0.3,
  },
  continueButtonTextDisabled: {
    color: '#A0A0A0',
  },
  termsText: {
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '400',
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  termsLink: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
});

export default LoginScreen;