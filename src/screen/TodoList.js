import React, {useState,useContext, useEffect} from 'react'
import { Center, Box, Button, Text, View, Image, Stack, Input, Pressable, Modal, Select, FlatList, List } from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Headers from '../../components/header/Headers';
import {useQuery } from 'react-query';
import { API } from '../config/api';    
import ChecklistImage from "../../assets/checklist.png"
import { UserContext } from '../context/UserContext';
import Spinner from 'react-native-loading-spinner-overlay/lib';

const TodoList = ({navigation}) => {
  const [state, dispatch] = useContext(UserContext);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [dataFilter, setDataFilter] = useState({
    search: "",
    date: "",
    category: "",
    status: "",
  });

  const [tempDataFilter, setTempDataFilter] = useState({
    date: "",
    category: "",
    status: "",
  });

  const todoColor = [
    {
      index: 0,
      bgColor: "primary.200",
    },
    {
      index: 1,
      bgColor: "green.200",
    },
    {
      index: 2,
      bgColor: "danger.200",
    },
    {
      index: 3,
      bgColor: "warning.200",
    },
    {
      index: 4,
      bgColor: "purple.200",
    },
  ];

  const categoryColor = [
    {
      index: 0,
      bgColor: "danger.500",
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
      bgColor: "primary.500",
    },
    {
      index: 4,
      bgColor: "warning.500",
    },
  ];

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/list");
      
      // console.log("response list", listResponse.data);
      return listResponse.data;
    },
    // setIsLoading(false)
    
  );
  listRefetch()
  let { data: category } = useQuery("categoryCaches", async () => {
    let categoryResponse = await API.get("/Category");
    // console.log("category list", categoryResponse.data);
    return categoryResponse.data;
  });

  function cutSentence(sentence, maxCharacter) {
    return sentence.length > maxCharacter
      ? sentence.substring(0, maxCharacter) + "..."
      : sentence;
  }

  function milisToDate(milis) {
    let date = new Date(milis);
    let convertMonth = (month) => {
      switch (month) {
        case 0:
          return "Januari";
        case 1:
          return "Februari";
        case 2:
          return "Maret";
        case 3:
          return "April";
        case 4:
          return "Mei";
        case 5:
          return "Juni";
        case 6:
          return "Juli";
        case 7:
          return "Agustus";
        case 8:
          return "September";
        case 9:
          return "Oktober";
        case 10:
          return "November";
        case 11:
          return "Desember";
      }
    };
    return `${date.getDate()} ${convertMonth(
      date.getMonth()
    )} ${date.getFullYear()}`;
  }

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

  async function handleUpdateIsDone(e, id_list, current_status) {
    e.preventDefault();
    try {
      await API.patch(
        `/list/${id_list}`,
        { is_done: current_status == 0 ? 1 : 0 },
        { validateStatus: () => true }
      );
      listRefetch();
    } catch (err) {
      showMessage({
        message: "Gagal mengubah status todo!",
        type: "danger",
      });
    }
  }

  useEffect(() => {
    listRefetch();
  },[]);


//   const onChangeDate = (event, selectedDate) => {
//     const currentDate = selectedDate || date;
//     setShow(false);
//     setDate(currentDate)

//     let tempDate = new Date(currentDate)
//     let fDate = tempDate.getDate() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getFullYear()
//     setText(fDate)
// }

