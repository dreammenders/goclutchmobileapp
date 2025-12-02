import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const MobileNumberScreen = ({ navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [isLoading, setIsLoading] = useState(false);
  const mobileInputRef = useRef(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const validateMobileNumber = (number) => {
    // Indian mobile number validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const handleSendOTP = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('OTPVerification', {
        mobileNumber: mobileNumber,
        countryCode: countryCode,
      });
    }, 1500);
  };

  const formatMobileNumber = (text) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);
    setMobileNumber(limited);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter Mobile Number</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Illustration/Icon */}
          <View style={styles.illustrationContainer}>
            <LinearGradient
              colors={[Colors.PRIMARY + '20', Colors.PRIMARY + '10']}
              style={styles.illustrationCircle}
            >
              <Ionicons name="phone-portrait" size={64} color={Colors.PRIMARY} />
            </LinearGradient>
          </View>

          {/* Title and Description */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Verify Your Number</Text>
            <Text style={styles.subtitle}>
              We'll send you an OTP to verify your mobile number
            </Text>
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            
            <View style={styles.inputContainer}>
              {/* Country Code Selector */}
              <TouchableOpacity style={styles.countryCodeContainer} activeOpacity={0.8}>
                <Text style={styles.countryCodeText}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.TEXT_SECONDARY} />
              </TouchableOpacity>

              {/* Mobile Number Input */}
              <TextInput
                ref={mobileInputRef}
                style={styles.mobileInput}
                placeholder="Enter mobile number"
                placeholderTextColor={Colors.TEXT_MUTED}
                value={mobileNumber}
                onChangeText={formatMobileNumber}
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleSendOTP}
              />
            </View>

            {/* Mobile number format hint */}
            <Text style={styles.formatHint}>
              Enter 10-digit mobile number without country code
            </Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.SUCCESS} />
              <Text style={styles.benefitText}>Secure & encrypted verification</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name="time" size={20} color={Colors.SUCCESS} />
              <Text style={styles.benefitText}>Quick 2-minute setup</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Ionicons name="lock-closed" size={20} color={Colors.SUCCESS} />
              <Text style={styles.benefitText}>Your privacy is protected</Text>
            </View>
          </View>

          {/* Terms */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By proceeding, you consent to receive SMS/calls about our services and agree to our{' '}
              <Text style={styles.termsLink}>Terms</Text> &{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>

        {/* Send OTP Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.sendOTPButton,
              (!mobileNumber.trim() || mobileNumber.length !== 10) && styles.sendOTPButtonDisabled
            ]}
            onPress={handleSendOTP}
            activeOpacity={0.8}
            disabled={!mobileNumber.trim() || mobileNumber.length !== 10 || isLoading}
          >
            <LinearGradient
              colors={
                (!mobileNumber.trim() || mobileNumber.length !== 10) 
                  ? [Colors.BORDER, Colors.BORDER] 
                  : Colors.PRIMARY_GRADIENT
              }
              style={styles.sendOTPButtonGradient}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.sendOTPButtonText}>Sending OTP...</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.sendOTPButtonText}>Send OTP</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.LIGHT_BACKGROUND} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_BACKGROUND,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.SECTION_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
  },
  headerSpace: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.XL,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: Spacing.XL,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.XL,
  },
  title: {
    fontSize: Typography.HEADING_M,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  subtitle: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: Spacing.XL,
  },
  inputLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    borderWidth: 2,
    borderColor: Colors.BORDER_LIGHT,
    overflow: 'hidden',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.M,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRightWidth: 1,
    borderRightColor: Colors.BORDER_LIGHT,
  },
  countryCodeText: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginRight: Spacing.S,
  },
  mobileInput: {
    flex: 1,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M + 2,
    fontSize: Typography.BODY_L,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '500',
  },
  formatHint: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    marginTop: Spacing.S,
  },
  benefitsContainer: {
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.L,
    marginBottom: Spacing.XL,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  benefitText: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.M,
    flex: 1,
  },
  termsContainer: {
    marginBottom: Spacing.XL,
  },
  termsText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.L,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
  },
  sendOTPButton: {
    borderRadius: Spacing.BORDER_RADIUS_M,
    elevation: 4,
    shadowColor: Colors.PRIMARY,
    shadowOffset: Spacing.SHADOW_OFFSET,
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sendOTPButtonDisabled: {
    elevation: 1,
    shadowOpacity: 0.1,
  },
  sendOTPButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.M + 2,
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  sendOTPButtonText: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
    marginRight: Spacing.S,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MobileNumberScreen;