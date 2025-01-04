import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { useFetchProduct } from "../api/product";
import Loading from "../components/Loading";
import { colors } from "../constants/color";
import RenderHtml from "react-native-render-html";

const ProductInfoScreen = () => {
  const currentUser = useSelector((state) => state?.user?.currentUser);
  const defaultAddress = currentUser?.addresses?.find(
    (address) => address.default === true
  );
  const route = useRoute();
  const productId = route.params?.id;

  const { isLoading, data: productData, fetchProduct } = useFetchProduct();

  const fetchProductData = async () => {
    await fetchProduct(productId);

    console.log("Product Data: ", productData);
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const { width } = Dimensions.get("window");
  const htmlContent =
    productData?.product_description || "<p>Không có mô tả</p>";

  // const navigation = useNavigation();
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);

  const height = (width * 100) / 100;
  const dispatch = useDispatch();
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  };
  const cart = useSelector((state) => state.cart.cart);
  console.log(cart);

  const handleQuantityChange = (value) => {
    let parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) parsedValue = 1;
    if (parsedValue < 1) parsedValue = 1;
    if (parsedValue > 10) parsedValue = 10;
    setQuantity(parsedValue);
  };

  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <>
      <ScrollView
        style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}
        showsVerticalScrollIndicator={false}
      >
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
            <AntDesign
              style={{ paddingLeft: 10 }}
              name="search1"
              size={22}
              color="black"
            />
            <TextInput placeholder="Tìm kiếm sản phẩm..." />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {productData?.product_images?.map((item, index) => (
            <ImageBackground
              style={{ width, height, marginTop: 25, resizeMode: "contain" }}
              source={{ uri: item.url }}
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

          <Text style={{ fontSize: 15, fontWeight: "500" }}>
            Vận chuyển đến
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
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>
            {productData?.product_name || "Tên sản phẩm không có"}
          </Text>
          <Text style={{ fontSize: 18, color: "green", marginTop: 6 }}>
            ₫{productData?.product_price?.toLocaleString() || "0"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text>{productData?.product_totalRating}</Text>
            <AntDesign name="star" size={16} color={colors.yellow} />
            <Text>({productData?.product_ratings?.length} đánh giá)</Text>
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
            <View style={{ flexDirection: "row", gap: 10 }}>
              {productData?.product_color?.length > 0 ? (
                productData.product_color.map((color, index) => (
                  <View
                    key={index}
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: color.code || "#ddd",
                      borderRadius: 15,
                      borderWidth: 1,
                      borderColor: "#ddd",
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
              onChangeText={(text) => handleQuantityChange(text)}
              keyboardType="numeric"
              maxLength={3}
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
          onPress={addItemToCart}
          style={{
            backgroundColor: addedToCart ? "#90EE90" : "#FFC72C",
            padding: 15,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {addedToCart ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
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

          {productData?.product_ratings?.length > 0 ? (
            productData.product_ratings.map((rating, index) => (
              <View
                key={index}
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
                        key={i}
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
        </View>
      </ScrollView>
      {isLoading && <Loading />}
    </>
  );
};

export default ProductInfoScreen;
