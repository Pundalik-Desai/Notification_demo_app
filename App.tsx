import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { requestNotificationPermission } from './src/utils/notificationPermission';
import notifee from '@notifee/react-native';

// 🔹 Modular Firebase imports
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,

  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';

const App = () => {
  const app = getApp(); // default Firebase app
  const messagingInstance = getMessaging(app);

  useEffect(() => {
    const init = async () => {
      await requestNotificationPermission();
      await generateFCMToken();
    };

    init();
  },);

  // useEffect(() => {
  //   // 🔹 Foreground message listener
  //   const unsubscribe = onMessage(messagingInstance, async remoteMessage => {
  //     console.log('Foreground message:', remoteMessage);

  //     Alert.alert(
  //       remoteMessage.notification?.title || 'New Message',
  //       remoteMessage.notification?.body || 'You received a notification'
  //     );
  //   });

  //   return unsubscribe;
  // }, [messagingInstance]);


   useEffect(() => {
    // Listen for messages when app is in foreground
    const unsubscribe = getMessaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM message:', remoteMessage);

      // Show notification using Notifee
      await displayNotification(
        remoteMessage.notification?.title,
        remoteMessage.notification?.body
      );
    });

    return unsubscribe;
  }, []);

  // Display notification function
  const displayNotification = async (title, body) => {
    // Android channel (required)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display notification
    await notifee.displayNotification({
      title: title || 'New Notification',
      body: body || 'You received a message',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  // 🔹 Generate FCM Token (Modular API)
  const generateFCMToken = async () => {
    try {
      await registerDeviceForRemoteMessages(messagingInstance);

      const token = await getToken(messagingInstance);
      console.log('FCM Token:', token);

      return token;
    } catch (error) {
      console.log('Error generating FCM token:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Push Notification Demo App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

















































































// import React, { useEffect } from 'react';
// import { View, Text, StyleSheet,Alert } from 'react-native';
// import { requestNotificationPermission } from './src/utils/notificationPermission';
// import messaging from '@react-native-firebase/messaging';

// const App = () => {

//   useEffect(() => {
//     requestNotificationPermission();
//     generateFCMToken();

//   }, [])

//   useEffect(() => {
//     // Listener when app is OPEN
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground message:', remoteMessage);

//       Alert.alert(
//         remoteMessage.notification?.title || 'New Message',
//         remoteMessage.notification?.body || 'You received a notification'
//       );
//     });

//     return unsubscribe;
//   }, []);

 
  
//   //Create a basic function to generate token
//   const generateFCMToken = async () => {
//   try {
//     // Register device for remote messages
//     await messaging().registerDeviceForRemoteMessages();

//     // Get the token
//     const token = await messaging().getToken();

//     console.log('FCM Token:', token);
//     return token;
//   } catch (error) {
//     console.log('Error generating FCM token:', error);
//   }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Text>Push Notification Demo App</Text>
//     </View>
//   );



// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;
