/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {registerComponent} from 'expo';
import App from './App';
import {name as appName} from './app.json';
// registerComponent(App);
AppRegistry.registerComponent(appName, () => App);
