import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

const RotatingCoin = ({ size = 48 }) => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.coin,
          { width: size, height: size },
          {
            transform: [
              { rotateY: spinInterpolate },
            ],
          },
        ]}
      >
        <View style={[styles.coinFace, { width: size, height: size }]}>
          <Text style={[styles.rupeeSymbol, { fontSize: size * 0.5 }]}>₹</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    perspective: 1000,
  },
  coin: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1000,
    backgroundColor: '#FFD700',
  },
  coinFace: {
    borderRadius: 1000,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DAA520',
  },
  rupeeSymbol: {
    color: '#8B4513',
    fontWeight: '900',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default RotatingCoin;
