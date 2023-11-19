import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '@/hooks';

export default function Explore() {
  const { Common, Colors, Images, Fonts, Gutters, Layout } = useTheme();

  return (
    <View style={[Layout.fill, Layout.center]}>
      <Text style={Fonts.titleSmall}>Explore</Text>
    </View>
  );
}
