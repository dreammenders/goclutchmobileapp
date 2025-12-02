import { Platform } from 'react-native';
import { getSafeDimensions } from '../utils/SafeDimensions';

const baseWidth = 375;
const baseHeight = 812;
const DEFAULT_DIMENSIONS = { width: 400, height: 812 };

const getDimensions = () => {
  try {
    const dims = getSafeDimensions();
    return (dims && typeof dims === 'object' && dims.width && dims.height) ? dims : DEFAULT_DIMENSIONS;
  } catch (error) {
    return DEFAULT_DIMENSIONS;
  }
};

export const responsiveSize = (size) => {
  const dimensions = getDimensions() || DEFAULT_DIMENSIONS;
  const screenWidth = (dimensions && typeof dimensions === 'object' && dimensions.width) ? dimensions.width : baseWidth;
  const scale = screenWidth / baseWidth;
  return Math.round(size * scale);
};

export const responsiveHeight = (percentage) => {
  const dimensions = getDimensions() || DEFAULT_DIMENSIONS;
  const screenHeight = (dimensions && typeof dimensions === 'object' && dimensions.height) ? dimensions.height : baseHeight;
  return Math.round((percentage / 100) * screenHeight);
};

export const responsiveWidth = (percentage) => {
  const dimensions = getDimensions() || DEFAULT_DIMENSIONS;
  const screenWidth = (dimensions && typeof dimensions === 'object' && dimensions.width) ? dimensions.width : baseWidth;
  return Math.round((percentage / 100) * screenWidth);
};

export const Responsive = {
  SCREEN_WIDTH: 400,
  SCREEN_HEIGHT: 812,
  IS_SMALL_DEVICE: false,
  IS_LARGE_DEVICE: false,
  
  screenDimensions: {
    width: 400,
    height: 812,
    diagonal: Math.sqrt(400 * 400 + 812 * 812),
  },

  fontSize: {
    HEADING_XL: 32,
    HEADING_L: 28,
    HEADING_M: 24,
    HEADING_S: 20,
    BODY_L: 18,
    BODY_M: 16,
    BODY_S: 14,
    BODY_XS: 12,
    BUTTON: 16,
    CAPTION: 12,
    SMALL: 10,
  },

  spacing: {
    XS: 4,
    S: 8,
    M: 16,
    L: 24,
    XL: 32,
    XXL: 48,
    SCREEN_HORIZONTAL: 20,
    SCREEN_VERTICAL: 16,
  },

  borderRadius: {
    S: 8,
    M: 12,
    L: 16,
    XL: 24,
    CIRCLE: 50,
  },

  componentHeight: {
    HEADER: 60,
    TAB_BAR: 56,
    BUTTON: 48,
    INPUT: 52,
    CARD: 130,
  },

  iconSize: {
    SMALL: 16,
    MEDIUM: 24,
    LARGE: 32,
    EXTRA_LARGE: 48,
  },

  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  cardWidth: {
    FULL: 360,
    HALF: 170,
    THIRD: 113,
  },

  bannerHeight: 180,
  carouselItemWidth: 280,
};

export default Responsive;
