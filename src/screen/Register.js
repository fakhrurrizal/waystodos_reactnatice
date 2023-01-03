import { StyleSheet,  Image, } from 'react-native'
import { Center, Box, Stack, Text, Input, Pressable } from 'native-base'
import React, {useState } from 'react'
import { Auth } from '../../assets'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { API } from '../config/api'
import { useMutation } from 'react-query'

const Register = ({navigation}) => {

  const [form, setForm] = useState({
    firstName: '',
    email: '',
    password: '',
  })

  const handleOnChange = (name, value) =>{
    setForm({
      ...form,
      [name]:value,
    })
  }

  const handleRegister = useMutation(async (e) => {
    try {

      // if (form.email.trim() == "" || form.email.trim() == null) {
      //   return alert("List Email must be failed!")  
      // } 
      // if (form.firstName.trim() == "" || formfirstName.trim() == null) {
      //   return alert("List Name must be failed!")
      // } 
      // if (form.password.trim() == "" || form.password.trim() == null) {
      //   return alert("List Password must be failed!")
        
      // } 

      e.preventDefault()
      const config = {
        headers : {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form)
      const response = await API.post('/auth/register',body, config)
      console.log(response)

      if (response){
        await AsyncStorage.setItem('token', response.data.token)
      }

      const value = await AsyncStorage.getItem('token')
      if (value !== null){
        console.log(value)
      }
      alert('Registration Success')
      navigation.navigate("Login")

    }catch (e){
      console.log(e)
      alert('Registration Failed')
    }
  })

  return (
    <Box behavior='padding' p={30}>
        <Center mt={50}>
            <Image source={Auth} />
            <Text fontSize="3xl" mt={10} fontWeight={900} mb={5} textAlign="left" >Register</Text>
            <Stack space={4} w="100%" mx="auto" alignItems="center">
                <Input type='email'  variant="outline"  bgColor="#e5e5e5" placeholder="Email" w="100%"
                  name="email" 
                  value={form?.email}
                  onChangeText={(value) => handleOnChange('email', value)}
                  isRequired
                />
                <Input type='text' variant="outline"  bgColor="#e5e5e5" placeholder="Name" w="100%" 
                  name="fistName" 
                  value={form?.firstName}
                  onChangeText={(value) => handleOnChange('firstName', value)}
                  isRequired
                />
                <Input type='password' variant="outline"  bgColor="#e5e5e5" placeholder="Password" w="100%" 
                  name="password"
                  value={form?.password}
                  onChangeText={(value) => handleOnChange('password', value)}
                  isRequired
                />
                <Pressable  bgColor="#ff5555"  width="100%" mt={10} rounded={3} p={3} onPress={(e) => handleRegister.mutate(e)}>
                    <Text  textAlign="center" color="white" fontWeight="extrabold">Register</Text>
                </Pressable>
                <Text fontWeight="bold">Joined Us Before?{" "}
                  <Text color="#ff5555" onPress={()=> navigation.navigate("Login")}>Login</Text>
                </Text>
            </Stack>
        </Center>
    </Box>
  )
}

export default Register

const styles = StyleSheet.create({
   title: {
    
   }
})

