import React from 'react';
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Login from './Login';
import SignUp from './SignUp';
import ForgotPassword from './ForgotPassword';
import Main from './Main';
import AddList from './AddListing';
import SearchListingFilters from './SearchListingFilters';
import ListingInfo from './ListingInfo';
import EditListing from './EditListing';
import FavoriteListings from './FavoriteListings';
import MessageBox from './MessageBox';
import ProfilePage from './ProfilePage';
import Settings from './Settings';
import DeleteAccount from './DeleteAccount';
import LogOut from './Logout';
import CompareListings from './CompareListings'
import Support from './Support'

import Notification from './Notification';

console.disableYellowBox = true;

const HomeStack = createStackNavigator(
    {
        Main: {
            screen: Main,
        },
        AddList: {
            screen: AddList,
        },
        SearchListingFilters: {
            screen: SearchListingFilters,
        },
        ListingInfo: {
            screen: ListingInfo,
        },
        EditListing: {
            screen: EditListing,
        },
        MessageBox: {
            screen: MessageBox,
        },
    },
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        },
    },
);

const SettingsStack = createStackNavigator(
    {
        Settings: {
            screen: Settings,
        },
        ProfilePage: {
            screen: ProfilePage,
        },
        DeleteAccount: {
            screen: DeleteAccount,
        },
        Support: {
            screen: Support,
        },
        LogOut: {
            screen: LogOut,
        },
    },
    {
        headerMode: 'none',
        navigationOptions: {
            header: null,
        },
    },
);

const TabNavigator = createBottomTabNavigator(
    {
        Favorite: {
            screen: FavoriteListings,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => <Icon name="star" size={25} type="entypo" color={tintColor}/>,
            },
        },
        Home: {
            screen: HomeStack,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => <Icon name="home" size={25} type="entypo" color={tintColor}/>,
            },
        },
        Compare: {
            screen: CompareListings,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => <Icon name="compare" size={25} type="MaterialCommunityIcons" color={tintColor}/>,
            },
        },
        Settings: {
            screen: SettingsStack,
            navigationOptions: {
                tabBarIcon: ({ tintColor }) => <Icon name="setting" type="antdesign" size={25} color={tintColor} />
            }
        },
        Notifications: {
            screen: Notification,
            navigationOptions: {
            tabBarIcon: ({ tintColor }) => <Icon name="notification" type="antdesign" size={25} color={tintColor} />
            }
        }
    },
    {
        initialRouteName: 'Home'
    }
);

const MainStack = createStackNavigator(
    {
        Login: {
            screen: Login,
        },
        ForgotPassword: {
            screen: ForgotPassword,
        },
        SignUp: {
            screen: SignUp,
        },
        Main: {
            screen: TabNavigator
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    },
);

export default createAppContainer(MainStack);