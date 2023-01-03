import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {useEffect, useContext} from 'react'
import { UserContext } from '../src/context/UserContext'
import { showMessage } from "react-native-flash-message";

function Logout({navigation}) {
    const [state, dispatch] = useContext(UserContext);
    AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT_SUCCESS",
    });
    showMessage({
      message: "Logout success!",
      type: "success",
    });
    navigation.navigate("Login")
  }

export default Logout
