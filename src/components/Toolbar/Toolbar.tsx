/* eslint-disable react/require-default-props */
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { device } from '@/utils/device';
import { useTheme } from '@/hooks';

type Props = {
  hint: string;
  disabled: boolean;
  loading?: boolean;
  keyboardAvoidingView?: boolean;
  navigate: () => void;
};
const Toolbar = ({ hint, disabled, loading, keyboardAvoidingView, navigate }: Props) => {
  const { t } = useTranslation();
  const { Colors, Fonts, Gutters, Layout } = useTheme();

  return (
    <View
      style={[
        styles.container,
        // eslint-disable-next-line react-native/no-inline-styles
        { maxHeight: !keyboardAvoidingView ? 89 : 104, bottom: device.isIos() ? 0 : 52 },
      ]}>
      <View style={[Layout.center]}>
        <Text style={[Fonts.titleXSmall, Gutters.largePadding]}>{hint}</Text>
      </View>

      <View style={[styles.toolbar, { borderTopColor: Colors.border_01 }]}>
        <View style={styles.button}>
          <TouchableOpacity disabled={disabled} style={Layout.rowCenter} onPress={navigate}>
            {loading ? (
              <ActivityIndicator size="small" color={Colors.text_02} style={Gutters.xxlargeRMargin} />
            ) : (
              <>
                <Text style={[Fonts.titleSmall, { color: !disabled ? Colors.text_04 : Colors.text_02 }]}>
                  {t('common:next')}
                </Text>
                <Feather
                  name="chevron-right"
                  size={20}
                  style={[Fonts.textCenter, Gutters.xxsmallPadding]}
                  color={!disabled ? Colors.text_04 : Colors.text_02}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Toolbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 104,
    maxHeight: 104,
    width: '100%',
  },
  toolbar: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
    width: '100%',
    flexDirection: 'column', // can be row
    justifyContent: 'space-between', // center if one element
    borderTopWidth: 1,
    height: 52, // 60 for big one
    maxHeight: 52,
    minHeight: 52,
  },
  button: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
