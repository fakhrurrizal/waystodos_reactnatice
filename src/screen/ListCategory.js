import {  FlatList, HStack, Pressable, ScrollView, Text, View } from 'native-base'
import React from 'react'

const ListCategory = () => {
  return (
    <View mt={12} mb={3}>
        <Text  fontWeight={900} color="muted.700" fontSize="3xl">List Category</Text>
        <ScrollView horizontal>
            <FlatList 
            
            />    
        </ScrollView>
    </View>

    // <View mt={12} mb={3}>
    //    <Text  fontWeight={900} color="muted.700" fontSize="3xl">List Category</Text>
    //    <HStack mt={3}>
    //         <Pressable rounded={5} marginRight={3} px={1}  bgColor="info.300">
    //             <Text  p={1} textAlign="center" bold color="white">Study</Text>
    //         </Pressable>
    //         <Pressable rounded={5} w="auto" px={1} marginRight={3} bgColor="#ff5555">
    //             <Text  p={1} textAlign="center" bold color="white">Home Work</Text>
    //         </Pressable>
    //         <Pressable rounded={5} w="auto" px={1} marginRight={3} bgColor="#FFB681">
    //             <Text  p={1} textAlign="center" bold color="white">Workout</Text>
    //         </Pressable>
            
    //    </HStack>
    // </View>
  )
}

export default ListCategory
