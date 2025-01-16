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
import React, { useState, useEffect, useContext, useRef, useMemo, useCallback } from "react";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../UserContext";
import { jwtDecode } from "jwt-decode";
import { getAllProducts } from "../feature/products/productSlice";
import HeaderSearchInput from "../components/HeaderSearchInput";
import AddressBottomModal from "../components/AddressBottomModal";
import { colors } from "../constants/color";
import { useGetUserAddresses } from "../api/user";
import { useFetchLatestProducts, useFetchPopularProducts, useFetchSpecialProducts } from "../api/product";
import { useGetAllBlogs } from "../api/blog";
import { useGetAllBanners } from "../api/banner";

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
  const backgroundColors = ["#baddf1", "#ebd2ca", "#c8e5e0", "#eee2d4", "#ebdbdb"];


  const dispatch = useDispatch();
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
        const nextIndex = (prevIndex + 1) % productBanner?.data.length;
        scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [productBanner?.data, width]);

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  useEffect(() => {
    getProducts();
  }, []);

  const { data: popularProducts, isLoading: isLoadingPopular } = useFetchPopularProducts();
  const { data: latestProducts, isLoading: isLoadingLatest } = useFetchLatestProducts();
  const { data: specialProducts, isLoading: isLoadingSpecial } = useFetchSpecialProducts();
  const { data: allBlogs, isLoading: isLoadingAllBlogs } = useGetAllBlogs();
  const { data: productBanner, isLoading: isLoadingBanner } = useGetAllBanners();

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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

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

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (popularProducts?.data?.popularProducts?.length > 0) {
      setSelectedProduct(popularProducts.data.popularProducts[0]);
    }
  }, [popularProducts]);

  const { displayPrice, discountText } = useMemo(() => {
    let displayPrice = selectedProduct?.product_price || null;
    let discountText = "";

    if (selectedProduct?.discount) {
      if (selectedProduct.discount.discount_type === "percentage") {
        displayPrice = selectedProduct.product_price - (selectedProduct.product_price * selectedProduct.discount.discount_value / 100);
        discountText = `-${selectedProduct.discount.discount_value}%`;
      } else if (selectedProduct.discount.discount_type === "fixed_amount") {
        displayPrice = selectedProduct.product_price - selectedProduct.discount.discount_value;
        discountText = `-${selectedProduct?.discount?.discount_value?.toLocaleString()}₫`;
      }
    }

    return { displayPrice, discountText };
  }, [selectedProduct]);

  useEffect(() => {
    setSelectedProduct(popularProducts?.data?.popularProducts[0]);
  }, [popularProducts]);

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
          {/* Shipping address */}
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
                <TouchableOpacity
                  key={index}
                  style={{ margin: 10, justifyContent: "center", alignItems: "center" }}
                  onPress={() => navigation.navigate("ProductList", { categoryName: item.name })}
                >
                  <Image style={{ width: 70, height: 80, resizeMode: "contain" }} source={{ uri: item.image }} />
                  <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", marginTop: 3 }}>
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
          {/* Banner Image */}
          {/* <>
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
          </> */}
          {/* Product Banner */}
          <>
            <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} pagingEnabled>
              {productBanner?.data?.map((item, index) => (
                <View
                  style={{
                    width: Dimensions.get("window").width,
                    height: 300,
                    backgroundColor: backgroundColors[index % backgroundColors.length],
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                  }}
                  key={index}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, color: "#666", textAlign: "left" }}>
                      {item?.product?.product_brand?.map((brand) => brand?.title)?.join(" | ")}
                    </Text>
                    <Text style={{ fontSize: 30, fontWeight: "bold", color: "#041E42", textAlign: "left", width: 200, marginBottom: 20 }}>
                      {item?.product?.product_name}
                    </Text>
                    <Text style={{ fontSize: 34, fontWeight: "normal", color: "#041E42", textAlign: "left" }}>
                      {item?.product?.product_after_price?.toLocaleString()}₫
                    </Text>
                    {item?.product?.discount && (
                      <Text style={{ fontSize: 16, color: "#666", textAlign: "left", textDecorationLine: "line-through" }}>
                        Giá gốc: {item?.product?.product_price?.toLocaleString()}₫
                      </Text>
                    )}
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.red,
                        padding: 10,
                        borderRadius: 10,
                        width: 150,
                        marginTop: 10,
                      }}
                      onPress={() => navigation.navigate("Info", { id: item?.product?._id })}
                    >
                      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>Xem chi tiết</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    style={{ width: "80%", height: undefined, aspectRatio: 1, resizeMode: "contain", position: 'absolute', right: '-30%' }}
                    source={{ uri: item?.product.product_images[0]?.url }}
                  />
                </View>
              ))}
            </ScrollView>
          </>
          {/* Special Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Sản phẩm đặc biệt</Text>
            <FlatList
              data={specialProducts?.data?.slice(0, 6)}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={2}
              renderItem={({ item }) => {
                let displayPrice = item?.product_price;
                let discountText = "";

                if (item?.discount) {
                  if (item.discount.discount_type === "percentage") {
                    displayPrice = item.product_price - (item.product_price * item.discount.discount_value / 100);
                    discountText = `-${item.discount.discount_value}%`;
                  } else if (item.discount.discount_type === "fixed_amount") {
                    displayPrice = item.product_price - item.discount.discount_value;
                    discountText = `-${item.discount.discount_value.toLocaleString()}₫`;
                  }
                }
                return (
                  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                    {item?.discount &&
                      <Text style={{ position: "absolute", top: 10, left: 10, backgroundColor: colors.red, padding: 5, borderRadius: 5, color: "white", }}>
                        {discountText}
                      </Text>
                    }
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
                      <Text style={styles.price}>{displayPrice?.toLocaleString()}₫</Text>
                      {item?.discount && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                          <Text style={{ fontSize: 12 }}>
                            Giá gốc:
                          </Text>
                          <Text style={{ color: "#888", fontSize: 16, fontWeight: "thin", textDecorationLine: "line-through" }}>
                            {item?.product_price?.toLocaleString()}₫
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </>
          {/* Popular Products */}
          <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Sản phẩm trending</Text>
            <TouchableOpacity style={{ position: "relative" }}
              onPress={() => {
                navigation.navigate("Info", { id: selectedProduct?._id });
              }}
            >
              {selectedProduct?.discount && (
                <Text style={{ position: "absolute", top: 20, left: 20, backgroundColor: colors.red, padding: 7, borderRadius: 7, color: "white", fontSize: 18, zIndex: 100, boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)" }}>
                  {discountText}
                </Text>
              )}
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
                <Text style={{ marginHorizontal: 10, fontSize: 22, fontWeight: 700 }} numberOfLines={1} ellipsizeMode="tail">
                  {selectedProduct?.product_name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "start", gap: 5 }}>
                  <Text style={{ marginLeft: 10, marginBottom: 10, fontSize: 28, fontWeight: 400 }}>
                    {displayPrice?.toLocaleString()}₫
                  </Text>
                  {selectedProduct?.discount && (
                    <Text style={{ marginRight: 10, fontSize: 20, color: "#666", textDecorationLine: "line-through" }}>
                      {selectedProduct?.product_price.toLocaleString()}₫
                    </Text>
                  )}
                </View>
                {selectedProduct?.product_sold != 0 && (
                  <Text style={{ marginHorizontal: 10, fontSize: 16, color: "#666" }}>
                    Đã bán {selectedProduct?.product_sold.toLocaleString()}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Array.isArray(popularProducts?.data?.popularProducts) &&
                popularProducts?.data?.popularProducts?.slice(0, 6).map((product, index) => (
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
                    onPress={() => setSelectedProduct(product)}
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
                <TouchableOpacity
                  key={index}
                  style={{ margin: 10, justifyContent: "center", alignItems: "center" }}
                  onPress={() =>
                    navigation.navigate("ProductList", {
                      brandName: brand.name,
                    })
                  }
                >
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
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>Hàng mới về</Text>
            <FlatList
              data={latestProducts?.data?.products?.slice(0, 6)}
              keyExtractor={(item, index) => `${item._id}-${index}`}
              numColumns={2}
              renderItem={({ item }) => {
                let displayPrice = item?.product_price;
                let discountText = "";

                if (item?.discount) {
                  if (item.discount.discount_type === "percentage") {
                    displayPrice = item.product_price - (item.product_price * item.discount.discount_value / 100);
                    discountText = `-${item.discount.discount_value}%`;
                  } else if (item.discount.discount_type === "fixed_amount") {
                    displayPrice = item.product_price - item.discount.discount_value;
                    discountText = `-${item.discount.discount_value.toLocaleString()}₫`;
                  }
                }
                return (
                  <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                    {item?.discount &&
                      <Text style={{ position: "absolute", top: 10, left: 10, backgroundColor: colors.red, padding: 5, borderRadius: 5, color: "white", zIndex: 100 }}>
                        {discountText}
                      </Text>
                    }
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
                      <Text style={styles.price}>{displayPrice.toLocaleString()}₫</Text>
                      {item?.discount && (
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
                          <Text style={{ fontSize: 12 }}>
                            Giá gốc:
                          </Text>
                          <Text style={{ color: "#888", fontSize: 16, fontWeight: "thin", textDecorationLine: "line-through" }}>
                            {item?.product_price?.toLocaleString()}₫
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </>
          {/* ĐIỆN THOẠI NỔI BẬT NHẤT */}
          {/* <>
            <Text style={{ height: 1, borderColor: "#ddd", borderWidth: 1, marginTop: 15, marginBottom: 5 }} />
            <Text style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>ĐIỆN THOẠI NỔI BẬT NHẤT</Text>
          </> */}
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
    position: "relative",
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
