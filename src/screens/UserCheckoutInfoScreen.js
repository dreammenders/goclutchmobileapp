import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');

const UserCheckoutInfoScreen = ({ navigation, route }) => {
  const { cartItems = [], totalPrice = 0 } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const [savedName, savedPhone, savedEmail, savedAddress, savedCity, savedPincode] = 
        await Promise.all([
          AsyncStorage.getItem('@user_name'),
          AsyncStorage.getItem('@user_phone'),
          AsyncStorage.getItem('@user_email'),
          AsyncStorage.getItem('@checkout_address'),
          AsyncStorage.getItem('@checkout_city'),
          AsyncStorage.getItem('@checkout_pincode'),
        ]);

      if (savedName) setFullName(savedName);
      if (savedPhone) setPhone(savedPhone);
      if (savedEmail) setEmail(savedEmail);
      if (savedAddress) setAddress(savedAddress);
      if (savedCity) setCity(savedCity);
      if (savedPincode) setPincode(savedPincode);
    } catch (error) {
      console.log('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter your city');
      return false;
    }
    if (!pincode.trim() || pincode.length < 6) {
      Alert.alert('Error', 'Please enter a valid pincode');
      return false;
    }
    return true;
  };

  const handleSaveAndContinue = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      await Promise.all([
        AsyncStorage.setItem('@user_name', fullName),
        AsyncStorage.setItem('@user_phone', phone),
        AsyncStorage.setItem('@user_email', email),
        AsyncStorage.setItem('@checkout_address', address),
        AsyncStorage.setItem('@checkout_city', city),
        AsyncStorage.setItem('@checkout_pincode', pincode),
      ]);

      navigation.navigate('PayNow', {
        cartItems,
        totalPrice,
        userInfo: { fullName, phone, email, address, city, pincode },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to save information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Delivery Information</Text>
            <Text style={styles.headerSubtitle}>Provide your details</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Full Name */}
        <View style={styles.section}>
          <Text style={styles.label}>Full Name *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={Colors.TEXT_MUTED} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={Colors.TEXT_MUTED}
            />
          </View>
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.label}>Phone Number *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={Colors.TEXT_MUTED} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={Colors.TEXT_MUTED}
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.section}>
          <Text style={styles.label}>Email Address *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={Colors.TEXT_MUTED} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={Colors.TEXT_MUTED}
            />
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.label}>Address *</Text>
          <View style={[styles.inputContainer, styles.addressInputContainer]}>
            <Ionicons name="location-outline" size={20} color={Colors.TEXT_MUTED} />
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter your delivery address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={Colors.TEXT_MUTED}
              multiline={true}
            />
          </View>
        </View>

        {/* City and Pincode Row */}
        <View style={styles.rowContainer}>
          {/* City */}
          <View style={[styles.section, styles.halfSection]}>
            <Text style={styles.label}>City *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color={Colors.TEXT_MUTED} />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                placeholderTextColor={Colors.TEXT_MUTED}
              />
            </View>
          </View>

          {/* Pincode */}
          <View style={[styles.section, styles.halfSection]}>
            <Text style={styles.label}>Pincode *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="qr-code-outline" size={20} color={Colors.TEXT_MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                placeholderTextColor={Colors.TEXT_MUTED}
              />
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.INFO} />
          <Text style={styles.infoText}>
            Please ensure all details are accurate for smooth delivery of your order
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <LinearGradient
          colors={Colors.PRIMARY_GRADIENT}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleSaveAndContinue}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Continue to Payment</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerGradient: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    gap: Spacing.M,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.HEADING_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.XS,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.L,
    paddingBottom: 140,
  },
  section: {
    marginBottom: Spacing.M,
  },
  label: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.M,
    paddingLeft: Spacing.M,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
  },
  addressInputContainer: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.S,
  },
  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.M,
  },
  halfSection: {
    flex: 1,
    marginBottom: Spacing.M,
  },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.S,
    backgroundColor: Colors.INFO + '15',
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginTop: Spacing.L,
    marginBottom: Spacing.L,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    lineHeight: 20,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
  },
  buttonGradient: {
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.S,
    paddingVertical: Spacing.M,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default UserCheckoutInfoScreen;
