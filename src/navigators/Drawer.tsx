import React from 'react';
import { Image, Text, View } from 'react-native';
import makeBlockie from 'ethereum-blockies-base64';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainNavigator, SetupNavigator } from '@/navigators';
import { DrawerParamList } from 'types/navigation';
import { useTheme } from '@/hooks';
import { Header } from '@/components';
import { screens } from '@/screens';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const { Colors } = useTheme();

  return (
    <Drawer.Navigator
      initialRouteName="startup"
      // eslint-disable-next-line react/no-unstable-nested-components
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: '75%',
          backgroundColor: Colors.background,
        },
      }}>
      <Drawer.Screen
        name="startup"
        component={screens.startup}
        options={{ headerShown: false, swipeEnabled: false }}
      />
      <Drawer.Screen
        name="main"
        component={MainNavigator}
        options={{ headerShown: false, swipeEnabled: true }}
      />
      <Drawer.Screen
        name="setup"
        component={SetupNavigator}
        options={{ headerShown: false, swipeEnabled: false }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const DrawerContent = React.memo(({ navigation }: any) => {
  const { Colors, Common, Fonts, Gutters, Layout } = useTheme();

  const onPress = () => {
    navigation.closeDrawer();
  };

  return (
    <View style={[Layout.fill, { backgroundColor: Colors.background }]}>
      <LinearGradient
        useAngle={true}
        angle={45}
        start={{ x: 0, y: 0 }} // Start at top-left
        end={{ x: 0, y: 1 }} // End at bottom
        // start={{ x: 0, y: 0 }} // Start at top-left
        // end={{ x: 1, y: 1 }} // End at bottom-right
        // style={StyleSheet.absoluteFill}
        // colors={['#D300B5', '#FF5400']}
        // colors={['#1565C0', '#b92b27']}
        // colors={['#4158D0', '#C850C0', '#FFCC70']}
        // colors={['#0088CC', '#00C08B']} // solana
        // colors={['#0F4B6E', '#6A0572']} // eth
        colors={['#480048', '#C04848']}
        style={[Layout.fullWidth, Gutters.xxxlargeVPadding]}>
        <Image style={[Common.largeAvatar]} source={{ uri: makeBlockie('0x0') }} />
        <Header title="0x0" subtitle="0x0" />
      </LinearGradient>
      <TouchableOpacity onPress={onPress}>
        <Text style={Fonts.textRegular}>Close</Text>
      </TouchableOpacity>
    </View>
  );
});
