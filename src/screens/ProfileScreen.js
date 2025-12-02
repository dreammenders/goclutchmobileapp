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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const savedName = await AsyncStorage.getItem('@user_name');
      const savedPhone = await AsyncStorage.getItem('@user_phone');
      const savedEmail = await AsyncStorage.getItem('@user_email');
      const savedAddress = await AsyncStorage.getItem('@user_address');
      
      if (savedName) setName(savedName);
      if (savedPhone) setPhone(savedPhone);
      if (savedEmail) setEmail(savedEmail);
      if (savedAddress) setAddress(savedAddress);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return;
      }
      await AsyncStorage.setItem('@user_name', name.trim());
      await AsyncStorage.setItem('@user_email', email.trim());
      await AsyncStorage.setItem('@user_address', address.trim());
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow location access to use this feature');
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const {
          street,
          city,
          region,
          postalCode,
        } = reverseGeocode[0];
        const formattedAddress = [street, city, region, postalCode]
          .filter(Boolean)
          .join(', ');
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your location. Please try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View style={styles.formSection}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholder="Enter your name"
                placeholderTextColor="#BDBDBD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={phone}
                editable={false}
                placeholder="Phone number"
                placeholderTextColor="#BDBDBD"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={address}
                onChangeText={setAddress}
                editable={isEditing}
                placeholder="Enter your address or use current location"
                placeholderTextColor="#BDBDBD"
                multiline
              />
              {isEditing && (
                <TouchableOpacity
                  style={styles.locationButton}
                  onPress={handleUseCurrentLocation}
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <ActivityIndicator size="small" color={Colors.PRIMARY} />
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={16}
                        color={Colors.PRIMARY}
                      />
                      <Text style={styles.locationButtonText}>Use Current Location</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.buttonContainer}>
              {!isEditing ? (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      setIsEditing(false);
                      loadUserData();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
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
    backgroundColor: '#FAFBFC',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingVertical: Spacing.M,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDF3',
  },
  backButton: {
    marginRight: Spacing.M,
  },
  headerTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  scrollContent: {
    paddingTop: Spacing.L,
    paddingBottom: Spacing.XL,
  },
  profileSection: {
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
  },
  formGroup: {
    marginBottom: Spacing.L,
  },
  label: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.S,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8EDF3',
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.M,
    fontSize: Typography.BODY_M,
    color: Colors.TEXT_PRIMARY,
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.S,
    paddingVertical: Spacing.S,
    gap: Spacing.XS,
  },
  locationButtonText: {
    fontSize: Typography.BODY_S,
    color: Colors.PRIMARY,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.M,
    marginTop: Spacing.L,
  },
  editButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
  },
  editButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.PRIMARY,
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.TEXT_SECONDARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
  },
  cancelButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
});

export default ProfileScreen;
