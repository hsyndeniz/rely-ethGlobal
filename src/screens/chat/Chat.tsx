import React, { useState, useCallback, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { MainStackParamList } from 'types/navigation';
import { chatHistory } from '@/services/push';
import { useWallet } from '@/utils/wallet';
import { useTheme } from '@/hooks';
import makeBlockie from 'ethereum-blockies-base64';

type Props = NativeStackScreenProps<MainStackParamList, 'chat'>;

const Chat = ({ route }: Props) => {
  const wallet = useWallet();
  const { Colors, Gutters } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: route.params.chat.msg.messageObj?.content,
        createdAt: new Date(route.params.chat.intentTimestamp),
        user: {
          _id: 2,
          name: route.params.chat.name || '',
          avatar: route.params.chat.profilePicture,
        },
      },
    ]);
    console.log('route.params.chat', route.params.chat.combinedDID);
    chatHistory(wallet, route.params.chat.did).then((history: any) => {
      console.log('success');
      console.log(history);
      const _messages = history.map((message: any) => {
        const abbreviatedDID = `${message.fromDID.split(':')[1].substring(0, 4)}...${message.fromDID
          .split(':')[1]
          .substring(38, 42)}`;
        return {
          _id: message.messageContent.toLowerCase(),
          text: message.messageObj?.content,
          createdAt: new Date(message.timestamp),
          user: {
            _id: message.fromDID.toLowerCase(),
            name: abbreviatedDID,
            avatar: makeBlockie(message.fromDID.split(':')[1]),
          },
        };
      });
      setMessages(_messages);
    });
  }, []);

  const onSend = useCallback((_messages: any = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, _messages));
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={_messages => onSend(_messages)}
      messagesContainerStyle={{ backgroundColor: Colors.ui_01, ...Gutters.smallBPadding }}
      renderInputToolbar={props => (
        <InputToolbar
          {...props}
          containerStyle={{ backgroundColor: Colors.inputBackground, ...Gutters.smallTPadding }}
        />
      )}
      alwaysShowSend
      showUserAvatar
      user={{
        _id: `eip155:${wallet?.address}`.toLocaleLowerCase(),
      }}
    />
  );
};

export default Chat;
