import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const FastCheckoutFlow = ({ navigation, cartItems = [], totalAmount = 0, onOrderComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Mock data
  const savedAddresses = [
    {
      id: '1',
      type: 'home',
      title: 'Home',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      landmark: 'Near Brigade Tower',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      title: 'Office',
      address: '456 Brigade Road, Bangalore, Karnataka 560025',
      landmark: 'Opposite to Forum Mall',
      isDefault: false,
    },
  ];

  const paymentMethods = [
    {
      id: 'card',
      type: 'card',
      title: 'Credit/Debit Card',
      subtitle: '**** **** **** 4521',
      icon: 'credit-card',
    },
    {
      id: 'upi',
      type: 'upi',
      title: 'UPI',
      subtitle: 'user@okhdfcbank',
      icon: 'cellphone',
    },
    {
      id: 'wallet',
      type: 'wallet',
      title: 'GoClutch Wallet',
      subtitle: '₹250 available',
      icon: 'wallet',
    },
    {
      id: 'cod',
      type: 'cod',
      title: 'Cash on Delivery',
      subtitle: 'Pay when service is done',
      icon: 'cash',
    },
  ];

  const timeSlots = [
    { id: '1', time: '9:00 AM - 11:00 AM', available: true },
    { id: '2', time: '11:00 AM - 1:00 PM', available: true },
    { id: '3', time: '2:00 PM - 4:00 PM', available: false },
    { id: '4', time: '4:00 PM - 6:00 PM', available: true },
  ];

  const walletBalance = 250;
  const deliveryFee = 0; // Free delivery
  const taxAmount = Math.round(totalAmount * 0.18); // 18% GST
  const discountAmount = couponCode === 'SAVE20' ? Math.round(totalAmount * 0.2) : 0;
  const walletDeduction = useWallet ? Math.min(walletBalance, totalAmount + taxAmount - discountAmount) : 0;
  const finalAmount = totalAmount + taxAmount - discountAmount - walletDeduction;

  const steps = [
    { id: 1, title: 'Address', icon: 'map-marker' },
    { id: 2, title: 'Time Slot', icon: 'clock-outline' },
    { id: 3, title: 'Payment', icon: 'credit-card' },
    { id: 4, title: 'Confirm', icon: 'check-circle' },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      'Order Confirmed!',
      `Your order for ₹${finalAmount} has been placed successfully. You'll receive a confirmation shortly.`,
      [
        {
          text: 'Track Order',
          onPress: () => navigation.navigate('OrderTracking')
        },
        {
          text: 'OK',
          onPress: () => {
            if (onOrderComplete) onOrderComplete();
            navigation.goBack();
          }
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step) => (
        <View key={step.id} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            currentStep >= step.id && styles.stepCircleActive,
            currentStep === step.id && styles.stepCircleCurrent
          ]}>
            <MaterialCommunityIcons
              name={step.icon}
              size={16}
              color={currentStep >= step.id ? Colors.LIGHT_BACKGROUND : Colors.TEXT_MUTED}
            />
          </View>
          <Text style={[
            styles.stepText,
            currentStep >= step.id && styles.stepTextActive
          ]}>
            {step.title}
          </Text>
          {step.id < steps.length && (
            <View style={[
              styles.stepLine,
              currentStep > step.id && styles.stepLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderAddressStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Delivery Address</Text>
      {savedAddresses.map((address) => (
        <TouchableOpacity
          key={address.id}
          style={[
            styles.addressCard,
            selectedAddress?.id === address.id && styles.addressCardSelected
          ]}
          onPress={() => setSelectedAddress(address)}
        >
          <View style={styles.addressIcon}>
            <MaterialCommunityIcons
              name={address.type === 'home' ? 'home' : 'office-building'}
              size={24}
              color={selectedAddress?.id === address.id ? Colors.PRIMARY : Colors.TEXT_SECONDARY}
            />
          </View>
          <View style={styles.addressContent}>
            <View style={styles.addressHeader}>
              <Text style={styles.addressTitle}>{address.title}</Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.addressText}>{address.address}</Text>
            <Text style={styles.landmarkText}>{address.landmark}</Text>
          </View>
          {selectedAddress?.id === address.id && (
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.PRIMARY} />
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.addAddressButton}>
        <MaterialCommunityIcons name="plus" size={20} color={Colors.PRIMARY} />
        <Text style={styles.addAddressText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTimeSlotStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Time Slot</Text>
      <Text style={styles.stepSubtitle}>Choose your preferred service time</Text>

      {timeSlots.map((slot) => (
        <TouchableOpacity
          key={slot.id}
          style={[
            styles.timeSlotCard,
            selectedTimeSlot?.id === slot.id && styles.timeSlotCardSelected,
            !slot.available && styles.timeSlotCardDisabled
          ]}
          onPress={() => slot.available && setSelectedTimeSlot(slot)}
          disabled={!slot.available}
        >
          <Text style={[
            styles.timeSlotText,
            selectedTimeSlot?.id === slot.id && styles.timeSlotTextSelected,
            !slot.available && styles.timeSlotTextDisabled
          ]}>
            {slot.time}
          </Text>
          {selectedTimeSlot?.id === slot.id && (
            <MaterialCommunityIcons name="check" size={20} color={Colors.PRIMARY} />
          )}
          {!slot.available && (
            <Text style={styles.unavailableText}>Unavailable</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPaymentStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.paymentCard,
            selectedPayment?.id === method.id && styles.paymentCardSelected
          ]}
          onPress={() => setSelectedPayment(method)}
        >
          <View style={styles.paymentIcon}>
            <MaterialCommunityIcons
              name={method.icon}
              size={24}
              color={selectedPayment?.id === method.id ? Colors.PRIMARY : Colors.TEXT_SECONDARY}
            />
          </View>
          <View style={styles.paymentContent}>
            <Text style={styles.paymentTitle}>{method.title}</Text>
            <Text style={styles.paymentSubtitle}>{method.subtitle}</Text>
          </View>
          {selectedPayment?.id === method.id && (
            <MaterialCommunityIcons name="check-circle" size={24} color={Colors.PRIMARY} />
          )}
        </TouchableOpacity>
      ))}

      <View style={styles.couponSection}>
        <Text style={styles.couponTitle}>Have a coupon?</Text>
        <View style={styles.couponInput}>
          <TextInput
            style={styles.couponTextInput}
            placeholder="Enter coupon code"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyCouponButton}>
            <Text style={styles.applyCouponText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      {walletBalance > 0 && (
        <TouchableOpacity
          style={styles.walletSection}
          onPress={() => setUseWallet(!useWallet)}
        >
          <View style={styles.walletLeft}>
            <MaterialCommunityIcons name="wallet" size={20} color={Colors.SUCCESS} />
            <View style={styles.walletInfo}>
              <Text style={styles.walletTitle}>Use GoClutch Wallet</Text>
              <Text style={styles.walletBalance}>₹{walletBalance} available</Text>
            </View>
          </View>
          <View style={[
            styles.checkbox,
            useWallet && styles.checkboxChecked
          ]}>
            {useWallet && <Ionicons name="checkmark" size={16} color={Colors.LIGHT_BACKGROUND} />}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderConfirmStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Order Summary</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total</Text>
          <Text style={styles.summaryValue}>₹{totalAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (GST 18%)</Text>
          <Text style={styles.summaryValue}>₹{taxAmount}</Text>
        </View>
        {discountAmount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>-₹{discountAmount}</Text>
          </View>
        )}
        {walletDeduction > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Wallet</Text>
            <Text style={[styles.summaryValue, styles.discountValue]}>-₹{walletDeduction}</Text>
          </View>
        )}
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{finalAmount}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.detailText}>{selectedAddress?.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.detailText}>{selectedTimeSlot?.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="credit-card" size={20} color={Colors.TEXT_SECONDARY} />
          <Text style={styles.detailText}>{selectedPayment?.title}</Text>
        </View>
      </View>

      <View style={styles.instructionsSection}>
        <Text style={styles.instructionsTitle}>Special Instructions (Optional)</Text>
        <TextInput
          style={styles.instructionsInput}
          placeholder="Any special requests or instructions..."
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderAddressStep();
      case 2: return renderTimeSlotStep();
      case 3: return renderPaymentStep();
      case 4: return renderConfirmStep();
      default: return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedAddress !== null;
      case 2: return selectedTimeSlot !== null;
      case 3: return selectedPayment !== null;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.totalText}>₹{finalAmount}</Text>
          <Text style={styles.itemsText}>{cartItems.length} item{cartItems.length > 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Place Order' : 'Continue'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.LIGHT_BACKGROUND} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PAGE_BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  backButton: {
    padding: Spacing.S,
  },
  headerTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.L,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.SECTION_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  stepCircleActive: {
    backgroundColor: Colors.PRIMARY,
  },
  stepCircleCurrent: {
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  stepText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
    textAlign: 'center',
  },
  stepTextActive: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: Colors.BORDER_LIGHT,
  },
  stepLineActive: {
    backgroundColor: Colors.PRIMARY,
  },
  scrollContainer: {
    flex: 1,
  },
  stepContent: {
    padding: Spacing.M,
  },
  stepTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  stepSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.L,
  },
  // Address step styles
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.S,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  addressCardSelected: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  addressIcon: {
    marginRight: Spacing.M,
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  },
  addressTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginRight: Spacing.S,
  },
  defaultBadge: {
    backgroundColor: Colors.SUCCESS,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  defaultText: {
    fontSize: Typography.BODY_XS,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  addressText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginBottom: Spacing.XS,
  },
  landmarkText: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginTop: Spacing.S,
  },
  addAddressText: {
    fontSize: Typography.BODY_M,
    color: Colors.PRIMARY,
    marginLeft: Spacing.S,
    fontWeight: '600',
  },
  // Time slot styles
  timeSlotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.S,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  timeSlotCardSelected: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  timeSlotCardDisabled: {
    backgroundColor: Colors.SECTION_BACKGROUND,
    opacity: 0.6,
  },
  timeSlotText: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
  },
  timeSlotTextSelected: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  timeSlotTextDisabled: {
    color: Colors.TEXT_MUTED,
  },
  unavailableText: {
    fontSize: Typography.BODY_XS,
    color: Colors.ERROR,
  },
  // Payment styles
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.S,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
  },
  paymentCardSelected: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.PRIMARY_LIGHT,
  },
  paymentIcon: {
    marginRight: Spacing.M,
  },
  paymentContent: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  paymentSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  couponSection: {
    marginTop: Spacing.L,
  },
  couponTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  couponInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    marginRight: Spacing.S,
    fontSize: Typography.BODY_M,
  },
  applyCouponButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
  },
  applyCouponText: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
  walletSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginTop: Spacing.M,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletInfo: {
    marginLeft: Spacing.M,
  },
  walletTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  walletBalance: {
    fontSize: Typography.BODY_S,
    color: Colors.SUCCESS,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.BORDER_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  // Confirm step styles
  summaryCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.L,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.S,
  },
  summaryLabel: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_SECONDARY,
  },
  summaryValue: {
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '600',
  },
  discountValue: {
    color: Colors.SUCCESS,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
    paddingTop: Spacing.S,
    marginTop: Spacing.S,
  },
  totalLabel: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  orderDetails: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    marginBottom: Spacing.L,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.S,
  },
  detailText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.S,
    flex: 1,
  },
  instructionsSection: {
    marginBottom: Spacing.L,
  },
  instructionsTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: Colors.BORDER_LIGHT,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER_LIGHT,
    padding: Spacing.M,
  },
  footerLeft: {
    flex: 1,
  },
  totalText: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.PRIMARY,
  },
  itemsText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.L,
    paddingVertical: Spacing.M,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.TEXT_MUTED,
  },
  nextButtonText: {
    fontSize: Typography.BODY_M,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
    marginRight: Spacing.S,
  },
});

export default FastCheckoutFlow;