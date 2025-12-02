import React from 'react';
import { View } from 'react-native';
import { Colors } from '../constants/Colors';

export const ServicesIcon = ({ size = 28 }) => {
  const sw = 2;
  const iconColor = Colors.PRIMARY;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'relative', width: size, height: size }}>
        {/* Wrench - main handle */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.08,
            top: size * 0.35,
            width: size * 0.5,
            height: sw,
            backgroundColor: iconColor,
            transform: [{ rotate: '-35deg' }],
            transformOrigin: '0 50%',
          }}
        />
        
        {/* Wrench - head */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.55,
            top: size * 0.2,
            width: size * 0.35,
            height: size * 0.3,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: 6,
          }}
        />
        
        {/* Wrench - thumb indent */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.62,
            top: size * 0.25,
            width: size * 0.15,
            height: size * 0.1,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: 4,
          }}
        />
        
        {/* Gear - circle */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.32,
            top: size * 0.5,
            width: size * 0.38,
            height: size * 0.38,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: size * 0.19,
          }}
        />
        
        {/* Gear - teeth (4 dots around circle) */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.45,
            top: size * 0.15,
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: iconColor,
            borderRadius: size * 0.04,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: size * 0.75,
            top: size * 0.62,
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: iconColor,
            borderRadius: size * 0.04,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: size * 0.15,
            top: size * 0.62,
            width: size * 0.08,
            height: size * 0.08,
            backgroundColor: iconColor,
            borderRadius: size * 0.04,
          }}
        />
      </View>
    </View>
  );
};

export const VehiclesIcon = ({ size = 28 }) => {
  const sw = 2;
  const iconColor = Colors.PRIMARY;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'relative', width: size, height: size }}>
        {/* Car body */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.1,
            top: size * 0.4,
            width: size * 0.8,
            height: size * 0.35,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: 4,
          }}
        />
        
        {/* Car roof */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.25,
            top: size * 0.25,
            width: size * 0.5,
            height: size * 0.2,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: 4,
          }}
        />
        
        {/* Front wheel */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.18,
            top: size * 0.72,
            width: size * 0.18,
            height: size * 0.18,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: size * 0.09,
          }}
        />
        
        {/* Rear wheel */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.64,
            top: size * 0.72,
            width: size * 0.18,
            height: size * 0.18,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: size * 0.09,
          }}
        />
        
        {/* Wheel hubs */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.258,
            top: size * 0.8,
            width: size * 0.06,
            height: size * 0.06,
            backgroundColor: iconColor,
            borderRadius: size * 0.03,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: size * 0.718,
            top: size * 0.8,
            width: size * 0.06,
            height: size * 0.06,
            backgroundColor: iconColor,
            borderRadius: size * 0.03,
          }}
        />
        
        {/* Headlight */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.08,
            top: size * 0.52,
            width: size * 0.08,
            height: size * 0.08,
            borderWidth: 1.5,
            borderColor: iconColor,
            borderRadius: size * 0.04,
          }}
        />
      </View>
    </View>
  );
};

export const GoldCrownIcon = ({ size = 28 }) => {
  const sw = 2;
  const iconColor = Colors.PRIMARY;
  
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ position: 'relative', width: size, height: size }}>
        {/* Crown band */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.12,
            top: size * 0.65,
            width: size * 0.76,
            height: size * 0.16,
            borderWidth: sw,
            borderColor: iconColor,
            borderRadius: 3,
          }}
        />
        
        {/* Left spike */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.22,
            top: size * 0.3,
            width: sw,
            height: size * 0.35,
            backgroundColor: iconColor,
          }}
        />
        
        {/* Center spike (tallest) */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.48,
            top: size * 0.1,
            width: sw,
            height: size * 0.55,
            backgroundColor: iconColor,
          }}
        />
        
        {/* Right spike */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.74,
            top: size * 0.3,
            width: sw,
            height: size * 0.35,
            backgroundColor: iconColor,
          }}
        />
        
        {/* Left jewel */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.18,
            top: size * 0.25,
            width: size * 0.1,
            height: size * 0.1,
            backgroundColor: iconColor,
            borderRadius: size * 0.05,
          }}
        />
        
        {/* Center jewel */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.44,
            top: size * 0.05,
            width: size * 0.11,
            height: size * 0.11,
            backgroundColor: iconColor,
            borderRadius: size * 0.055,
          }}
        />
        
        {/* Right jewel */}
        <View
          style={{
            position: 'absolute',
            left: size * 0.72,
            top: size * 0.25,
            width: size * 0.1,
            height: size * 0.1,
            backgroundColor: iconColor,
            borderRadius: size * 0.05,
          }}
        />
      </View>
    </View>
  );
};
