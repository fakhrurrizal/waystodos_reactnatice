import { HStack, VStack, Text,  Image, Pressable, Avatar } from 'native-base'
import React, { useContext } from 'react'
import { useQuery } from 'react-query'
import { API } from '../../src/config/api'
import { UserContext } from '../../src/context/UserContext'

const Headers = ({listCount,navigation}) => {
    const [state,dispatch] = useContext(UserContext)

    let { data:listData, refetch } = useQuery(
        "listChaces",
        async () => {
            let listResponse = await API.get("/list")
            return listResponse.data;
        }
    )
    refetch()
    let count = 0
    listCount ? count = listCount.length : listData?.length > 0 ? count = listData?.length : null
  return (
    <HStack mb={3} mt={3} justifyContent="space-between">
    <VStack>
      <Text bold fontSize="xl" >Hi, { state?.data?.user?.firstName }</Text>
      <Text  color="#FF5555">{count} List{count > 1 ? "s" :null}</Text>
    </VStack>
  <Pressable bg="transparent" >
    <Avatar source={{uri: "https://fahmiad.com/wp-content/uploads/2022/01/foto-profil-wa-gabut3.jpg"}} rounded={100} width="12" height="12" border  borderWidth={2} borderColor="#FF5555" >
      <Avatar.Badge bg="green.500" />
    </Avatar>
  </Pressable>    
  </HStack>
  )
}

export default Headers