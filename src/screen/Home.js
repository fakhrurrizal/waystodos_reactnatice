import { StyleSheet,Image } from 'react-native'
import React from 'react'
import { Center,Pressable,View, Text } from 'native-base'
import { Logo, } from "../../assets"

const Home = ({navigation}) => {
  return (
   <Center flex={1} >
        <Image source={Logo} style={styles.Logo}/>  
        <Text fontWeight={900} fontSize="4xl" mb={10} >
          Ways{" "}
          <Text color="#B82020" fontWeight={900}>To
            <Text color="#FF5555" fontWeight={900}>Do</Text>
          </Text>
        </Text>
        <View  pr={30} pl={30} >
         <Text style={{ textAlign:"center" }}>Write your activity and finish your activity. Fast, Simple and Easy to Use</Text>
        </View>
        <Pressable style={styles.Login} onPress={() => navigation.navigate("Login")} >
          <Text style={styles.Text}>Login</Text>
        </Pressable>

        <Pressable style={styles.Register}  onPress={() => navigation.navigate("Register")}>
          <Text style={styles.Text}>Register</Text>
        </Pressable>
        
   </Center>
  )
}

export default Home

const styles = StyleSheet.create({
  Logo : {
    width:228,
    height:258,
    margin:"auto"
  },
  company : {
    marginTop :10,
    marginBottom: 20,
  },

  Login: {
    backgroundColor: "#FF5555",
    marginTop: 100,
    height: 50,
    width: 300,
    borderRadius: 4,
    padding: 10,
  },

  Register: {
    backgroundColor: "#b0b0b0",
    marginTop: 15,
    height: 50,
    width: 300,
    borderRadius: 4,
    padding: 10,
  },

  Text : {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
  
})