import { Text, View, Box, Input,Pressable } from 'native-base'
import React, { useState } from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useQuery} from "react-query"


import { showMessage } from 'react-native-flash-message';
import { API } from '../config/api';

const AddCategory = () => {

  const [dataCategory, setDataCategory] = useState({
    name: '',
  })

  function handleOnChange(name, value){
    setDataCategory({
      ...dataCategory,
      [name]:value,
    })
  }

    let { data: category, refetch: categoryRefetch } = useQuery(
      "categoryCaches",
      async () => {
        let categoryResponse = await API.get("/Category");
        return categoryResponse.data;
      }
    );
    
    const categoryColor = [
      {
        index: 0,
        bgColor: "primary.500",
      },
      {
        index: 1,
        bgColor: "purple.500",
      },
      {
        index: 2,
        bgColor: "green.500",
      },
      {
        index: 3,
        bgColor: "danger.500",
      },
      {
        index: 4,
        bgColor: "warning.500",
      },
    ];

    const handleSubmit = async () =>{
      try{
        if (dataCategory.name.trim() == ""){
          alert(error.response.data.message);
        }
        const response = await API.post("/Category", dataCategory)
        showMessage({
          message: "Category Success added!",
          type: "success"
        })
        setDataCategory({
          name:"",
        })
        categoryRefetch();
      }catch(error){
        console.log(error);
        alert("Failed Add Category");
      }
    }
  
  return (
    <View p={7} w="98%" mt="2">
      <Text  mb={10} fontWeight={900}  color="muted.700" fontSize="3xl">Add Category</Text>
      <Box>
        <Input bg="blueGray.200" p={3} fontSize="md" rounded={8} borderWidth={2} mb={5} borderColor="blueGray.400" placeholder="Name"
          value={dataCategory.name}
          onChangeText={(value) => handleOnChange("name", value)}
        />
        <Pressable bgColor="#ff5555"  p={3} rounded={4}
          onPress={handleSubmit}
        >
          <Text color="white" fontWeight={800} fontSize="md"  textAlign="center">Add Category</Text>
        </Pressable>
      </Box>
      
      <Text fontWeight={900}  color="muted.700" fontSize="3xl" mt={30}>
          List Category
        </Text>

        <Box mt={5} display="flex"flexDirection="row" flex={1} w={"100%"} flexWrap={"wrap"} >
          {category?.map((item, i) => {
            return (
              <Box rounded={6} display="flex" alignItems="center" justifyContent="center" key={i} mr={2} my={2}  px={2} h={10}
                bg={
                  categoryColor?.find(
                    (item) =>
                      item?.index === i % (categoryColor.length)
                  ).bgColor
                }
              >
                <Text 
               p={1} textAlign="center" bold color="white" >
                  {item.name}
                </Text>
              </Box>
            );
          })}
        </Box>
    </View>
  )}


export default AddCategory

