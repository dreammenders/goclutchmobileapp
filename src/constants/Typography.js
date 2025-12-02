import { Platform } from 'react-native';

export const Typography = {
  // Font Families
  FONT_REGULAR: Platform.OS === 'ios' ? 'System' : 'Roboto',
  FONT_MEDIUM: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
  FONT_BOLD: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
  
  // Font Sizes (hardcoded base values for module initialization)
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
  
  // Line Heights
  LINE_HEIGHT_TIGHT: 1.2,
  LINE_HEIGHT_NORMAL: 1.4,
  LINE_HEIGHT_LOOSE: 1.6,
  
  // Letter Spacing
  LETTER_SPACING_TIGHT: -0.5,
  LETTER_SPACING_NORMAL: 0,
  LETTER_SPACING_LOOSE: 0.5,
};