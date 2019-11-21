import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import TimeslotScreen from './screens/TimeslotScreen';
import Listviews  from './components/Listviews';

const MainNavigator = createStackNavigator({
  Timeslot: {screen: TimeslotScreen},
  Listviews: {screen: Listviews}
},{
    initialRouteName: 'Listviews'
  });

const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;
