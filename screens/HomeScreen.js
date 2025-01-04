/* eslint-disable no-unused-vars */
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ImageBackground,
  Dimensions
} from "react-native";
import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
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
import { getAllProducts } from "../feature/products/productSlice";
import axiosInstance from "../api/axiosInstance";
import { APP_CONFIG } from "../config/common";
import { useGetCurrentUser } from "../api/user";
import { useUserAsyncStore } from "../hook/useUserAsyncStore";
import Loading from "../components/Loading";
// import ReactStars from "react-native-stars";

const HomeScreen = () => {
  const { userAsyncStore, setDataForUserAsyncStore } = useUserAsyncStore();
  const { data, isLoading, refetch, error } = useGetCurrentUser();

  useEffect(() => {
    if (error) {
      return;
    }
    if (data) {
      setDataForUserAsyncStore(data?.data);
      return;
    }
  }, [data, error]);

  const list = [
    {
      id: "0",
      image: "https://images-na.ssl-images-amazon.com/images/I/71k9-VOxYGL.jpg",
      name: "TVs",
    },
    {
      id: "1",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgGz1Dt8sMxdhK9Mb9eRmh4id_RdaeGbwG3g&s",
      name: "Speakers",
    },
    {
      id: "3",
      image: "https://samcenter.vn/images/thumbs/0009229_samsung-galaxy-tab-s10-ultra-wi-fi-12gb256gb.jpeg",
      name: "Tablets",
    },
    {
      id: "4",
      image: "https://surfaceviet.vn/wp-content/uploads/2024/03/Surface-Laptop-6-Platinum.png",
      name: "Laptops",
    },
    {
      id: "5",
      image: "https://mobileworld.com.vn/uploads/product/12_2019/thumbs/iphone-11-64gb-qua-su-dung-moi-99-like-new-2.webp",
      name: "Smartphones",
    },
    {
      id: "6",
      image: "https://images-na.ssl-images-amazon.com/images/I/71bHocs0s6L.jpg",
      name: "Smartwatches",
    },
    {
      id: "7",
      image: "https://vi.abyss-headphones.com/cdn/shop/files/abyss-diana-dz-damascus-w_1800x1800.jpg?v=1734382683",
      name: "Headphones",
    },
    {
      id: "8",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTR-kLdiaEKFIKeCKIUKvQo_0f44jafA6ucg&s",
      name: "Airpod",
    },
  ];
  const brands = [
    { id: "0", name: "LG", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/2560px-LG_logo_%282014%29.svg.png" },
    { id: "1", name: "Apple", image: "https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png" },
    { id: "2", name: "Samsung", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png" },
    { id: "3", name: "Sony", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1200px-Sony_logo.svg.png" },
    { id: "4", name: "Dell", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Dell_logo.svg/2560px-Dell_logo.svg.png" },
    { id: "5", name: "HP", image: "https://logos-world.net/wp-content/uploads/2020/11/HP-Logo.png" },
    { id: "6", name: "Asus", image: "https://logolook.net/wp-content/uploads/2023/09/Asus-Logo.png" },
    { id: "7", name: "Acer", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/2560px-Acer_2011.svg.png" },
    { id: "8", name: "Lenovo", image: "https://logos-world.net/wp-content/uploads/2022/07/Lenovo-Logo.png" },
    { id: "9", name: "MSI", image: "https://logolook.net/wp-content/uploads/2023/10/MSI-Logo.png" },
    { id: "10", name: "Huawei", image: "https://logos-world.net/wp-content/uploads/2020/04/Huawei-Logo.png" },
    { id: "11", name: "Xiaomi", image: "https://inansaigon.vn/ckfinder/userfiles/images/logo-xiaomi-3.png" },
    { id: "12", name: "Canon", image: "https://rubee.com.vn/wp-content/uploads/2021/06/logo-canon.png" },
  ];
  const banners = [
    {
      id: 0,
      image: "https://m.media-amazon.com/images/I/61jPN0bUdjL._SR1236,1080_.jpg",
    },
    {
      id: 1,
      image: "https://m.media-amazon.com/images/I/61Kjqx6RDYL._SR1236,1080_.jpg",
    },
    {
      id: 2,
      image: "https://m.media-amazon.com/images/I/61JCIqSyWzL._SR1236,1080_.jpg",
    },
  ];

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

  const { width } = Dimensions.get("window");

  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, width]);

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  useEffect(() => {
    getProducts();
  }, []);

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

  const featuredProducts =
    productState &&
    productState
      ?.filter((item) => item?.product_tags?.some((tag) => tag?.name.toLowerCase() === "featured"))
      ?.slice(0, 4);

  const specialProducts =
    productState &&
    productState
      ?.filter((item) => item?.product_tags?.some((tag) => tag?.name.toLowerCase() === "special"))
      ?.slice(0, 4);

  const popularProducts =
    productState &&
    productState
      .filter((item) => item?.product_tags?.some((tag) => tag?.name.toLowerCase() === "popular"))
      .slice(0, 10);

  const [selectedProduct, setSelectedProduct] = useState(popularProducts[0]);

  useEffect(() => {
    setSelectedProduct(popularProducts[0]);
  }, [productState]);

  const handlePress = (product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", marginTop: Platform.OS === "android" ? 40 : 0 }}>
        <ScrollView>
          {/* Search Input */}
          <>
            <View style={{ backgroundColor: "#131921", padding: 10, flexDirection: "row", alignItems: "center" }}>
              <Pressable style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 3, gap: 10, backgroundColor: "white", borderRadius: 50, height: 40, flex: 1, }}>
                <AntDesign style={{ paddingLeft: 10 }} name="search1" size={22} color="black" />
                <TextInput style={{ fontSize: 16 }} placeholder="Tìm kiếm sản phẩm..." />
              </Pressable>
            </View>
          </>
          {/* Add shipping address */}
          <>
            <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 5, padding: 10, backgroundColor: "#222F3E", }}>
              <Ionicons name="location-outline" size={24} color="white" />
              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                {selectedAddress ? (
                  <Text style={{ fontSize: 13, fontWeight: "500", color: "white" }}>
                    Deliver to {selectedAddress?.name} - {selectedAddress?.street}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 13, fontWeight: "500", color: "white" }}>Thêm địa chỉ giao hàng</Text>
                )}
              </Pressable>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
            </Pressable>
          </>
          {/* Categories */}
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {list.map((item, index) => (
                <Pressable key={index} style={{ margin: 10, justifyContent: "center", alignItems: "center", }}>
                  <Image style={{ width: 70, height: 80, resizeMode: "contain" }} source={{ uri: item.image }} />
                  <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", marginTop: 3, }}>
                    {item?.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
          {/* Banner Image */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 2, marginTop: 15, }} />
            <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
              {banners?.map((item, index) => (
                <ImageBackground
                  key={index}
                  style={{ width: Dimensions.get('window').width, height: 350, resizeMode: "cover" }}
                  source={{ uri: item?.image }}
                />
              ))}
            </ScrollView>
          </>
          {/* <SliderBox
            images={images}
            autoPlay
            circleLoop
            dotColor={"#13274F"}
            inactiveDotColor="#90A4AE"
            ImageComponentStyle={{ width: "100%" }}
          /> */}
          {/* <View style={{ marginHorizontal: 10, marginTop: 20, width: "45%", marginBottom: open ? 50 : 15, }}>
            <DropDownPicker
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
            />
          </View> */}
          {/* Fake Data */}
          {/* <>
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", }}>
              {products
                ?.filter((item) => item.category === category)
                .map((item, index) => (
                  <ProductItem item={item} key={index} />
                ))}
            </View>
          </> */}
          {/* Special Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5, }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>
              Sản phẩm đặc biệt
            </Text>
            <FlatList
              data={specialProducts}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={2} // Hiển thị 2 sản phẩm mỗi dòng
              renderItem={({ item }) => (
                <Pressable style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item?.product_images[0]?.url }} style={styles.image} />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.brand}>{item?.product_brand?.map((brand) => brand?.title)?.join(" | ")}</Text>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                      {item?.product_name}
                    </Text>
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
          </>
          {/* Popular Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Sản phẩm trending</Text>
            <Pressable onPress={() => { navigation.navigate("Info", { id: selectedProduct?._id }); }}>
              <View style={styles.imageContainer}>
                <Image
                  style={{ width: '60%', height: 250, resizeMode: 'cover', marginBottom: 10 }}
                  source={{ uri: selectedProduct?.product_images[0]?.url }}
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginHorizontal: 10, fontSize: 16, color: '#666' }}>{selectedProduct?.product_brand?.map((brand) => brand?.title)?.join(" | ")}</Text>
                <Text style={{ marginHorizontal: 10, fontSize: 22, fontWeight: 700 }} numberOfLines={1} ellipsizeMode="tail">
                  {selectedProduct?.product_name}
                </Text>
              </View>
              <Text style={{ marginHorizontal: 10, marginBottom: 10, fontSize: 24, fontWeight: 400 }}>{selectedProduct?.product_price.toLocaleString()}₫</Text>
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.isArray(popularProducts) && popularProducts.map((product, index) => (
                <Pressable key={index} style={{ margin: 5, justifyContent: "center", alignItems: "center", borderWidth: 1, borderRadius: 8, borderColor: "#ddd", }} onPress={() => handlePress(product)}>
                  <Image style={{ width: 100, height: 100, resizeMode: "contain" }} source={{ uri: product?.product_images[0]?.url }} />
                </Pressable>
              ))}
            </ScrollView>
          </>
          {/* Brands */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5, }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>
              Từ các thương hiệu hàng đầu
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {brands.map((brand, index) => (
                <Pressable key={index} style={{ margin: 10, justifyContent: "center", alignItems: "center" }}>
                  <Image style={{ width: 90, height: 90, resizeMode: "contain" }} source={{ uri: brand.image }} />
                  <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "500", marginTop: 3 }}>
                    {brand.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
          {/* Featured Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5, }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>
              Từ các bộ sưu tập
            </Text>
            <FlatList
              data={featuredProducts}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={2} // Hiển thị 2 sản phẩm mỗi dòng
              renderItem={({ item }) => (
                <Pressable style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item?.product_images[0]?.url }} style={styles.image} />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.brand}>{item?.product_brand?.map((brand) => brand?.title)?.join(" | ")}</Text>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                      {item?.product_name}
                    </Text>
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
          </>
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
      {isLoading && <Loading />}
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 0,
  },
  image: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  details: {
    padding: 10,
  },
  brand: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 17,
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
    fontSize: 18,
    fontWeight: "semi-bold",
    color: "#041E42",
  },
});
