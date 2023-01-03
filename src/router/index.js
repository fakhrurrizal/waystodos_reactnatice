import React,{useContext, useState, useEffect} from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Login, Register,TodoList, AddCategory, AddList, DetailList, Profile} from '../screen'
import { UserContext } from '../context/UserContext';

import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

import FlashMessage from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config/api';
import Spinner from 'react-native-loading-spinner-overlay/lib';





const Router = () => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const [state, dispatch] = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true)

  async function checkAuth() {
    try {
      let token = await AsyncStorage.getItem("token");

      if (token) setAuthorization(token);

      await API.post("/auth/verify-token", {
        validateStatus: () => true,
      })
        .then((response) => {
          if (response.status >= 400) {
            return dispatch({
              type: "AUTH_ERROR",
            });
          }
          const payload = response.data;
          dispatch({
            type: "AUTH_SUCCESS",
            payload,
          });
        })
        .catch((error) => {
          dispatch({
            type: "AUTH_ERROR",
          });
        });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  const checkUser = async () => {
    await AsyncStorage.getItem("token");
    checkAuth();
  }

  useEffect(() => {
    checkUser();
  }, []);

  function MainApp() {
    return (
      <Tab.Navigator
        initialRouteName='TodoList'
        screenOptions={({ route }) => ({
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconType;
            let iconName;
            let iconColor;
            if (route.name === "TodoList") {
              iconType = "fa5";
              iconName = "clipboard-list";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }
            if (route.name === "AddList") {
              iconType = "material-icon";
              iconName = "category";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }
            if (route.name === "AddCategory") {
              iconType = "material-icon";
              iconName = "playlist-add";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }
            if (route.name === "Profile") {
              iconType = "fa5";
              iconName = "user";
              iconColor = focused ? "#FF5555" : "#D9D9D9";
            }

            return iconType == "fa5" ? (
              <FontAwesome5 name={iconName} size={size} color={iconColor} />
            ) : (
              <MaterialIcons name={iconName} size={size} color={iconColor} />
            );
          },
        })}
      >
        <Tab.Screen name="TodoList" component={TodoList} options={{ headerShown: false }} />
        <Tab.Screen name="AddCategory" component={AddCategory} options={{  headerShown: false, }} />
        <Tab.Screen name="AddList" component={AddList} options={{ headerShown: false, }} />
        <Tab.Screen name='Profile' component={Profile} />
        
      </Tab.Navigator>
    );
  }
  
  return (
    <>
      {isLoading ? (
       <Spinner visible={isLoading} textContent={"Loading ..."} /> 
      ) : state.isLogin ? (
        <Stack.Navigator >
          <Stack.Screen name='Main' component={MainApp} options={{headerShown:false}}/>
          <Stack.Screen name='DetailList' component={DetailList}/>
         
        </Stack.Navigator>
        
      ) :(
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
            <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        </Stack.Navigator>
      )}
      <FlashMessage position="top" />
    </>
  )
}

export default Router



