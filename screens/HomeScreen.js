/* eslint-disable no-unused-vars */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
// import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import ProductItem from "../components/ProductItem";
// import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
// import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { jwtDecode } from "jwt-decode";
import { base_url } from "../utils/axiosConfig";
import { getAllProducts } from "../feature/products/productSlice";
import axiosInstance from "../api/axiosInstance";
// import ReactStars from "react-native-stars";

const HomeScreen = () => {
  const list = [
    {
      id: "0",
      image: "https://m.media-amazon.com/images/I/41EcYoIZhIL._AC_SY400_.jpg",
      name: "Home",
    },
    {
      id: "1",
      image: "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/blockbuster.jpg",
      name: "Deals",
    },
    {
      id: "3",
      image: "https://images-eu.ssl-images-amazon.com/images/I/31dXEvtxidL._AC_SX368_.jpg",
      name: "Electronics",
    },
    {
      id: "4",
      image: "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/All_Icons_Template_1_icons_01.jpg",
      name: "Mobiles",
    },
    {
      id: "5",
      image: "https://m.media-amazon.com/images/G/31/img20/Events/Jup21dealsgrid/music.jpg",
      name: "Music",
    },
    {
      id: "6",
      image: "https://m.media-amazon.com/images/I/51dZ19miAbL._AC_SY350_.jpg",
      name: "Fashion",
    },
  ];
  // const images = [
  //   "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
  //   "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
  //   "https://images-eu.ssl-images-amazon.com/images/G/31/img23/Books/BB/JULY/1242x550_Header-BB-Jul23.jpg",
  // ];

  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.product);

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [category, setCategory] = useState("jewelery");
  const [selectedAddress, setSelectedAdress] = useState("");
  const [items, setItems] = useState([
    { label: "Quần áo nam", value: "men's clothing" },
    { label: "Trang sức", value: "jewelery" },
    { label: "Điện tử", value: "electronics" },
    { label: "Quần áo nữ", value: "women's clothing" },
  ]);
  const [token, setToken] = useState("");

  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  console.log(selectedAddress);

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  useEffect(() => {
    getProducts();
  }, []);

  console.log("products:::", productState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.log("error message", error);
      }
    };

    fetchData();
  }, []);

  const cart = useSelector((state) => state.cart.cart);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId, modalVisible]);

  const fetchAddresses = async () => {
    try {
      console.log(`token:::`, token);
      const response = await axiosInstance.get(`user/addresses/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const { addresses } = response.data;

      setAddresses(addresses);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      setUserId(userId);
      setToken(token);
    };

    fetchUser();
  }, []);
  const filteredProducts =
    productState &&
    productState
      ?.filter((item) => item?.product_tags?.some((tag) => tag?.name.toLowerCase() === "featured"))
      ?.slice(0, 4);

  // console.log("userId:::", userId);
  console.log("address", addresses);
  return (
    <>
      <SafeAreaView
        style={{
          paddinTop: Platform.OS === "android" ? 40 : 0,
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ScrollView>
          <View
            style={{
              backgroundColor: "#131921",
              padding: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                gap: 10,
                backgroundColor: "white",
                borderRadius: 3,
                height: 38,
                flex: 1,
              }}
            >
              <AntDesign style={{ paddingLeft: 10 }} name="search1" size={22} color="black" />
              <TextInput placeholder="Tìm kiếm sản phẩm..." />
            </Pressable>
          </View>

          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 10,
              backgroundColor: "#222F3E",
            }}
          >
            <Ionicons name="location-outline" size={24} color="white" />

            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              {selectedAddress ? (
                <Text style={{ fontSize: 13, fontWeight: "500", color: "white" }}>
                  Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                </Text>
              ) : (
                <Text style={{ fontSize: 13, fontWeight: "500", color: "white" }}>Add a delivery address</Text>
              )}
            </Pressable>

            <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable
                key={index}
                style={{
                  margin: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image style={{ width: 50, height: 50, resizeMode: "contain" }} source={{ uri: item.image }} />

                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 5,
                  }}
                >
                  {item?.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* <SliderBox
                        images={images}
                        autoPlay
                        circleLoop
                        dotColor={"#13274F"}
                        inactiveDotColor="#90A4AE"
                        ImageComponentStyle={{ width: "100%" }}
                    /> */}

          <View
            style={{
              marginHorizontal: 10,
              marginTop: 20,
              width: "45%",
              marginBottom: open ? 50 : 15,
            }}
          >
            {/* <DropDownPicker
              style={{
                borderColor: "#B7B7B7",
                height: 30,
                marginBottom: open ? 120 : 15,
              }}
              open={open}
              value={category} //genderValue
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="choose category"
              placeholderStyle={styles.placeholderStyles}
              onOpen={onGenderOpen}
              // onChangeValue={onChange}
              zIndex={3000}
              zIndexInverse={1000}
            /> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {products
              ?.filter((item) => item.category === category)
              .map((item, index) => (
                <ProductItem item={item} key={index} />
              ))}
          </View>

          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 2,
              marginTop: 15,
            }}
          />

          <Text style={{ padding: 10, fontSize: 18, fontWeight: "bold" }}>Từ các bộ sưu tập</Text>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            numColumns={2} // Hiển thị 2 sản phẩm mỗi dòng
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => navigation.navigate("ProductDetails", { id: item?._id })}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item?.product_images[0]?.url }} style={styles.image} />
                </View>
                <View style={styles.details}>
                  <Text style={styles.brand}>{item?.product_brand?.map((brand) => brand?.title)?.join(" | ")}</Text>
                  <Text style={styles.title}>{item?.product_name}</Text>
                  <View style={styles.ratingContainer}>
                    {/* <ReactStars
                                count={5}
                                value={+item?.product_totalRating}
                                size={18}
                                half={true}
                                fullStar={<Text>★</Text>}
                                emptyStar={<Text>☆</Text>}
                                disabled
                            /> */}
                    {item?.product_sold !== 0 && <Text style={styles.sold}>Đã bán {item?.product_sold}</Text>}
                  </View>
                  <Text style={styles.price}>{item?.product_price.toLocaleString()}₫</Text>
                </View>
              </Pressable>
            )}
          />
        </ScrollView>
      </SafeAreaView>

      {/* <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={{ width: "100%", height: 400 }}>
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your Location
            </Text>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {addresses &&
              addresses?.map((item, index) => (
                <Pressable
                  onPress={() => setSelectedAdress(item)}
                  style={{
                    width: 140,
                    height: 140,
                    borderColor: "#D0D0D0",
                    borderWidth: 1,
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                    marginRight: 15,
                    marginTop: 10,
                    backgroundColor:
                      selectedAddress === item ? "#FBCEB1" : "white",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                      {item?.name}
                    </Text>
                    <Entypo name="location-pin" size={24} color="red" />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item?.houseNo},{item?.landmark}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    {item?.street}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ width: 130, fontSize: 13, textAlign: "center" }}
                  >
                    India, Bangalore
                  </Text>
                </Pressable>
              ))}

            <Pressable
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Address");
              }}
              style={{
                width: 140,
                height: 140,
                borderColor: "#D0D0D0",
                marginTop: 10,
                borderWidth: 1,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#0066b2",
                  fontWeight: "500",
                }}
              >
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={{ flexDirection: "column", gap: 7, marginBottom: 30 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Entypo name="location-pin" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Enter an Indian pincode
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Ionicons name="locate-sharp" size={22} color="#0066b2" />
              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Use My Currect location
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <AntDesign name="earth" size={22} color="#0066b2" />

              <Text style={{ color: "#0066b2", fontWeight: "400" }}>
                Deliver outside India
              </Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal> */}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  details: {
    padding: 10,
  },
  brand: {
    fontSize: 12,
    color: "#666",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sold: {
    fontSize: 12,
    color: "#999",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#041E42",
  },
});
