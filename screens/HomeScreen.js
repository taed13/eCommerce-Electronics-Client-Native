/* eslint-disable no-unused-vars */
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  StyleSheet,
  Platform,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect, useContext, useRef } from "react";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { jwtDecode } from "jwt-decode";
import { getAllProducts } from "../feature/products/productSlice";
import HeaderSearchInput from "../components/HeaderSearchInput";
import AddressBottomModal from "../components/AddressBottomModal";
import { colors } from "../constants/color";
import { useGetUserAddresses } from "../api/user";

const HomeScreen = () => {
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
      image:
        "https://queenmobile.net/wp-content/uploads/2024/02/5-17-image-1190.jpg",
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
    {
      id: "0",
      name: "LG",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/2560px-LG_logo_%282014%29.svg.png",
    },
    { id: "1", name: "Apple", image: "https://1000logos.net/wp-content/uploads/2017/02/Apple-Logosu.png" },
    {
      id: "2",
      name: "Samsung",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/1280px-Samsung_Logo.svg.png",
    },
    {
      id: "3",
      name: "Sony",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1200px-Sony_logo.svg.png",
    },
    {
      id: "4",
      name: "Dell",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Dell_logo.svg/2560px-Dell_logo.svg.png",
    },
    { id: "5", name: "HP", image: "https://logos-world.net/wp-content/uploads/2020/11/HP-Logo.png" },
    { id: "6", name: "Asus", image: "https://logolook.net/wp-content/uploads/2023/09/Asus-Logo.png" },
    {
      id: "7",
      name: "Acer",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Acer_2011.svg/2560px-Acer_2011.svg.png",
    },
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
  const [selectedAddress, setSelectedAdress] = useState("");

  const [token, setToken] = useState("");

  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const { data: addresses, isLoading, isError, refetch } = useGetUserAddresses(userId);

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

  const [modalVisible, setModalVisible] = useState(false);

  const defaultAddress = addresses?.data?.addresses?.find((address) => address.default === true);

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
        <View>
          <HeaderSearchInput />
        </View>
        <ScrollView>
          {/* Search Input */}
          {/* Add shipping address */}
          <>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={{ flexDirection: "row", alignItems: "center", gap: 5, padding: 10, backgroundColor: "#425768" }}
            >
              <Ionicons name="location-outline" size={24} color="white" />
              <Pressable onPress={() => setModalVisible(!modalVisible)} style={{ flex: 1 }}>
                {defaultAddress ? (
                  <Text
                    style={{ fontSize: 17, fontWeight: "500", color: "white" }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Giao hàng đến {defaultAddress.district?.full_name}, {defaultAddress.province?.name}
                  </Text>
                ) : (
                  <Text style={{ fontSize: 17, fontWeight: "500", color: "white" }}>Thêm địa chỉ giao hàng</Text>
                )}
              </Pressable>
              <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
            </Pressable>
          </>
          {/* Categories */}
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {list.map((item, index) => (
                <TouchableOpacity key={index} style={{ margin: 10, justifyContent: "center", alignItems: "center" }}>
                  <Image style={{ width: 70, height: 80, resizeMode: "contain" }} source={{ uri: item.image }} />
                  <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", marginTop: 3 }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
          {/* Banner Image */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 2, marginTop: 15 }} />
            <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
              {banners?.map((item, index) => (
                <ImageBackground
                  key={index}
                  style={{ width: Dimensions.get("window").width, height: 350, resizeMode: "cover" }}
                  source={{ uri: item?.image }}
                />
              ))}
            </ScrollView>
          </>
          {/* Special Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Sản phẩm đặc biệt</Text>
            <FlatList
              data={specialProducts}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item?.product_images[0]?.url }} style={styles.image} />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.brand}>{item?.product_brand?.map((brand) => brand?.title)?.join(" | ")}</Text>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                      {item?.product_name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <View style={styles.ratingContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <AntDesign name="star" size={20} color={colors.yellow} />
                          <Text style={{ marginLeft: 5, fontSize: 14, color: "#666" }}>
                            {item?.product_totalRating?.toFixed(1) || 0}/5
                          </Text>
                        </View>
                      </View>
                      {item?.product_sold !== 0 && <Text style={styles.sold}>Đã bán {item?.product_sold}</Text>}
                    </View>
                    <Text style={styles.price}>{item?.product_price.toLocaleString()}₫</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
          {/* Popular Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Sản phẩm trending</Text>
            <Pressable
              onPress={() => {
                navigation.navigate("Info", { id: selectedProduct?._id });
              }}
            >
              <View style={styles.imageContainer}>
                <Image
                  style={{ width: "60%", height: 250, resizeMode: "cover", marginBottom: 10 }}
                  source={{ uri: selectedProduct?.product_images[0]?.url }}
                />
              </View>
              <View style={{ marginVertical: 10 }}>
                <Text style={{ marginHorizontal: 10, fontSize: 16, color: "#666" }}>
                  {selectedProduct?.product_brand?.map((brand) => brand?.title)?.join(" | ")}
                </Text>
                <Text
                  style={{ marginHorizontal: 10, fontSize: 22, fontWeight: 700 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedProduct?.product_name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ marginHorizontal: 10, marginBottom: 10, fontSize: 24, fontWeight: 400 }}>
                  {selectedProduct?.product_price.toLocaleString()}₫
                </Text>
                {selectedProduct?.product_sold != 0 && (
                  <Text style={{ marginHorizontal: 10, fontSize: 16, color: "#666" }}>
                    Đã bán {selectedProduct?.product_sold.toLocaleString()}
                  </Text>
                )}
              </View>
            </Pressable>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.isArray(popularProducts) &&
                popularProducts.map((product, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      margin: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderRadius: 16,
                      borderColor: "#ddd",
                    }}
                    onPress={() => handlePress(product)}
                  >
                    <Image
                      style={{ width: 100, height: 100, resizeMode: "contain" }}
                      source={{ uri: product?.product_images[0]?.url }}
                    />
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </>
          {/* Brands */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Từ các thương hiệu hàng đầu</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {brands.map((brand, index) => (
                <TouchableOpacity key={index} style={{ margin: 10, justifyContent: "center", alignItems: "center" }}>
                  <Image style={{ width: 90, height: 90, resizeMode: "contain" }} source={{ uri: brand.image }} />
                  <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "500", marginTop: 3 }}>
                    {brand.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
          {/* Featured Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Từ các bộ sưu tập</Text>
            <FlatList
              data={featuredProducts}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item?.product_images[0]?.url }} style={styles.image} />
                  </View>
                  <View style={styles.details}>
                    <Text style={styles.brand}>{item?.product_brand?.map((brand) => brand?.title)?.join(" | ")}</Text>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                      {item?.product_name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      <View style={styles.ratingContainer}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <AntDesign name="star" size={20} color={colors.yellow} />
                          <Text style={{ marginLeft: 5, fontSize: 14, color: "#666" }}>
                            {item?.product_totalRating?.toFixed(1) || 0}/5
                          </Text>
                        </View>
                      </View>
                      {item?.product_sold !== 0 && <Text style={styles.sold}>Đã bán {item?.product_sold}</Text>}
                    </View>
                    <Text style={styles.price}>{item?.product_price.toLocaleString()}₫</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        </ScrollView>
      </SafeAreaView>

      <AddressBottomModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addresses={addresses?.data?.addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAdress}
        refetchUserData={refetch}
      />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
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
    fontSize: 20,
    fontWeight: "semi-bold",
    color: "#041E42",
  },
});
