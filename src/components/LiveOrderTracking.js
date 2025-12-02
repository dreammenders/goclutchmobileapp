import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { Typography } from '../constants/Typography';
import { Spacing } from '../constants/Spacing';

const LiveOrderTracking = ({ navigation, orderId = 'GC123456', onClose }) => {
  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [estimatedTime, setEstimatedTime] = useState(45); // minutes
  const [technicianInfo, setTechnicianInfo] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    rating: 4.8,
    photo: 'https://via.placeholder.com/60x60/FE5110/FFFFFF?text=RK',
  });

  const orderStatuses = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed',
      icon: 'check-circle',
      color: Colors.SUCCESS,
      completed: true,
      timestamp: '10:30 AM',
    },
    {
      id: 'assigned',
      title: 'Technician Assigned',
      description: 'Rajesh Kumar is on the way',
      icon: 'account-check',
      color: Colors.PRIMARY,
      completed: true,
      timestamp: '10:35 AM',
    },
    {
      id: 'enroute',
      title: 'Technician En Route',
      description: 'Technician is 2.5 km away',
      icon: 'map-marker-distance',
      color: Colors.WARNING,
      completed: true,
      timestamp: '10:45 AM',
    },
    {
      id: 'arrived',
      title: 'Technician Arrived',
      description: 'Technician has arrived at your location',
      icon: 'map-marker-check',
      color: Colors.INFO,
      completed: false,
      timestamp: null,
    },
    {
      id: 'inprogress',
      title: 'Service In Progress',
      description: 'AC service is being performed',
      icon: 'wrench',
      color: Colors.WARNING,
      completed: false,
      timestamp: null,
    },
    {
      id: 'completed',
      title: 'Service Completed',
      description: 'Service has been completed successfully',
      icon: 'check-circle-outline',
      color: Colors.SUCCESS,
      completed: false,
      timestamp: null,
    },
  ];

  const microUpdates = [
    { id: 1, message: 'Order confirmed and payment processed', time: '10:30 AM', type: 'system' },
    { id: 2, message: 'Technician Rajesh Kumar assigned to your order', time: '10:35 AM', type: 'system' },
    { id: 3, message: 'Technician has picked up tools and spare parts', time: '10:40 AM', type: 'technician' },
    { id: 4, message: 'Technician is 3 km away from your location', time: '10:42 AM', type: 'location' },
    { id: 5, message: 'Technician is 2 km away from your location', time: '10:45 AM', type: 'location' },
    { id: 6, message: 'Technician has arrived and is waiting for access', time: '10:50 AM', type: 'technician' },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const statusUpdates = [
      { status: 'arrived', delay: 5000 }, // 5 seconds
      { status: 'inprogress', delay: 15000 }, // 15 seconds
      { status: 'completed', delay: 30000 }, // 30 seconds
    ];

    statusUpdates.forEach(({ status, delay }) => {
      setTimeout(() => {
        setCurrentStatus(status);
        setEstimatedTime(prev => Math.max(0, prev - 15));
      }, delay);
    });

    // Update ETA every minute
    const etaInterval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000);

    return () => clearInterval(etaInterval);
  }, []);

  const getCurrentStatusIndex = () => {
    return orderStatuses.findIndex(status => status.id === currentStatus);
  };

  const handleCallTechnician = () => {
    Alert.alert(
      'Call Technician',
      `Call ${technicianInfo.name} at ${technicianInfo.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {/* Handle call */} },
      ]
    );
  };

  const handleReschedule = () => {
    Alert.alert(
      'Reschedule Service',
      'Would you like to reschedule this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reschedule', onPress: () => navigation.navigate('RescheduleOrder', { orderId }) },
      ]
    );
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? Cancellation charges may apply.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => {/* Handle cancellation */} },
      ]
    );
  };

  const renderStatusTimeline = () => (
    <View style={styles.timelineContainer}>
      {orderStatuses.map((status, index) => {
        const isCompleted = index <= getCurrentStatusIndex();
        const isCurrent = index === getCurrentStatusIndex();

        return (
          <View key={status.id} style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[
                styles.statusIconContainer,
                { backgroundColor: isCompleted ? status.color : Colors.SECTION_BACKGROUND }
              ]}>
                <MaterialCommunityIcons
                  name={status.icon}
                  size={20}
                  color={isCompleted ? Colors.LIGHT_BACKGROUND : Colors.TEXT_MUTED}
                />
              </View>
              {index < orderStatuses.length - 1 && (
                <View style={[
                  styles.timelineLine,
                  isCompleted && styles.timelineLineActive
                ]} />
              )}
            </View>

            <View style={styles.timelineRight}>
              <View style={styles.statusHeader}>
                <Text style={[
                  styles.statusTitle,
                  isCurrent && styles.statusTitleCurrent
                ]}>
                  {status.title}
                </Text>
                {status.timestamp && (
                  <Text style={styles.statusTime}>{status.timestamp}</Text>
                )}
              </View>
              <Text style={[
                styles.statusDescription,
                isCurrent && styles.statusDescriptionCurrent
              ]}>
                {status.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderTechnicianCard = () => (
    <View style={styles.technicianCard}>
      <View style={styles.technicianHeader}>
        <View style={styles.technicianInfo}>
          <View style={styles.technicianAvatar}>
            <Text style={styles.technicianInitials}>RK</Text>
          </View>
          <View>
            <Text style={styles.technicianName}>{technicianInfo.name}</Text>
            <View style={styles.technicianRating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{technicianInfo.rating}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={handleCallTechnician}>
          <Ionicons name="call" size={20} color={Colors.LIGHT_BACKGROUND} />
        </TouchableOpacity>
      </View>

      <View style={styles.technicianActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCallTechnician}>
          <Ionicons name="call-outline" size={16} color={Colors.PRIMARY} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* Handle message */}}>
          <Ionicons name="chatbubble-outline" size={16} color={Colors.PRIMARY} />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* Handle location */}}>
          <MaterialCommunityIcons name="map-marker-outline" size={16} color={Colors.PRIMARY} />
          <Text style={styles.actionText}>Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMicroUpdates = () => (
    <View style={styles.updatesContainer}>
      <Text style={styles.updatesTitle}>Live Updates</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {microUpdates.map((update) => (
          <View key={update.id} style={styles.updateItem}>
            <View style={styles.updateIcon}>
              <MaterialCommunityIcons
                name={
                  update.type === 'system' ? 'information' :
                  update.type === 'technician' ? 'account' : 'map-marker'
                }
                size={16}
                color={Colors.TEXT_MUTED}
              />
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateMessage}>{update.message}</Text>
              <Text style={styles.updateTime}>{update.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose || (() => navigation.goBack())} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.TEXT_PRIMARY} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <Text style={styles.orderId}>Order #{orderId}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleReschedule}>
            <MaterialCommunityIcons name="calendar-refresh" size={20} color={Colors.TEXT_SECONDARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleCancelOrder}>
            <MaterialCommunityIcons name="close" size={20} color={Colors.ERROR} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.etaCard}>
          <View style={styles.etaContent}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={Colors.PRIMARY} />
            <View style={styles.etaText}>
              <Text style={styles.etaTitle}>
                {estimatedTime > 0 ? `${estimatedTime} mins remaining` : 'Service in progress'}
              </Text>
              <Text style={styles.etaSubtitle}>
                {currentStatus === 'completed' ? 'Service completed successfully' : 'Estimated completion time'}
              </Text>
            </View>
          </View>
          {currentStatus !== 'completed' && (
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.max(10, 100 - (estimatedTime / 45) * 100)}%` }
                ]}
              />
            </View>
          )}
        </View>

        {renderTechnicianCard()}

        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Order Status</Text>
          {renderStatusTimeline()}
        </View>

        {renderMicroUpdates()}
      </ScrollView>

      {currentStatus === 'completed' && (
        <View style={styles.completedBanner}>
          <MaterialCommunityIcons name="check-circle" size={24} color={Colors.SUCCESS} />
          <Text style={styles.completedText}>Service Completed Successfully!</Text>
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonText}>Rate Service</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
    backgroundColor: Colors.CARD_BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: Colors.BORDER_LIGHT,
  },
  backButton: {
    padding: Spacing.S,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.HEADING_M,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  orderId: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: Spacing.S,
    marginLeft: Spacing.S,
  },
  content: {
    flex: 1,
  },
  etaCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    margin: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
  },
  etaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  etaText: {
    marginLeft: Spacing.M,
    flex: 1,
  },
  etaTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
  },
  etaSubtitle: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginTop: Spacing.XS,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.SECTION_BACKGROUND,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
    borderRadius: 2,
  },
  technicianCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    marginHorizontal: Spacing.M,
    marginBottom: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
  },
  technicianHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.M,
  },
  technicianInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  technicianAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  technicianInitials: {
    fontSize: Typography.BODY_L,
    fontWeight: '700',
    color: Colors.LIGHT_BACKGROUND,
  },
  technicianName: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
  },
  technicianRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.XS,
  },
  ratingText: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
    marginLeft: Spacing.XS,
  },
  callButton: {
    backgroundColor: Colors.SUCCESS,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  technicianActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: Spacing.S,
  },
  actionText: {
    fontSize: Typography.BODY_XS,
    color: Colors.PRIMARY,
    marginTop: Spacing.XS,
  },
  statusSection: {
    marginHorizontal: Spacing.M,
    marginBottom: Spacing.M,
  },
  sectionTitle: {
    fontSize: Typography.HEADING_S,
    fontWeight: '700',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  timelineContainer: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.L,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Spacing.M,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.BORDER_LIGHT,
    marginTop: Spacing.S,
  },
  timelineLineActive: {
    backgroundColor: Colors.PRIMARY,
  },
  timelineRight: {
    flex: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.XS,
  },
  statusTitle: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.TEXT_SECONDARY,
  },
  statusTitleCurrent: {
    color: Colors.PRIMARY,
  },
  statusTime: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
  },
  statusDescription: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_SECONDARY,
  },
  statusDescriptionCurrent: {
    color: Colors.TEXT_PRIMARY,
    fontWeight: '600',
  },
  updatesContainer: {
    backgroundColor: Colors.CARD_BACKGROUND,
    marginHorizontal: Spacing.M,
    marginBottom: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
    padding: Spacing.M,
    maxHeight: 200,
  },
  updatesTitle: {
    fontSize: Typography.BODY_L,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.M,
  },
  updateItem: {
    flexDirection: 'row',
    marginBottom: Spacing.M,
  },
  updateIcon: {
    marginRight: Spacing.M,
    marginTop: Spacing.XS,
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: Typography.BODY_S,
    color: Colors.TEXT_PRIMARY,
    marginBottom: Spacing.XS,
  },
  updateTime: {
    fontSize: Typography.BODY_XS,
    color: Colors.TEXT_MUTED,
  },
  completedBanner: {
    backgroundColor: Colors.SUCCESS_LIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.M,
    margin: Spacing.M,
    borderRadius: Spacing.BORDER_RADIUS_M,
  },
  completedText: {
    fontSize: Typography.BODY_M,
    fontWeight: '600',
    color: Colors.SUCCESS_DARK,
    flex: 1,
    marginLeft: Spacing.S,
  },
  rateButton: {
    backgroundColor: Colors.SUCCESS,
    paddingHorizontal: Spacing.M,
    paddingVertical: Spacing.S,
    borderRadius: Spacing.BORDER_RADIUS_S,
  },
  rateButtonText: {
    fontSize: Typography.BODY_S,
    color: Colors.LIGHT_BACKGROUND,
    fontWeight: '600',
  },
});

export default LiveOrderTracking;