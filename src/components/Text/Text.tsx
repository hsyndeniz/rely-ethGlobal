/* eslint-disable react/require-default-props */
import React from 'react';
import { View, Text, StyleProp, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks';

interface HeaderProps {
  title: string;
  subtitle?: string;
  style?: StyleProp<any>;
  textShadow?: boolean;
}
const Header = ({ title, subtitle, style, textShadow }: HeaderProps) => {
  const { Fonts, Gutters, Common } = useTheme();

  return (
    <View style={[Gutters.xlargeVPadding, Common.zIndex, style]}>
      <Text
        style={[Gutters.smallVPadding, Fonts.textCenter, Fonts.titleRegular, textShadow && styles.shadow]}>
        {title}
      </Text>
      <Text
        style={[Gutters.xxlargeHPadding, Fonts.textCenter, Fonts.titleSmall, textShadow && styles.shadow]}>
        {subtitle}
      </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    zIndex: 1,
  },
});
