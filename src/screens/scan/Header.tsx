import React from 'react';
import { Platform } from 'react-native';
import { CameraPosition } from 'react-native-vision-camera';
import { MenuView } from '@react-native-menu/menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  Item,
  HeaderButton,
  HeaderButtons,
  HeaderButtonsComponentType,
  defaultRenderVisibleButton,
} from 'react-navigation-header-buttons';

type HeaderProps = { cameraPosition: CameraPosition; setCameraPosition: (position: CameraPosition) => void };

const Header = ({ cameraPosition, setCameraPosition }: HeaderProps) => {
  return (
    <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
      <MenuView
        onPressAction={({ nativeEvent: { event } }) => {
          console.log(JSON.stringify(event, null, 2));
          if (event === 'switch-camera') {
            console.log(cameraPosition);
            setCameraPosition(cameraPosition === 'back' ? 'front' : 'back');
          } else if (event === 'external-camera') {
            setCameraPosition('external');
          }
        }}
        actions={[
          {
            id: 'switch-camera',
            title: `Use ${cameraPosition === 'back' ? 'Front' : 'Back'} Camera`,
            titleColor: '#2367A2',
            image: Platform.select({
              ios: 'camera',
              android: 'ic_camera_alt_white_24dp',
            }),
            imageColor: '#2367A2',
          },
          {
            id: 'external-camera',
            title: 'Use External Camera',
            titleColor: '#2367A2',
            image: Platform.select({
              ios: 'camera',
              android: 'ic_camera_alt_white_24dp',
            }),
            imageColor: '#2367A2',
          },
        ]}>
        <Item title="more" iconName="more-vert" iconSize={24} />
      </MenuView>
    </HeaderButtons>
  );
};

const MaterialHeaderButton: HeaderButtonsComponentType = props => {
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  return (
    <HeaderButton
      // the usual way to render:
      // IconComponent={MaterialIcons}
      // iconSize={24}
      // you can customize the colors, by default colors from React navigation theme will be used
      // pressColor="blue"
      {...props}
      // alternative way to customize what is rendered:
      renderButton={itemProps => {
        // access anything that was defined on <Item ... />
        const { color, iconName } = itemProps;

        return iconName ? (
          <MaterialIcons name={iconName} color={color} size={24} />
        ) : (
          // will render text with default styles
          defaultRenderVisibleButton(itemProps)
        );
      }}
    />
  );
};

export default Header;
