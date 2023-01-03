import { StyleSheet,  Image,  } from 'react-native'
import {  Center, Box, Stack, Text, Input, Pressable } from 'native-base'
import React, { useState, useContext } from 'react'
import { Auth } from '../../assets'
import { showMessage } from "react-native-flash-message";
import { API, setAuthorization } from '../config/api'
import { UserContext } from '../context/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Login = ({navigation}) => {
  const [state, dispatch] = useContext(UserContext);
  const [form, setForm] = useState({
    email: '',
    password: ''
})

function handleOnChange(name, value) {
    setForm({
        ...form,
        [name]: value
    })
}

const handleLogin = async () => {
    try {
      if (form.email.trim() == "" || form.email.trim() == null) {
        return alert("List Email must be failed!")
        
      } 
      if (form.password.trim() == "" || form.password.trim() == null) {
        return alert("List Password must be failed!")
        
      }
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify(form);
        const response = await API.post(
            "/auth/login",
            body,
            config
        );

        AsyncStorage.setItem("token", response.data.token);
        const payload = response.data;
        showMessage({
          message: "Login Success!",
          type: "success",
        });
        dispatch({
          type: "LOGIN_SUCCESS",
          payload,
        });

        setAuthorization(response.data.token);
        navigation.navigate("TodoList");
    } catch (error) {
        console.log(error);
        alert("Password/Email Incorrect ");
    }
  }
  return (
    <Box behavior='padding' p={30}>
        <Center mt={50}>
            <Image source={Auth} />
            <Text fontSize="3xl" mt={10} fontWeight={900} mb={5} textAlign="left" >Login</Text>
            <Stack space={4} w="100%" mx="auto" alignItems="center">
                <Input type='email'  variant="outline"  bgColor="#e5e5e5" placeholder="Email" w="100%" 
                  name="email"
                  value={form.email}
                  onChangeText={(value) => handleOnChange('email', value)}
                  isRequired
                />
                <Input type='password' variant="outline"  bgColor="#e5e5e5" placeholder="Password" w="100%" 
                  name="password"
                  value={form.password}
                  onChangeText={(value) => handleOnChange('password', value)}
                  secureTextEntry
                  isRequired
                />
                <Pressable  bgColor="#ff5555"  width="100%" mt={10} rounded={3} p={3} onPress={handleLogin}>
                    <Text  textAlign="center" color="white" fontWeight="extrabold">Login</Text>
                </Pressable>
                <Text fontWeight="bold">New Users?{" "}
                  <Text color="#ff5555" onPress={()=> navigation.navigate("Register")}>Register</Text>
                </Text>
            </Stack>
        </Center>
    </Box>
  )
}

export default Login

