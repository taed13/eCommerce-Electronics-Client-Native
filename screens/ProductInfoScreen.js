import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";

import Loading from "../components/Loading";
import ProductReviewForm from "../components/ProductReviewForm";

import { colors } from "../constants/color";

import { useFetchProduct, useFetchProducts } from "../api/product";
import { useCheckProductInOrder } from "../api/order";
import { useAddToCart } from "../api/cart";
import { useGetCurrentUser } from "../api/user";
import HeaderSearchInput from "../components/HeaderSearchInput";

const ProductInfoScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { data: currentUserData } = useGetCurrentUser();
  const currentUser = currentUserData?.data;

  const [reviews, setReviews] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const [isInOrder, setIsInOrder] = useState(null);
  const [isCheckingOrder, setIsCheckingOrder] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);

  const defaultAddress = currentUser?.addresses?.find(
    (address) => address.default === true
  );

  const route = useRoute();
  const productId = route.params?.id;

  const { isLoading: isLoadingProduct, data: productData, fetchProduct } =
    useFetchProduct();
  const { isLoading: isLoadingProducts, fetchProducts } =
    useFetchProducts();
  const { fetchCheckProductInOrder } = useCheckProductInOrder();
  const { mutate: addToCart, isLoading: isLoadingAddToCart } = useAddToCart();

  const fetchProductData = async () => {
    await fetchProduct(productId);
    const allProducts = await fetchProducts();
    const filteredSpecialProducts = allProducts.filter((item) =>
      item.product_tags?.some((tag) => tag.name.toLowerCase() === "special")
    );
    setSpecialProducts(filteredSpecialProducts.slice(0, 4));
  };

  useEffect(() => {
    fetchProductData();
    checkIfProductInOrder();
    scrollToTop();
  }, [productId]);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const checkIfProductInOrder = async () => {
    setIsCheckingOrder(true);
    try {
      const result = await fetchCheckProductInOrder(productId);
      if (result?.data?.canReview) {
        setIsInOrder(true);
      } else {
        setIsInOrder(false);
      }
    } catch (error) {
      console.error("Error checking product in order:", error);
    } finally {
      setIsCheckingOrder(false);
    }
  };

  const { width } = Dimensions.get("window");
  const htmlContent =
    productData?.product_description || "<p>Không có mô tả</p>";

  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);

  const height = (width * 100) / 100;

  const handleAddToCart = () => {
    if (!selectedColor) {
      Alert.alert("Thông báo", "Vui lòng chọn màu sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }

    if (quantity > productData?.product_quantity) {
      Alert.alert("Thông báo", "Số lượng vượt quá tồn kho.");
      return;
    }

    const cartData = {
      productId: productData?._id,
      product_color: [
        {
          code: selectedColor.code,
          name: selectedColor.title,
        },
      ],
      quantity,
      price: productData?.product_price,
      name: productData?.product_name,
    };

    addToCart(cartData, {
      onSuccess: () => {
        Alert.alert(
          "Thành công",
          "Sản phẩm đã được thêm vào giỏ hàng.",
          [
            {
              text: "Xem giỏ hàng",
              onPress: () => navigation.navigate("Cart"),
            },
            {
              text: "Tiếp tục mua sắm",
              onPress: () => navigation.goBack(),
              style: "cancel",
            },
          ]
        );
      },
      onError: (error) => {
        Alert.alert("Lỗi", error.message || "Không thể thêm sản phẩm vào giỏ hàng.");
      },
    });
  };

  const handleQuantityChange = (value) => {
    if (value === "") {
      setQuantity("");
      return;
    }

    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) parsedValue = 1;
    if (parsedValue < 1) parsedValue = 1;
    if (parsedValue > productData?.product_quantity) parsedValue = productData?.product_quantity;
    setQuantity(parsedValue);
  };

  const toggleShowMore = () => setShowMore(!showMore);

  const handleNewReview = (newReview) => {
    setReviews((prev) => [...prev, newReview]);
  };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={{ marginTop: 47, flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <HeaderSearchInput />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {productData?.product_images?.map((item, index) => (
            <ImageBackground
              style={{ width, height, marginTop: 25, resizeMode: "contain" }}
              source={{ uri: item.url || "https://cdn4.iconfinder.com/data/icons/refresh_cl/256/System/Box_Empty.png" }}
              key={index}
            >
              <View
                style={{
                  padding: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={24}
                    color="black"
                  />
                </View>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="location" size={24} color="black" />

          <Text style={{ fontSize: 14, fontWeight: "500" }}>
            Giao hàng đến
            {defaultAddress ? (
              <Text style={{ color: "green" }}>
                {` ${defaultAddress.ward?.full_name}, ${defaultAddress.district?.full_name}, ${defaultAddress.province?.name}`}
              </Text>
            ) : (
              <Text style={{ color: "red" }}> Chưa có địa chỉ mặc định</Text>
            )}
          </Text>
        </View>

        {/* Product Details */}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 30, fontWeight: "bold" }}>
            {productData?.product_name || "Tên sản phẩm không có"}
          </Text>
          <Text style={{ fontSize: 22, color: "green", marginTop: 6 }}>
            ₫{productData?.product_price?.toLocaleString() || "0"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 15 }}>{productData?.product_totalRating}</Text>
            <AntDesign name="star" size={20} color={colors.yellow} />
            <Text style={{ fontSize: 15 }}>({productData?.product_ratings?.length} đánh giá)</Text>
          </View>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginVertical: 10,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Hãng: </Text>
            <Text>
              {productData?.product_brand?.length
                ? productData.product_brand
                  .map((brand) => brand.title)
                  .join(" | ")
                : "N/A"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Danh mục: </Text>
            <Text>
              {productData?.product_category?.length
                ? productData.product_category
                  .map((category) => category.title)
                  .join(" | ")
                : "N/A"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Tag sản phẩm: </Text>
            <Text>
              {productData?.product_tags?.length
                ? productData.product_tags.map((tag) => tag.name).join(" | ")
                : "N/A"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Trạng thái: </Text>
            <Text
              style={{
                color: productData.product_quantity > 0 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {productData?.product_quantity > 0
                ? "CÒN HÀNG" +
                " - " +
                productData?.product_quantity +
                " sản phẩm"
                : "HẾT HÀNG"}
            </Text>
          </View>

          {/* Color Options */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Màu:</Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              {productData?.product_color?.length > 0 ? (
                productData.product_color.map((color, index) => (
                  <TouchableOpacity
                    key={color.code}
                    onPress={() => setSelectedColor(color)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      backgroundColor: color.code,
                      marginRight: 5,
                      borderWidth: selectedColor?.code === color.code ? 2 : 1,
                      borderColor: selectedColor?.code === color.code ? "#333" : "#ddd",
                    }}
                  />
                ))
              ) : (
                <Text>Không có màu sắc</Text>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Số lượng: </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                padding: 5,
                borderRadius: 5,
                width: 70,
                textAlign: "center",
              }}
              value={quantity.toString()}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              maxLength={productData?.product_quantity}
            />
          </View>

          <View style={{ flexDirection: "column", gap: 5, marginBottom: 5 }}>
            <Text style={{ fontWeight: "bold" }}>Vận chuyển & Đổi trả:</Text>
            <Text>Miễn phí vận chuyển và đổi trả cho tất cả các đơn hàng!</Text>
            <Text>
              Chúng tôi vận chuyển tất cả các đơn hàng nội địa Việt Nam trong
              vòng{" "}
              <Text style={{ fontWeight: "bold" }}>5-10 ngày làm việc!</Text>
            </Text>
          </View>

          <View style={{ flexDirection: "column", marginBottom: 5 }}>
            <TouchableOpacity onPress={toggleShowMore} activeOpacity={0.8}>
              <View>
                {showMore ? (
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: htmlContent }}
                  />
                ) : (
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: htmlContent }}
                    baseStyle={{ maxHeight: 100, overflow: "hidden" }}
                  />
                )}
              </View>
              <Text
                style={{ color: "#007bff", marginTop: 5, textAlign: "right" }}
              >
                {showMore ? "Thu gọn" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1, marginVertical: 10 }} /> */}

        {/* Add to Cart Button */}
        <Pressable
          onPress={handleAddToCart}
          disabled={isLoadingAddToCart}
          style={{
            backgroundColor: isLoadingAddToCart ? "#ccc" : "#FFC72C",
            padding: 15,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {isLoadingAddToCart ? "Đang thêm vào giỏ hàng..." : "Thêm vào giỏ hàng"}
          </Text>
        </Pressable>

        <Text
          style={{
            height: 1,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginVertical: 10,
          }}
        />

        {/* Product Reviews */}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#333" }}>
            Đánh giá sản phẩm
          </Text>
          {/* Đánh giá tổng quát */}
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              {[...Array(5)].map((_, i) => {
                const ratingValue = productData?.product_totalRating || 0;
                let iconName = "star-o";

                if (i < Math.floor(ratingValue)) {
                  iconName = "star";
                } else if (i < ratingValue) {
                  iconName = "star-half-full";
                }

                return (
                  <FontAwesome
                    key={i}
                    name={iconName}
                    size={32}
                    color={iconName === "star-o" ? "#ddd" : colors.yellow}
                  />
                );
              })}
            </View>

            <Text style={{ fontSize: 16, color: "#666" }}>
              {+productData?.product_totalRating || 0} trên 5
            </Text>
            <Text style={{ fontSize: 14, color: "#999" }}>
              (Dựa trên {productData?.product_ratings?.length || 0} đánh giá)
            </Text>
          </View>

          {/* Danh sách đánh giá chi tiết */}
          {productData?.product_ratings?.length > 0 ? (
            productData.product_ratings.map((rating, index) => (
              <>
                <View
                  key={`review-${rating?._id || index}`}
                  style={{
                    padding: 15,
                    borderWidth: 1,
                    borderColor: "#e0e0e0",
                    borderRadius: 8,
                    marginBottom: 15,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    elevation: 2,
                  }}
                >
                  {/* Tên người đăng và số sao */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#000" }}>
                      {rating?.postedBy?.name || "Ẩn danh"}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      {[...Array(5)].map((_, i) => (
                        <AntDesign
                          key={`rating-star-${i}`}
                          name={i < rating?.star ? "star" : "staro"}
                          size={18}
                          color={i < rating?.star ? colors.yellow : "#ddd"}
                        />
                      ))}
                      <Text style={{ marginLeft: 4, color: "#666", fontSize: 14 }}>{`${rating?.star} sao`}</Text>
                    </View>
                  </View>
                  {/* Ngày đăng */}
                  <Text style={{ fontSize: 14, color: "#888", marginBottom: 10 }}>
                    Đã viết vào{" "}
                    <Text style={{ fontStyle: "italic" }}>
                      {new Date(rating?.postedAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </Text>
                  {/* Nội dung đánh giá */}
                  <Text style={{ fontSize: 16, color: "#333", lineHeight: 22 }}>
                    {rating?.comment || "Không có nhận xét."}
                  </Text>
                </View>
              </>
            ))
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#999", fontSize: 16 }}>Chưa có đánh giá nào cho sản phẩm này</Text>
            </View>
          )}

          {/* Ẩn toàn bộ phần review nếu vẫn đang kiểm tra */}
          {isCheckingOrder ? (
            <ActivityIndicator size="large" color={colors.teal} />
          ) : (
            isInOrder && <ProductReviewForm onSubmit={handleNewReview} />
          )}

        </View>

        <Text
          style={{
            height: 1,
            borderColor: "#D0D0D0",
            borderWidth: 1,
            marginVertical: 10,
          }}
        />

        {/* Danh sách sản phẩm đặc biệt */}
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>Sản phẩm đặc biệt</Text>
          <FlatList
            data={specialProducts}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            numColumns={2}
            renderItem={({ item }) => (
              <Pressable style={styles.card} onPress={() => navigation.navigate("Info", { id: item?._id })}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item?.product_images[0]?.url }} style={styles.image} />
                </View>
                <View style={styles.details}>
                  <Text style={styles.brand}>
                    {item?.product_brand?.map((brand) => brand?.title)?.join(" | ")}
                  </Text>
                  <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item?.product_name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <AntDesign name="star" size={20} color={colors.yellow} />
                      <Text style={{ marginLeft: 5, fontSize: 14, color: "#666" }}>
                        {item?.product_totalRating?.toFixed(1) || 0}/5
                      </Text>
                    </View>
                    {item?.product_sold !== 0 && (
                      <Text style={styles.sold}>Đã bán {item?.product_sold}</Text>
                    )}
                  </View>
                  <Text style={styles.price}>{item?.product_price.toLocaleString()}₫</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
      {(isLoadingProduct || isLoadingProducts) && <Loading />}
    </>
  );
};

const styles = {
  card: {
    width: "48%",
    margin: "1%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
  },
  imageContainer: {
    width: "100%",
    height: 150,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  details: {
    paddingVertical: 5,
  },
  brand: {
    fontSize: 12,
    color: "#777",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  sold: {
    fontSize: 12,
    color: "#555",
  },
  price: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
};

export default ProductInfoScreen;
