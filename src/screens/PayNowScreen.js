import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const { width: screenWidth } = Dimensions.get('window');

const PayNowScreen = ({ navigation, route }) => {
  const { cartItems = [], totalPrice = 0 } = route.params || {};
  
  const [serviceType, setServiceType] = useState('pickup');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState(null);

  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editMode, setEditMode] = useState('auto');
  const [tempAddress, setTempAddress] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [tempPincode, setTempPincode] = useState('');

  const timeSlots = ['11 AM-12 PM', '1-2 PM', '3-4 PM', '4-5 PM', '5-6 PM'];
  const [selectedSlot, setSelectedSlot] = useState(null);

  const paymentGateways = [
    { id: 'visa', name: 'Visa Card', icon: 'card-outline', color: '#1A1F71', recommended: true },
    { id: 'mastercard', name: 'Mastercard', icon: 'card-outline', color: '#EB001B', recommended: true },
    { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', color: '#FF8C00', recommended: false },
    { id: 'paypal', name: 'PayPal', icon: 'logo-paypal', color: '#003087', recommended: false },
  ];

  useEffect(() => {
    loadCustomerInfo();
  }, []);

  const loadCustomerInfo = async () => {
    try {
      const [name, phone, email, address, city, pincode] = await Promise.all([
        AsyncStorage.getItem('@user_name'),
        AsyncStorage.getItem('@user_phone'),
        AsyncStorage.getItem('@user_email'),
        AsyncStorage.getItem('@checkout_address'),
        AsyncStorage.getItem('@checkout_city'),
        AsyncStorage.getItem('@checkout_pincode'),
      ]);

      if (name) setCustomerName(name);
      if (phone) setCustomerPhone(phone);
      if (address) setCustomerAddress(address);
      if (city) setCustomerCity(city);
      if (pincode) setCustomerPincode(pincode);

      const newOrderId = `GC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setOrderId(newOrderId);
    } catch (error) {
      console.log('Error loading customer info:', error);
      const newOrderId = `GC${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setOrderId(newOrderId);
    }
  };

  const handleDateChange = (event, date) => {
    if (date) setSelectedDate(date);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event, time) => {
    if (time) setSelectedTime(time);
    setShowTimePicker(false);
  };

  const handlePaymentGateway = (gateway) => {
    setSelectedGateway(gateway);
    setProcessingPayment(true);
    setTimeout(() => {
      setProcessingPayment(false);
      Alert.alert('Success', `Payment processed via ${gateway.name}!`);
      setShowGatewayModal(false);
    }, 2000);
  };

  const handleCompletePayment = () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }
    if (paymentMethod === 'online') {
      setShowGatewayModal(true);
    } else {
      Alert.alert('Success', 'Order placed! Pay at location.');
      navigation.goBack();
    }
  };

  const handleOpenAddressModal = () => {
    setTempAddress(customerAddress);
    setTempCity(customerCity);
    setTempPincode(customerPincode);
    setEditMode('auto');
    setShowAddressModal(true);
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this feature');
        setIsLoadingLocation(false);
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation(location.coords);
      setTempAddress(`Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`);
      
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (reverseGeocode && reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          const formattedAddress = `${address.street || ''} ${address.district || ''} ${address.city || ''} ${address.region || ''}`.trim();
          setTempAddress(formattedAddress || `Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`);
          setTempCity(address.city || address.region || '');
          setTempPincode(address.postalCode || '');
        }
      } catch (error) {
        console.log('Reverse geocoding error:', error);
      }
    } catch (error) {
      console.log('Location error:', error);
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSaveAddress = () => {
    if (!tempAddress.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }
    setCustomerAddress(tempAddress);
    setCustomerCity(tempCity);
    setCustomerPincode(tempPincode);
    setShowAddressModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
            <Text style={styles.headerTitle}>Confirm & Pay</Text>
            <Text style={styles.headerSubtitle}>Complete your booking</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Order ID Card */}
        {orderId && (
          <View style={styles.section}>
            <View style={styles.orderIdCard}>
              <View style={styles.orderIdLeft}>
                <Ionicons name="receipt" size={24} color={Colors.PRIMARY} />
                <View style={styles.orderIdContent}>
                  <Text style={styles.orderIdLabel}>Order ID</Text>
                  <Text style={styles.orderIdValue}>{orderId}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert('Order ID Copied', orderId);
                }}
              >
                <Ionicons name="copy" size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Address Information Card */}
        {customerAddress && (
          <View style={styles.section}>
            <View style={styles.addressHeaderRow}>
              <Text style={styles.sectionTitle}>Address Information</Text>
              <TouchableOpacity 
                onPress={handleOpenAddressModal}
                style={styles.editAddressButton}
              >
                <Ionicons name="pencil" size={20} color={Colors.PRIMARY} />
              </TouchableOpacity>
            </View>
            <LinearGradient
              colors={['#FFFFFF', '#F9F9F9']}
              style={styles.summaryCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={Colors.PRIMARY} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Pickup Address</Text>
                  <Text style={styles.infoValue}>{customerAddress}</Text>
                  {(customerCity || customerPincode) && (
                    <Text style={styles.infoSubValue}>
                      {customerCity}{customerCity && customerPincode ? ', ' : ''}{customerPincode}
                    </Text>
                  )}
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Service Package Details */}
        {cartItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Package Details</Text>
            <LinearGradient
              colors={['#FFFFFF', '#F9F9F9']}
              style={styles.summaryCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {cartItems.map((item, index) => (
                <View key={index}>
                  <View style={styles.packageRow}>
                    <View style={styles.packageLeft}>
                      <View style={styles.packageBadge}>
                        <Text style={styles.packageBadgeText}>{item.quantity || 1}</Text>
                      </View>
                      <View style={styles.packageContent}>
                        <Text style={styles.packageName}>{item.name || item.title}</Text>
                        <Text style={styles.packageDesc}>
                          ₹{item.price || 0} × {item.quantity || 1}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.packagePrice}>
                      ₹{(item.price || 0) * (item.quantity || 1)}
                    </Text>
                  </View>
                  {index < cartItems.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </LinearGradient>
          </View>
        )}
        
        {/* Order Summary Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <LinearGradient
            colors={['#FFFFFF', '#F9F9F9']}
            style={styles.summaryCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryLeft}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.SUCCESS} />
                <Text style={styles.summaryLabel}>{cartItems.length} items selected</Text>
              </View>
              <Text style={styles.summaryValue}>₹{totalPrice}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{totalPrice}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, { color: Colors.SUCCESS }]}>Free</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{totalPrice}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Service Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Type</Text>
          <View style={styles.optionsContainer}>
            {[
              { id: 'pickup', label: 'Pick Up', icon: 'car', description: 'We pick up your vehicle' },
              { id: 'walkin', label: 'Walk In', icon: 'walk', description: 'Visit our service center' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  serviceType === option.id && styles.optionCardActive,
                ]}
                onPress={() => setServiceType(option.id)}
              >
                <LinearGradient
                  colors={
                    serviceType === option.id
                      ? Colors.PRIMARY_GRADIENT
                      : ['#F5F5F5', '#EEEEEE']
                  }
                  style={styles.optionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionIconContainer}>
                      <Ionicons
                        name={option.icon}
                        size={28}
                        color={serviceType === option.id ? '#FFFFFF' : Colors.PRIMARY}
                      />
                    </View>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionLabel,
                          serviceType === option.id && styles.optionLabelActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                      <Text
                        style={[
                          styles.optionDescription,
                          serviceType === option.id && styles.optionDescriptionActive,
                        ]}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Slot Selection */}
        {(serviceType === 'pickup' || serviceType === 'walkin') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule Slot</Text>
            
            {/* Date Selection */}
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.dateTimeContent}>
                <Ionicons name="calendar-outline" size={24} color={Colors.PRIMARY} />
                <View style={styles.dateTimeText}>
                  <Text style={styles.dateTimeLabel}>Select Date</Text>
                  <Text style={styles.dateTimeValue}>
                    {selectedDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.TEXT_MUTED} />
            </TouchableOpacity>

            {/* Time Slot Selection */}
            <Text style={styles.slotLabel}>Available Time Slots</Text>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlotButton,
                    selectedSlot === slot && styles.timeSlotButtonActive,
                  ]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedSlot === slot && styles.timeSlotTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Payment Method Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsContainer}>
            {[
              { id: 'online', label: 'Pay Online', icon: 'card-outline', desc: 'Credit, Debit, UPI' },
              { id: 'offline', label: 'Pay at Location', icon: 'wallet-outline', desc: 'Cash on delivery' },
            ].map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  paymentMethod === method.id && styles.paymentMethodCardActive,
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <View style={styles.paymentMethodContent}>
                  <View style={styles.paymentMethodLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        paymentMethod === method.id && styles.radioButtonActive,
                      ]}
                    >
                      {paymentMethod === method.id && (
                        <View style={styles.radioDot} />
                      )}
                    </View>
                    <View style={styles.paymentMethodText}>
                      <Text style={styles.paymentMethodLabel}>{method.label}</Text>
                      <Text style={styles.paymentMethodDesc}>{method.desc}</Text>
                    </View>
                  </View>
                  <Ionicons
                    name={method.icon}
                    size={28}
                    color={paymentMethod === method.id ? Colors.PRIMARY : Colors.TEXT_MUTED}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsContainer}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.INFO} />
          <Text style={styles.termsText}>
            By confirming, you agree to our Terms & Conditions and Privacy Policy
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomAction}>
        <LinearGradient
          colors={Colors.PRIMARY_GRADIENT}
          style={styles.paymentButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={handleCompletePayment}
          >
            <Text style={styles.paymentButtonText}>
              {paymentMethod === 'online' ? 'Pay Now' : 'Confirm Order'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Payment Gateway Modal */}
      <Modal
        visible={showGatewayModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGatewayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Gateway</Text>
              <TouchableOpacity onPress={() => setShowGatewayModal(false)}>
                <Ionicons name="close" size={28} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {processingPayment ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text style={styles.processingText}>Processing Payment...</Text>
              </View>
            ) : (
              <ScrollView style={styles.gatewaysList} showsVerticalScrollIndicator={false}>
                {paymentGateways.map((gateway) => (
                  <TouchableOpacity
                    key={gateway.id}
                    style={styles.gatewayOption}
                    onPress={() => handlePaymentGateway(gateway)}
                  >
                    <LinearGradient
                      colors={[gateway.color + '15', gateway.color + '05']}
                      style={styles.gatewayContent}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <View style={[styles.gatewayIcon, { backgroundColor: gateway.color }]}>
                        <Ionicons name={gateway.icon} size={32} color="#FFFFFF" />
                      </View>
                      <View style={styles.gatewayInfo}>
                        <View style={styles.gatewayNameRow}>
                          <Text style={styles.gatewayName}>{gateway.name}</Text>
                          {gateway.recommended && (
                            <View style={styles.recommendedBadge}>
                              <Text style={styles.recommendedText}>Recommended</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.gatewayDesc}>Fast & Secure</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={24} color={Colors.TEXT_MUTED} />
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Address Edit Modal */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addressModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Ionicons name="close" size={28} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addressModalBody} showsVerticalScrollIndicator={false}>
              {/* Tab Selection */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tabButton, editMode === 'auto' && styles.tabButtonActive]}
                  onPress={() => setEditMode('auto')}
                >
                  <Ionicons name="location" size={20} color={editMode === 'auto' ? '#FFFFFF' : Colors.TEXT_SECONDARY} />
                  <Text style={[styles.tabButtonText, editMode === 'auto' && styles.tabButtonTextActive]}>
                    Current Location
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, editMode === 'manual' && styles.tabButtonActive]}
                  onPress={() => setEditMode('manual')}
                >
                  <Ionicons name="create" size={20} color={editMode === 'manual' ? '#FFFFFF' : Colors.TEXT_SECONDARY} />
                  <Text style={[styles.tabButtonText, editMode === 'manual' && styles.tabButtonTextActive]}>
                    Manual Edit
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Current Location Tab */}
              {editMode === 'auto' && (
                <View style={styles.tabContent}>
                  <TouchableOpacity
                    style={styles.fetchLocationButton}
                    onPress={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                  >
                    <LinearGradient
                      colors={Colors.PRIMARY_GRADIENT}
                      style={styles.fetchLocationGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {isLoadingLocation ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Ionicons name="refresh" size={20} color="#FFFFFF" />
                          <Text style={styles.fetchLocationText}>Get Current Location</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {tempAddress && (
                    <View style={styles.locationPreview}>
                      <Text style={styles.previewLabel}>Address Preview</Text>
                      <View style={styles.previewCard}>
                        <Text style={styles.previewAddress}>{tempAddress}</Text>
                        {tempCity && <Text style={styles.previewSubtitle}>{tempCity}</Text>}
                        {tempPincode && <Text style={styles.previewSubtitle}>{tempPincode}</Text>}
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Manual Edit Tab */}
              {editMode === 'manual' && (
                <View style={styles.tabContent}>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Address</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your address"
                      value={tempAddress}
                      onChangeText={setTempAddress}
                      placeholderTextColor={Colors.TEXT_MUTED}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>City</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter city"
                      value={tempCity}
                      onChangeText={setTempCity}
                      placeholderTextColor={Colors.TEXT_MUTED}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Pincode</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter pincode"
                      value={tempPincode}
                      onChangeText={setTempPincode}
                      placeholderTextColor={Colors.TEXT_MUTED}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.addressModalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddress}
              >
                <LinearGradient
                  colors={Colors.PRIMARY_GRADIENT}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
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
    marginBottom: Spacing.XL,
  },
  sectionTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  summaryCard: {
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.S,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.S,
  },
  summaryLabel: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.BORDER_LIGHT,
    marginVertical: Spacing.M,
  },
  orderIdCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  orderIdLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.M,
    flex: 1,
  },
  orderIdContent: {
    flex: 1,
  },
  orderIdLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
  },
  orderIdValue: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
    marginTop: Spacing.XS,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.M,
    marginVertical: Spacing.S,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    fontWeight: '500',
    marginBottom: Spacing.XS,
  },
  infoValue: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  infoSubValue: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '500',
    marginTop: Spacing.XS,
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.S,
  },
  packageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.M,
    flex: 1,
  },
  packageBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageBadgeText: {
    fontSize: Typography.BODY_S,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  packageContent: {
    flex: 1,
  },
  packageName: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  packageDesc: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  packagePrice: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  totalLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  optionsContainer: {
    gap: Spacing.M,
  },
  optionCard: {
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  optionCardActive: {
    shadowOpacity: 0.15,
    elevation: 5,
  },
  optionGradient: {
    padding: Spacing.M,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.M,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  optionLabelActive: {
    color: '#FFFFFF',
  },
  optionDescription: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  optionDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.M,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  dateTimeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.M,
    flex: 1,
  },
  dateTimeText: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_MUTED,
    marginBottom: Spacing.XS,
  },
  dateTimeValue: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  slotLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.S,
  },
  timeSlotButton: {
    width: (screenWidth - Spacing.SCREEN_HORIZONTAL * 2 - Spacing.S * 2) / 3,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotButtonActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  timeSlotText: {
    fontSize: Typography.BODY_S,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  timeSlotTextActive: {
    color: '#FFFFFF',
  },
  paymentMethodsContainer: {
    gap: Spacing.M,
  },
  paymentMethodCard: {
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paymentMethodCardActive: {
    shadowOpacity: 0.1,
    elevation: 4,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderWidth: 1.5,
    borderColor: Colors.BORDER_LIGHT,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
  },
  paymentMethodCardActive: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY + '08',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.M,
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.BORDER_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  paymentMethodText: {
    flex: 1,
  },
  paymentMethodLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  paymentMethodDesc: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  termsContainer: {
    flexDirection: 'row',
    gap: Spacing.S,
    backgroundColor: Colors.INFO + '15',
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.L,
  },
  termsText: {
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
  paymentButtonGradient: {
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.S,
    paddingVertical: Spacing.M,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderTopLeftRadius: Spacing.BORDER_RADIUS_L,
    borderTopRightRadius: Spacing.BORDER_RADIUS_L,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  modalTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  processingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.M,
  },
  processingText: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
    fontWeight: '600',
  },
  gatewaysList: {
    maxHeight: 400,
  },
  gatewayOption: {
    margin: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  gatewayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.M,
    gap: Spacing.M,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  gatewayIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gatewayInfo: {
    flex: 1,
  },
  gatewayName: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  gatewayDesc: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  addressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  editAddressButton: {
    padding: Spacing.S,
    borderRadius: 20,
    backgroundColor: Colors.PRIMARY + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gatewayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.S,
  },
  recommendedBadge: {
    backgroundColor: Colors.SUCCESS + '20',
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: Typography.BODY_XS || 11,
    fontWeight: '600',
    color: Colors.SUCCESS,
  },
  addressModalContent: {
    backgroundColor: Colors.LIGHT_BACKGROUND,
    borderTopLeftRadius: Spacing.BORDER_RADIUS_L,
    borderTopRightRadius: Spacing.BORDER_RADIUS_L,
    maxHeight: '90%',
    marginTop: 'auto',
    paddingBottom: Spacing.M,
  },
  addressModalBody: {
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    maxHeight: '70%',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: Spacing.M,
    marginBottom: Spacing.L,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.S,
    paddingVertical: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  tabButtonActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  tabButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: Spacing.M,
    marginBottom: Spacing.L,
  },
  fetchLocationButton: {
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
    width: '100%',
  },
  fetchLocationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.S,
    paddingVertical: Spacing.M,
    paddingHorizontal: Spacing.M,
  },
  fetchLocationText: {
    color: '#FFFFFF',
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    textAlign: 'center',
  },
  locationPreview: {
    gap: Spacing.S,
  },
  previewLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  previewCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  previewAddress: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  previewSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.XS,
  },
  formGroup: {
    gap: Spacing.S,
  },
  formLabel: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  textInput: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
    minHeight: 48,
  },
  addressModalFooter: {
    flexDirection: 'row',
    gap: Spacing.M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
  },
  cancelButton: {
    flex: 1,
    borderRadius: Spacing.BORDER_RADIUS_M,
    borderWidth: 1.5,
    borderColor: Colors.BORDER_LIGHT,
    paddingVertical: Spacing.M,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  saveButton: {
    flex: 1,
    borderRadius: Spacing.BORDER_RADIUS_M,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: Spacing.M,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.BODY_M,
    fontWeight: '700',
  },
});

export default PayNowScreen;
