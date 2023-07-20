// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import {registerRootComponent} from 'expo';

// import React, {useEffect} from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {Colors} from 'react-native/Libraries/NewAppScreen';
// import findLocation from './functions/currentLocation';
// import Constants from 'expo-constants';
// // console.log(Constants.systemFonts);
// export default function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   useEffect(() => {
//     console.log('Hello Piruthuviraj');
//     (async () => {
//       let n = await findLocation();
//       console.log(n);
//     })();
//   }, []);

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       {/* Center the text*/}
//       <View
//         style={{
//           height: '100%',
//           width: '100%',
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <Text>Hello Piruthuviraj</Text>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// registerRootComponent(App);
