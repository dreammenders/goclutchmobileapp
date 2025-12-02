import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const GaragesScreen = ({ navigation }) => {
  const [garages] = useState([
    { id: '1', name: 'Home Garage', location: '123 Main St, City' },
    { id: '2', name: 'Office Parking', location: '456 Work Ave, City' },
  ]);

  const renderGarageItem = ({ item }) => (
    <View style={styles.garageCard}>
      <View style={styles.garageHeader}>
        <View style={styles.garageIcon}>
          <MaterialCommunityIcons name="garage" size={24} color={Colors.PRIMARY} />
        </View>
        <View style={styles.garageInfo}>
          <Text style={styles.garageName}>{item.name}</Text>
          <Text style={styles.garageLocation}>{item.location}</Text>
        </View>
      </View>
      <View style={styles.garageActions}>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="pencil" size={18} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialCommunityIcons name="delete" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Garages</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={garages}
          renderItem={renderGarageItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color={Colors.LIGHT_BACKGROUND} />
          <Text style={styles.addButtonText}>Add New Garage</Text>
        </TouchableOpacity>
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
    paddingHorizontal: Spacing.SCREEN_HORIZONTAL,
    paddingTop: Spacing.L,
    paddingBottom: Spacing.XL,
  },
  listContent: {
    gap: Spacing.M,
  },
  garageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.BORDER_RADIUS_L,
    padding: Spacing.M,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EDF3',
  },
  garageHeader: {
    flexDirection: 'row',
    flex: 1,
  },
  garageIcon: {
    width: 48,
    height: 48,
    borderRadius: Spacing.BORDER_RADIUS_M,
    backgroundColor: `${Colors.PRIMARY}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  garageInfo: {
    flex: 1,
  },
  garageName: {
    fontSize: Typography.BODY_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  garageLocation: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  garageActions: {
    flexDirection: 'row',
    gap: Spacing.S,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: Colors.PRIMARY,
    borderRadius: Spacing.BORDER_RADIUS_M,
    paddingVertical: Spacing.M,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.S,
    marginTop: Spacing.M,
  },
  addButtonText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.LIGHT_BACKGROUND,
  },
});

export default GaragesScreen;
