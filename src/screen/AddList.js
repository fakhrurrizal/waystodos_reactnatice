import { Text, View, Box, Input, Select, CheckIcon, Pressable, HStack, TextArea } from 'native-base'
import React, { useState, useEffect } from 'react'
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage } from "react-native-flash-message";
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import { Alert } from 'react-native';

const AddCategory = ({navigation}) => {
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [text, setText] = useState('Choose Date')

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate)

    let tempDate = new Date(currentDate)
    let fDate = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear()
    setText(fDate)
}

  const showMode = (currentMode) => {
    setShow(true)
    setMode(currentMode)
  }

  const [dataList, setDataList] = useState({
    name: "",
    date: "",
    description: "",
    category_id: "",
    is_done: 0, 
  })

  let { data: category, refetch } = useQuery (
    "categoryCaches", async () => {
      let categoryResponse = await API.get("/Category");
      return categoryResponse.data;
    }
  )

  function handleOnChange( name, value ){
    setDataList({
      ...dataList,
      [name]: value,
    })
  }

  const handleSubmit = useMutation(async (e) => {

    try {
      if (dataList.name.trim() == "" || dataList.name.trim() == null) {
        return alert("List name must be failed!")
        
      }
      
      if (dataList.description == "" || dataList.description == null) {
        return alert("List description must be failed!")
      }
      
      const form = {
        name: dataList.name,
        date: date,
        category_id: dataList.category_id,
        description: dataList.description,
        is_done: 0, 
      };
      const response = await API.post("/list", form);
      showMessage({
        message: "Success to add list",
        type: "success",  
      });
      setDataList({
        name: "",
        date: "",
        description: "",
        category_id: "",
        is_done: 0,  
      });
      refetch();
      navigation.navigate("TodoList")
    } catch (error) {
      console.log(error);
      alert("Failed to add List!")
    }
  })

  return (
    <View p={7} mt="1.5">
      <Text mb="20px" fontWeight={900}  color="muted.600"  fontSize="3xl">Add List</Text>
      <Box>
        <Input bg="blueGray.200" p={3} fontSize="md" rounded={8} borderWidth={2} mb={5} borderColor="blueGray.400" placeholder="Name"
          value={dataList.name}
          onChangeText={(value) => handleOnChange("name", value)}
        />
        <Select bg="blueGray.200" rounded={8} borderWidth={2} p={3} fontSize="md" mb={3} borderColor="blueGray.400"  placeholder='Select Category' accessibilityLabel='Category' _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size={5} />,
          }}
          defaultValue={dataList.category_id}
          onValueChange={(value) => handleOnChange("category_id", value)}
        >
          {category?.map((item, i) => (
              <Select.Item label={item.name} value={item._id} key={i} />
          ))}
        </Select>
        <Pressable p={3} title='DatePicker' onPress={() => showMode('date')} bg="blueGray.200"  rounded={5} borderWidth={2} borderColor="blueGray.400" mb="5" >
          <HStack justifyContent="space-between">
            <Text fontSize="md" color="blueGray.400">{text}{"  "}</Text>
            <Text color="blueGray.400" fontSize="md"  ><Ionicons name="calendar-outline" /></Text>
          </HStack>
        </Pressable>
        <TextArea h={20} placeholder="Description"  fontSize="md" bg="blueGray.200" rounded={8} borderWidth={2} borderColor="blueGray.400"
          value={dataList.description}
          onChangeText={(value) => handleOnChange("description", value)}
        />
        <Pressable bgColor="#ff5555" mt={10} p={3} rounded={4}  onPress={(e) => handleSubmit.mutate(e)} >
          <Text color="white" fontWeight={800} fontSize="md" textAlign="center">Add List</Text>
        </Pressable>
      </Box>
      {show && (<DateTimePicker
        testId="dateTimePicker"
        value={date}
        mode={mode}
        is24Hours={true}
        display='default'
        onChange={onChangeDate}
      />)}
    </View>
  )
}

export default AddCategory