//   const showMode = (currentMode) => {
//     setShow(true)
//     setMode(currentMode)
//   }


  function ListComponent(item, i) {
    let listBgColor = todoColor?.find(
      (item) => item.index === i % (Object.keys(todoColor).length - 1)
    )?.bgColor;

    let categoryBgColor = categoryColor?.find(
      (item) => item.index === i % (Object.keys(categoryColor).length - 1)
    )?.bgColor;

    let categoryName = category?.find(
      (itemCategory) => itemCategory._id === item.category_id
    )?.name;
    return (
      <Pressable bg={listBgColor} w={"100%"} borderRadius={10} display="flex" flexDirection="row" px={5} py={5} key={i} my={2}
        onPress={() =>
          navigation.navigate("DetailList", {
            listId: item._id,
            listBgColor,
            categoryBgColor,
            categoryName,
          })
        }
      >
        <Box flex={2}>
          <Text fontWeight="bold" fontSize={20} textDecorationLine={item.is_done == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.name, 15)}
          </Text>
          <Text  color="muted.500"  flex={1}  textDecorationLine={item.is_done == 0 ? "none" : "line-through"}
          >
            {cutSentence(item.description, 20)}
          </Text>
          <Text color="muted.500" display="flex" alignItems="center">
            <FontAwesome name="calendar" size={15}  color="muted.500" style={{ marginRight: 5 }}
            />
            {"  "}{milisToDate(item.date)}
          </Text>
        </Box>
        <Box flex={1}>
          <Box p={1} borderRadius={7} display="flex" alignItems="center" justifyContent="center" bg={categoryBgColor}
          >
            <Text color="white" fontSize="12px" fontWeight="bold" px={1} >
              {categoryName}
            </Text>
          </Box>
          <Box flex={1} display="flex" alignItems="center" justifyContent="center"
          >
          <Button bg={item.is_done ? "white" : "muted.200"} borderRadius={100} _hover={{ backgroundColor: "muted.300" }} _pressed={{ backgroundColor: "muted.400" }} mt={2} w={50} h={50}
              onPress={(e) => handleUpdateIsDone(e, item._id, item.is_done)}
            >
              {item.is_done ? (
                <Image source={ChecklistImage} w={50} h={50} resizeMode="contain" alt="ChecklistImage"
                />
              ) : (
                <></>
              )}
            </Button>
          </Box>
        </Box>
      </Pressable>
     
    );
  }

  function handleChangeTextFilter(name, value) {

    setDataFilter({
      ...dataFilter,
      [name]: value,
    });
    // console.log("current data filter", dataFilter);
  }


  function handleChangeTextTempFilter(name, value) {
    setTempDataFilter({
      ...tempDataFilter,
      [name]: value,
    });
  }

  return (
    <View p={7} className="top" flex={1}>
      <Headers />
      <Stack mt={5}>
        <Input bg="blueGray.200" rounded={8} borderWidth={2} mb={3} borderColor="blueGray.400" placeholder="Search List ..."
          value={dataFilter.search}
          onChangeText={(value) => handleChangeTextFilter("search", value)}
        />
        
        <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row" w={"100%"}>
        </Box>
        <Box display="flex" flexDirection="column" w={"100%"}>
          <Button
            onPress={() => setShowModalFilter(true)}
            my={3}
            bg="error.500"
            _hover={{ backgroundColor: "error.600" }}
            _pressed={{ backgroundColor: "error.700" }}
          >
            <Text fontSize={15} fontWeight="bold" color="white" display="flex" flexDirection="row" justifyContent="center" alignItems="center"
            >
              <AntDesign name="filter" size={20} color="white" /> Filter
            </Text>
          </Button>
          <Center>
            <Modal
              isOpen={showModalFilter}
              onClose={() => {
                setTempDataFilter({
                  ...tempDataFilter,
                  category: "",
                  status: "",
                });
                setShowModalFilter(false);
              }}
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Filter</Modal.Header>
                <Modal.Body display="flex" flexDirection="column" w={"100%"}>
                  <Select  defaultValue={dataFilter.category}  placeholder="Category"  h={50}  mt={2}  py={3}  flex={1}  bg="muted.200"  fontSize={15}  borderRadius="sm"  borderColor="muted.500"  _selectedItem={{    bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("category", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    {category?.map((item, i) => (
                      <Select.Item label={item.name} value={item._id} key={i} />
                    ))}
                  </Select>
                  <Select defaultValue={dataFilter.status} placeholder="Status" h={50} bg="muted.200" py={3} mt={2} flex={1} fontSize={15} borderRadius="sm" borderColor="muted.500" _selectedItem={{  bg: "muted.500",
                    }}
                    onValueChange={(value) =>
                      handleChangeTextTempFilter("status", value)
                    }
                  >
                    <Select.Item label={"Semua"} value={""} />
                    <Select.Item label={"Belum"} value={"0"} />
                    <Select.Item label={"Selesai"} value={"1"} />
                  </Select>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button  variant="ghost"  colorScheme="blueGray"
                      onPress={() => {
                        setTempDataFilter({
                          ...tempDataFilter,
                          category: "",
                          status: "",
                        });
                        setShowModalFilter(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        setDataFilter({
                          ...dataFilter,
                          date: tempDataFilter.date,
                          category: tempDataFilter.category,
                          status: tempDataFilter.status,
                        });
                        setTempDataFilter({
                          ...tempDataFilter,
                          category: "",
                          status: "",
                        });
                        setShowModalFilter(false);
                      }}
                    >
                      Save
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          </Center>
        </Box>
      </Box>
        {/* <HStack justifyContent="space-between">
            <Pressable w="104px" p="2.5" title='DatePicker' onPress={() => showMode('date')} bg="blueGray.200"  borderRadius={8} borderWidth={1} borderColor="blueGray.400" mb="3" width="100px">
              <HStack justifyContent="center">
                <Text fontSize="xs" mt="0.5"  color="blueGray.400">{text}{"  "}</Text>
                <Text color="blueGray.400" mt="0.5"><Ionicons name="calendar-outline" /></Text>
              </HStack>
            </Pressable>
            <Select bg="blueGray.200" borderRadius={8} borderWidth={1} borderColor="blueGray.400" mb="5px" w="103px" placeholder='Category' fontSize="xs" accessibilityLabel='Category' _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={5} />,
              }}
            >
              <Select.Item label="Study" value="Study" />
              <Select.Item label="Home Work" value="Home Work" />
              <Select.Item label="Work Out" value="Work Out" />
                  
            </Select>
            <Select w="87px" bg="blueGray.200" borderRadius={8} borderWidth={1} borderColor="blueGray.400" mb="5px" placeholder='Status' accessibilityLabel='Status' _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={5} />,
              }}
            >
              <Select.Item label="Todo" value="todo" />
              <Select.Item label="Done" value="done" />

            </Select>
        </HStack> */}
      </Stack>
      
      {/* {show && (<DateTimePicker
        testID='dateTimePicker'
        value={date}
        mode={mode}
        is24Hours={true}
        display='default'
        onChange={onChangeDate}
      />)} */}
      <Stack  display="flex" flex={1} >
      {list ? (
          <FlatList
            data={

              !dataFilter.search &&
              !dataFilter.category &&
              !dataFilter.date &&
              !dataFilter.status
                ? list
                : list.filter((item) => {

                    if (dataFilter.search) {
                      return item.name
                        .toLowerCase()
                        .includes(dataFilter.search.toLowerCase());
                    }


                    if (dataFilter.date) {
                      const itemDate = milisToDate(item.date).split(" ")[0];
                      const filterDate = milisToDate(
                        parseInt(dataFilter.date)
                      ).split(" ")[0];
                      return itemDate == filterDate;
                    }

        
                    if (dataFilter.category) {
                      let categoryId = category.find(
                        (itemCategory) => itemCategory._id === item.category_id
                      )._id;
                      return (
                        categoryId.toString() == dataFilter.category.toString()
                      );
                    }

                    if (dataFilter.status) {
                      return (
                        item.is_done.toString() == dataFilter.status.toString()
                      );
                    }
                  })
            }
            renderItem={({ item, index }) => ListComponent(item, index)}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <></>
        )}
      </Stack>
    </View>
  )
}

export default TodoList
