import { Dimensions } from 'react-native';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 812;

export const getSafeWidth = () => {
  try {
    const dims = Dimensions.get('window');
    return (dims && typeof dims === 'object' && dims.width) ? dims.width : DEFAULT_WIDTH;
  } catch (error) {
    console.warn('Error getting window width:', error);
    return DEFAULT_WIDTH;
  }
};

export const getSafeHeight = () => {
  try {
    const dims = Dimensions.get('window');
    return (dims && typeof dims === 'object' && dims.height) ? dims.height : DEFAULT_HEIGHT;
  } catch (error) {
    console.warn('Error getting window height:', error);
    return DEFAULT_HEIGHT;
  }
};

export const getSafeDimensions = () => {
  try {
    const dims = Dimensions.get('window');
    return {
      width: (dims && typeof dims === 'object' && dims.width) ? dims.width : DEFAULT_WIDTH,
      height: (dims && typeof dims === 'object' && dims.height) ? dims.height : DEFAULT_HEIGHT,
    };
  } catch (error) {
    console.warn('Error getting dimensions:', error);
    return {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    };
  }
};
