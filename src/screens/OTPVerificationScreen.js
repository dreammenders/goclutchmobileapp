import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { mobileNumber, countryCode } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [screenData, setScreenData] = useState({ width: 400, height: 812 });

  // Animation values
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  // Refs for OTP inputs
  const otpInputs = useRef([]);

  const getResponsiveSize = (small, medium, large) => {
    const { width } = screenData || { width: 400 };
    const isSmallDevice = width < 375;
    const isMediumDevice = width >= 375 && width < 414;
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
  };

  useEffect(() => {
    setCanResend(false);
    setTimer(30);

    try {
      setScreenData(Dimensions.get('window') || { width: 400, height: 812 });
    } catch (error) {
      console.warn('Error getting dimensions:', error);
    }
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => {
      clearInterval(interval);
      subscription?.remove();
    };
  }, []);

  const startTimer = () => {
    setCanResend(false);
    setTimer(30);
    
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const shakeInputs = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOTPChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericText;
      setOtp(newOtp);

      if (numericText && index < 5) {
        otpInputs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }

      // Auto-verify when complete
      if (index === 5 && numericText) {
        const completeOtp = [...newOtp];
        completeOtp[index] = numericText;
        if (completeOtp.every(digit => digit !== '')) {
          setTimeout(() => handleVerifyOTP(completeOtp), 300);
        }
      }
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleInputFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleResendOTP = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    
    setTimeout(() => {
      setIsResending(false);
      startTimer();
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
      setFocusedIndex(0);
      Alert.alert('Code Sent', 'New verification code sent successfully');
    }, 1000);
  };

  const handleVerifyOTP = async (otpToVerify = otp) => {
    const otpString = otpToVerify.join('');
    
    if (otpString.length !== 6) {
      shakeInputs();
      Alert.alert('Invalid Code', 'Please enter the complete 6-digit code');
      return;
    }

    try {
      await AsyncStorage.setItem('@user_phone', `${countryCode} ${mobileNumber}`);
    } catch (error) {
      // Error saving phone number silently handled
    }
    navigation.navigate('BrandSelection');
  };

  // Responsive calculations
  const safeScreenData = screenData || { width: 400, height: 812 };
  const isLandscape = (safeScreenData?.width || 400) > (safeScreenData?.height || 812);
  const currentWidth = safeScreenData?.width || 400;
  const currentHeight = safeScreenData?.height || 812;
  
  // Dynamic responsive values
  const logoSize = getResponsiveSize(60, 68, 76);
  const titleSize = getResponsiveSize(28, 32, 36);
  const subtitleSize = getResponsiveSize(14, 15, 16);
  const horizontalPadding = getResponsiveSize(16, 20, 24);
  
  // Calculate available width for OTP inputs (accounting for padding)
  const availableWidth = currentWidth - (horizontalPadding * 2);
  
  // Base OTP dimensions (ideal sizes)
  const baseOtpGap = getResponsiveSize(8, 12, 16);
  const baseOtpWidth = getResponsiveSize(42, 50, 56);
  const baseOtpHeight = getResponsiveSize(56, 64, 72);
  
  // Calculate total width needed for 6 inputs + 5 gaps
  const totalRequiredWidth = (6 * baseOtpWidth) + (5 * baseOtpGap);
  
  let otpInputWidth, otpGap, otpInputHeight;
  
  if (totalRequiredWidth > availableWidth) {
    // Scale down proportionally to fit in single row
    const scaleFactor = availableWidth / totalRequiredWidth;
    otpInputWidth = Math.max(36, Math.floor(baseOtpWidth * scaleFactor));
    otpGap = Math.max(4, Math.floor(baseOtpGap * scaleFactor));
    otpInputHeight = Math.max(48, Math.floor(baseOtpHeight * scaleFactor));
    
    // Double-check it fits
    const scaledTotalWidth = (6 * otpInputWidth) + (5 * otpGap);
    if (scaledTotalWidth > availableWidth) {
      // Emergency fit - minimum viable sizing
      otpGap = 4; // Minimum gap
      otpInputWidth = Math.floor((availableWidth - (5 * otpGap)) / 6);
      otpInputHeight = Math.max(otpInputWidth * 1.3, 44); // Maintain reasonable aspect ratio
    }
  } else {
    // Ideal sizing fits perfectly
    otpInputWidth = baseOtpWidth;
    otpGap = baseOtpGap;
    otpInputHeight = baseOtpHeight;
  }

  const isOTPComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={[styles.container, isLandscape && styles.containerLandscape]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Minimal Header */}
        <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.6}
          >
            <Ionicons name="chevron-back" size={getResponsiveSize(24, 26, 28)} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={[
          styles.content, 
          { paddingHorizontal: horizontalPadding },
          isLandscape && styles.contentLandscape
        ]}>
          {/* Hero Section */}
          <View style={[styles.heroSection, isLandscape && styles.heroSectionLandscape]}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={Colors.PRIMARY_GRADIENT}
                style={[styles.logoGradient, { 
                  width: logoSize, 
                  height: logoSize,
                  borderRadius: logoSize / 2 
                }]}
              >
                <Text style={[styles.logoText, { fontSize: logoSize * 0.39 }]}>GO</Text>
              </LinearGradient>
            </View>
            
            <Text style={[styles.heroTitle, { fontSize: titleSize }]}>Verification</Text>
            <Text style={[styles.heroSubtitle, { fontSize: subtitleSize }]}>
              Code sent to {countryCode} {mobileNumber}
            </Text>
          </View>

          {/* OTP Section */}
          <View style={[styles.otpSection, isLandscape && styles.otpSectionLandscape]}>
            <Animated.View 
              style={[
                styles.otpContainer,
                { 
                  gap: otpGap,
                  maxWidth: availableWidth,
                  width: (6 * otpInputWidth) + (5 * otpGap)
                },
                { transform: [{ translateX: shakeAnimation }] },
                isLandscape && styles.otpContainerLandscape
              ]}
            >
              {otp.map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.otpInputContainer,
                    {
                      width: otpInputWidth,
                      height: otpInputHeight,
                      borderRadius: otpInputWidth * 0.29,
                    },
                    focusedIndex === index && styles.otpInputContainerFocused,
                    digit && styles.otpInputContainerFilled,
                  ]}
                >
                  <TextInput
                    ref={(ref) => (otpInputs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      { fontSize: getResponsiveSize(20, 22, 24) },
                      focusedIndex === index && styles.otpInputFocused,
                    ]}
                    value={digit}
                    onChangeText={(text) => handleOTPChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    onFocus={() => handleInputFocus(index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    textAlign="center"
                    selectTextOnFocus
                    autoFocus={index === 0}
                  />
                  {digit && (
                    <View style={[
                      styles.filledIndicator,
                      { width: otpInputWidth * 0.43 }
                    ]} />
                  )}
                </View>
              ))}
            </Animated.View>
          </View>

          {/* Timer Section */}
          <View style={[styles.timerSection, isLandscape && styles.timerSectionLandscape]}>
            {!canResend ? (
              <Text style={[styles.timerText, { fontSize: subtitleSize - 1 }]}>
                Resend in <Text style={styles.timerCount}>{timer}</Text>
              </Text>
            ) : (
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={handleResendOTP}
                disabled={isResending}
                activeOpacity={0.6}
              >
                <Text style={[styles.resendText, { fontSize: subtitleSize - 1 }]}>
                  {isResending ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>


      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  containerLandscape: {
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  contentLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  heroSectionLandscape: {
    marginBottom: 0,
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 28,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  logoGradient: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  heroTitle: {
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 10,
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  otpSection: {
    marginBottom: 36,
  },
  otpSectionLandscape: {
    marginBottom: 0,
    flex: 1,
    justifyContent: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  otpContainerLandscape: {
    flexWrap: 'nowrap',
  },
  otpInputContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  otpInputContainerFocused: {
    borderColor: Colors.PRIMARY,
    borderWidth: 3,
    shadowColor: Colors.PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    transform: [{ scale: 1.05 }],
  },
  otpInputContainerFilled: {
    borderColor: Colors.PRIMARY,
    backgroundColor: '#FFF5F0',
    borderWidth: 2.5,
  },
  otpInput: {
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  otpInputFocused: {
    color: Colors.PRIMARY,
  },
  filledIndicator: {
    position: 'absolute',
    bottom: 8,
    height: 4,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  timerSection: {
    alignItems: 'center',
  },
  timerSectionLandscape: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  timerText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  timerCount: {
    color: Colors.PRIMARY,
    fontWeight: '700',
  },
  resendButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  resendText: {
    color: Colors.PRIMARY,
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  loadingIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loadingText: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
});

export default OTPVerificationScreen;