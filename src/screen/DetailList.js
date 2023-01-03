import { FontAwesome } from "@expo/vector-icons";
import { Box, Button, Image, Text, Stack, VStack, HStack, FlatList } from "native-base";
import { showMessage } from "react-native-flash-message";
import { useQuery } from "react-query";
import ChecklistImage from "../../assets/checklist.png";
import { API } from "../config/api";

function DetailList({ route, navigation }) {
  let { listId, listBgColor, categoryBgColor, categoryName } = route.params;

  let { data: listDetail, refetch: listDetailRefetch } = useQuery(
    "listDetailCaches",
    async () => {
      let listResponse = await API.get(`/list/${listId}`);
      return listResponse.data;
    }
  );

  let { data: list, refetch: listRefetch } = useQuery(
    "listCaches",
    async () => {
      let listResponse = await API.get("/list");
      return listResponse.data;
    }
  );

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

  async function handleUpdateIsDone(e, id_list, current_status) {
    e.preventDefault();
    try {
    
      await API.patch(
        `/List/${id_list}`,
        { is_done: current_status == 0 ? 1 : 0 },
        { validateStatus: () => true }
      );
      listDetailRefetch();
      listRefetch();
    } catch (err) {
      showMessage({
        message: "Failed to change status todo!",
        type: "danger",
      });
    }
  }

  return (
    <Box maxH={"82%"}>
      <Stack m={"3"} w={"93%"} rounded="sm" bg={listBgColor} pb={5}>
        <HStack justifyContent={"space-between"} p="3" pb={0}>
          <Box justifyContent={"center"} w={"50%"}>
            <Text
              fontSize={"3xl"}
              fontWeight="bold"
              textDecorationLine={listDetail?.is_done == 0 ? "none" : "line-through"}
            >
              {listDetail?.name}
            </Text>

            <Text
              textDecorationLine={listDetail?.is_done == 0 ? "none" : "line-through"}
            >
              {milisToDate(listDetail?.date)}
            </Text>
          </Box>
          <VStack w="32" mt={"3"} space="2">
            <Box
              p={1}
              borderRadius={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={categoryBgColor}
            >
              <Text color="white" fontWeight="bold">
                {categoryName}
              </Text>
            </Box>
            <Button
              bg={listBgColor}
              borderRadius={100}
              _hover={{ backgroundColor: { listBgColor } }}
              _pressed={{ backgroundColor: { listBgColor } }}
              mt={2}
              onPress={(e) => handleUpdateIsDone(e, listDetail?._id, listDetail?.is_done)}
            >
              {listDetail?.is_done ? (
                <Image
                  source={ChecklistImage}
                  w={50}
                  h={50}
                  resizeMode="contain"
                  alt="ChecklistImage"
                />
              ) : (
                <>
                  <Button
                    bg={listDetail?.is_done ? "white" : "muted.200"}
                    borderRadius={100}
                    _hover={{ backgroundColor: "muted.300" }}
                    _pressed={{ backgroundColor: "muted.400" }}
                    w={50}
                    h={50}
                    onPress={(e) =>
                      handleUpdateIsDone(e, listDetail?._id, listDetail?.is_done)
                    }
                  ></Button>
                </>
              )}
            </Button>
          </VStack>
        </HStack>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text
              fontSize={"xs"}
              m="3"
              color={"gray.600"}
              textDecorationLine={listDetail?.is_done == 0 ? "none" : "line-through"}
            >
              {listDetail?.description}
            </Text>
          }
          renderItem={() => {
            listDetail?.description
          }}
        />
      </Stack>
  </Box>
  );
}

export default DetailList;
