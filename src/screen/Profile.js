import React, {useContext} from 'react'
import { Center, Avatar, Text, HStack, Pressable } from 'native-base'
import { UserContext } from '../context/UserContext'
import { SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";

const Profile = () => {
  const [state,dispatch] = useContext(UserContext)

  function handleLogout() {
    AsyncStorage.removeItem("token");
    dispatch({
      type: "LOGOUT_SUCCESS",
    });
    showMessage({
      message: "Logout success!",
      type: "success",
    });
  }

  return (
    <Center p={10}>
       <Avatar bg="amber.500" source={{
          uri: "https://fahmiad.com/wp-content/uploads/2022/01/foto-profil-wa-gabut3.jpg"
          }} size="2xl">
        NB
        <Avatar.Badge bg="green.500" />
      </Avatar>
      <Text bold mt={3} fontSize="2xl">  
        Hi, { state?.data?.user?.firstName }
      </Text>
        <Pressable mt={10} p={3}  rounded={5}  bgColor="#ff5555" onPress={handleLogout} >
          {/* <SimpleLineIcons  name="logout" marginLeft="10px"  size={20} color="white" /> */}
          <Text  fontWeight="800" color="white" fontSize="md">
            Logout
          </Text>
        </Pressable>
    </Center>
  )
}

export default Profile

