import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Spacing';
import { Typography } from '../constants/Typography';
import { responsiveSize } from '../constants/Responsive';

const getStyles = () => {
  return StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: Colors.CARD_BACKGROUND,
      borderRadius: Spacing.BORDER_RADIUS_M,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
      marginBottom: Spacing.M,
    },
    imageContainer: {
      height: responsiveSize(140),
      backgroundColor: Colors.SECTION_BACKGROUND,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: Colors.BORDER_LIGHT,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    icon: {
      fontSize: responsiveSize(56),
    },
    content: {
      padding: Spacing.M,
    },
    name: {
      fontSize: Typography.BODY_M,
      fontWeight: '600',
      color: Colors.TEXT_PRIMARY,
      marginBottom: Spacing.S,
      lineHeight: Typography.LINE_HEIGHT_NORMAL * Typography.BODY_M,
    },
    tag: {
      alignSelf: 'flex-start',
      paddingHorizontal: Spacing.S,
      paddingVertical: Spacing.XS,
      borderRadius: Spacing.BORDER_RADIUS_S,
    },
    tagText: {
      fontSize: Typography.CAPTION,
      fontWeight: '700',
      color: Colors.LIGHT_BACKGROUND,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
    },
  });
};

let styles = null;

if (!styles) {
  styles = getStyles();
}

const AccessoryCard = ({ id, name, icon, tag, onPress, imageUrl }) => {
  
  const iconMap = {
    tyres: '🛞',
    batteries: '🔋',
    coolers: '❄️',
    seatcovers: '🪑',
    lights: '💡',
    perfumes: '🌸',
  };

  const displayIcon = icon || iconMap[name?.toLowerCase()] || '🚗';

  const getTagColor = (tagType) => {
    switch (tagType?.toLowerCase()) {
      case 'new':
        return Colors.PRIMARY;
      case 'offer':
        return Colors.WARNING;
      case 'sale':
        return Colors.ERROR;
      default:
        return Colors.PRIMARY;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Image/Icon Container */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <Text style={styles.icon}>{displayIcon}</Text>
        )}
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        {/* Tag */}
        {tag && (
          <View
            style={[
              styles.tag,
              { backgroundColor: getTagColor(tag) },
            ]}
          >
            <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Overlay on Press */}
      <View style={styles.overlay} />
    </TouchableOpacity>
  );
};

export default AccessoryCard;