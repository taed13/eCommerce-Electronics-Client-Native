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
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome,
  EvilIcons,
  Entypo,
  Octicons,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import RenderHtml from "react-native-render-html";

import Loading from "../components/Loading";
import ProductReviewForm from "../components/ProductReviewForm";

import { colors } from "../constants/color";

import { useFetchProduct, useFetchProducts, useFetchSpecialProducts } from "../api/product";
import { useCheckProductInOrder } from "../api/order";
import { useAddToCart } from "../api/cart";
import { useGetCurrentUser } from "../api/user";
import HeaderSearchInput from "../components/HeaderSearchInput";
import { fontSize } from "../constants/dimensions";

const ProductInfoScreen = () => {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const { data: currentUserData } = useGetCurrentUser();
  const currentUser = currentUserData?.data;

  const [reviews, setReviews] = useState([]);
  const [isInOrder, setIsInOrder] = useState(null);
  const [isCheckingOrder, setIsCheckingOrder] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const { data: specialProducts, isLoading: isLoadingSpecial } = useFetchSpecialProducts();

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
      price: productData?.product_after_price > 0 ? productData?.product_after_price : productData?.product_price,
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

  const { displayPrice, discountText } = useMemo(() => {
    let displayPrice = productData?.product_price || null;
    let discountText = "";

    if (productData?.discount) {
      if (productData.discount.discount_type === "percentage") {
        displayPrice = productData.product_price - (productData.product_price * productData.discount.discount_value / 100);
        discountText = `-${productData.discount.discount_value}%`;
      } else if (productData.discount.discount_type === "fixed_amount") {
        displayPrice = productData.product_price - productData.discount.discount_value;
        discountText = `-${productData?.discount?.discount_value?.toLocaleString()}₫`;
      }
    }

    return { displayPrice, discountText };
  }, [productData]);

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <HeaderSearchInput />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {productData?.product_images?.map((item, index) => (
            <ImageBackground
              style={[styles.imageBackground, { width, height }]}
              source={{ uri: item.url || "https://cdn4.iconfinder.com/data/icons/refresh_cl/256/System/Box_Empty.png" }}
              key={index}
            >
              <View style={styles.imageBackgroundInner}>
                <View style={styles.shareIconContainer}>
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

        <View style={styles.deliveryContainer}>
          <Octicons name="location" size={24} color="black" style={{ marginHorizontal: 5 }} />
          <Text style={styles.deliveryText} numberOfLines={1} ellipsizeMode="tail">
            Giao hàng đến
            {defaultAddress ? (
              <Text style={styles.defaultAddress}>
                {` ${defaultAddress.ward?.full_name}, ${defaultAddress.district?.full_name}, ${defaultAddress.province?.name}`}
              </Text>
            ) : (
              <Text style={styles.noDefaultAddress}> Chưa có địa chỉ mặc định</Text>
            )}
          </Text>
        </View>

        {/* Product Details */}
        <View style={styles.productDetailsContainer}>
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.productName}>
              {productData?.product_name || "Tên sản phẩm không có"}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
              {productData?.discount && (
                <Text style={{ fontSize: 36, color: "red" }}>
                  {discountText}
                </Text>
              )}
              <Text style={styles.productPrice}>
                ₫{displayPrice?.toLocaleString() || "0"}
              </Text>
            </View>
            {
              productData?.discount && (
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 5, fontSize: 18 }}>
                  <Text style={{}}>Giá gốc: </Text>
                  <Text style={styles.oldProductPrice}>
                    ₫{productData?.product_price?.toLocaleString() || "0"}
                  </Text>
                </View>
              )
            }
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{productData?.product_totalRating}</Text>
            <AntDesign name="star" size={20} color={colors.yellow} />
            <Text style={styles.ratingCount}>({productData?.product_ratings?.length} đánh giá)</Text>
          </View>
          <Text style={styles.divider} />

          <View style={styles.productInfoRow}>
            <Text style={styles.productInfoLabel}>Hãng: </Text>
            <Text style={styles.productInfoValue}>
              {productData?.product_brand?.length
                ? productData.product_brand
                  .map((brand) => brand.title)
                  .join(" | ")
                : "N/A"}
            </Text>
          </View>

          <View style={styles.productInfoRow}>
            <Text style={styles.productInfoLabel}>Danh mục: </Text>
            <Text style={styles.productInfoValue}>
              {productData?.product_category?.length
                ? productData.product_category
                  .map((category) => category.title)
                  .join(" | ")
                : "N/A"}
            </Text>
          </View>

          <View style={styles.productInfoRow}>
            <Text style={styles.productInfoLabel}>Tag sản phẩm: </Text>
            <Text style={styles.productInfoValue}>
              {productData?.product_tags?.length
                ? productData.product_tags.map((tag) => tag.name).join(" | ")
                : "N/A"}
            </Text>
          </View>

          <View style={styles.productInfoRow}>
            <Text style={styles.productInfoLabel}>Trạng thái: </Text>
            <Text style={[styles.productStatus, { color: productData.product_quantity > 0 ? "green" : "red" }]}>
              {productData?.product_quantity > 0
                ? "CÒN HÀNG" +
                " - " +
                productData?.product_quantity +
                " sản phẩm"
                : "HẾT HÀNG"}
            </Text>
          </View>

          {/* Color Options */}
          <View style={styles.productColorRow}>
            <Text style={styles.productInfoLabel}>Màu:</Text>
            <View style={styles.colorOptionsContainer}>
              {productData?.product_color?.length > 0 ? (
                productData.product_color.map((color, index) => (
                  <TouchableOpacity
                    key={color.code}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorOption,
                      {
                        backgroundColor: color.code,
                        borderWidth: selectedColor?.code === color.code ? 2 : 1,
                        borderColor: selectedColor?.code === color.code ? "#333" : "#ddd",
                      },
                    ]}
                  />
                ))
              ) : (
                <Text>Không có màu sắc</Text>
              )}
            </View>
          </View>

          <View style={[styles.productColorRow, { marginVertical: 10 }]}>
            <Text style={styles.productInfoLabel}>Số lượng: </Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              maxLength={productData?.product_quantity}
            />
          </View>

          <View style={styles.shippingInfoContainer}>
            <Text style={styles.productInfoLabel}>Vận chuyển & Đổi trả:</Text>
            <Text style={{ fontSize: 18 }}>
              Miễn phí vận chuyển và đổi trả cho tất cả các đơn hàng!
            </Text>
            <Text style={{ fontSize: 18 }}>
              Chúng tôi vận chuyển tất cả các đơn hàng nội địa Việt Nam trong
              vòng{" "}
              <Text style={styles.boldText}>5-10 ngày làm việc!</Text>
            </Text>
          </View>

          <View style={styles.productDescriptionContainer}>
            <TouchableOpacity onPress={toggleShowMore} activeOpacity={0.8}>
              <View style={{ fontSize: 18 }}>
                {showMore ? (
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: htmlContent }}
                  />
                ) : (
                  <RenderHtml
                    contentWidth={width}
                    source={{ html: htmlContent }}
                    baseStyle={styles.productDescription}
                  />
                )}
              </View>
              <Text style={styles.toggleDescriptionText}>
                {showMore ? "Thu gọn" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Pressable
          onPress={handleAddToCart}
          disabled={isLoadingAddToCart || productData?.product_quantity === 0}
          style={[
            styles.addToCartButton,
            {
              backgroundColor:
                productData?.product_quantity === 0
                  ? "#ccc"
                  : isLoadingAddToCart
                    ? "#ddd"
                    : "#FFC72C",
            },
          ]}
        >
          <Text style={styles.addToCartButtonText}>
            {productData?.product_quantity === 0
              ? "Hết hàng"
              : isLoadingAddToCart
                ? "Đang thêm vào giỏ hàng..."
                : "Thêm vào giỏ hàng"}
          </Text>
        </Pressable>

        <Text style={styles.divider} />

        {/* Product Reviews */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>
            Đánh giá sản phẩm
          </Text>
          {/* Đánh giá tổng quát */}
          <View style={styles.overallRatingContainer}>
            <View style={styles.starsContainer}>
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

            <Text style={styles.overallRatingText}>
              {+productData?.product_totalRating || 0} trên 5
            </Text>
            <Text style={styles.overallRatingCount}>
              (Dựa trên {productData?.product_ratings?.length || 0} đánh giá)
            </Text>
          </View>

          {/* Danh sách đánh giá chi tiết */}
          {productData?.product_ratings?.length > 0 ? (
            productData.product_ratings.map((rating, index) => (
              <View
                key={`review-${rating?._id || index}`}
                style={styles.reviewCard}
              >
                {/* Tên người đăng và số sao */}
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>
                    {rating?.postedBy?.name || "Ẩn danh"}
                  </Text>
                  <View style={styles.reviewStarsContainer}>
                    {[...Array(5)].map((_, i) => (
                      <AntDesign
                        key={`rating-star-${i}`}
                        name={i < rating?.star ? "star" : "staro"}
                        size={18}
                        color={i < rating?.star ? colors.yellow : "#ddd"}
                      />
                    ))}
                    <Text style={styles.reviewStarCount}>{`${rating?.star} sao`}</Text>
                  </View>
                </View>
                {/* Ngày đăng */}
                <Text style={styles.reviewDate}>
                  Đã viết vào{" "}
                  <Text style={styles.italicText}>
                    {new Date(rating?.postedAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </Text>
                {/* Nội dung đánh giá */}
                <Text style={styles.reviewComment}>
                  {rating?.comment || "Không có nhận xét."}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noReviewsContainer}>
              <Text style={styles.noReviewsText}>Chưa có đánh giá nào cho sản phẩm này</Text>
            </View>
          )}

          {/* Ẩn toàn bộ phần review nếu vẫn đang kiểm tra */}
          {isCheckingOrder ? (
            <ActivityIndicator size="large" color={colors.teal} />
          ) : (
            isInOrder && <ProductReviewForm onSubmit={handleNewReview} />
          )}

        </View>

        <Text style={styles.divider} />

        {/* Danh sách sản phẩm đặc biệt */}
        <View style={styles.specialProductsContainer}>
          <Text style={styles.specialProductsTitle}>Sản phẩm đặc biệt</Text>
          <FlatList
            data={specialProducts?.data?.slice(0, 4)}
            keyExtractor={(item, index) => `${item._id}-${index}`}
            numColumns={2}
            renderItem={({ item }) => (
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
            )}
          />
        </View>
      </ScrollView>
      {(isLoadingProduct || isLoadingProducts) && <Loading />}
    </>
  );
};

const styles = {
  scrollView: {
    marginTop: 47,
    flex: 1,
    backgroundColor: "white",
  },
  imageBackground: {
    marginTop: 25,
    resizeMode: "contain",
  },
  imageBackgroundInner: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shareIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  deliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  defaultAddress: {
    fontSize: 16,
    color: "green",
  },
  noDefaultAddress: {
    color: "red",
  },
  productDetailsContainer: {
    padding: 10,
  },
  productName: {
    fontSize: 26,
    fontWeight: "normal",
  },
  productPrice: {
    fontSize: 36,
    color: "black",
    marginTop: 6,
  },
  oldProductPrice: {
    fontSize: 20,
    textDecorationLine: "line-through",
    color: "#777",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 15,
  },
  ratingCount: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginVertical: 10,
  },
  productInfoRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 5,
    marginBottom: 5,
  },
  productColorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
  productInfoLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productInfoValue: {
    fontSize: 18,
  },
  productStatus: {
    fontWeight: "bold",
  },
  colorOptionsContainer: {
    flexDirection: "row",
    gap: 5,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 5,
    borderRadius: 5,
    height: 40,
    width: 70,
    fontSize: 18,
    textAlign: "center",
  },
  shippingInfoContainer: {
    flexDirection: "column",
    gap: 5,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  productDescriptionContainer: {
    flexDirection: "column",
    marginBottom: 5,
  },
  productDescription: {
    maxHeight: 100,
    overflow: "hidden",
  },
  toggleDescriptionText: {
    color: "#007bff",
    marginTop: 5,
    textAlign: "right",
  },
  addToCartButton: {
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  addToCartButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  reviewsContainer: {
    padding: 10,
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  overallRatingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  overallRatingText: {
    fontSize: 16,
    color: "#666",
  },
  overallRatingCount: {
    fontSize: 14,
    color: "#999",
  },
  reviewCard: {
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
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000",
  },
  reviewStarsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewStarCount: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  reviewDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  italicText: {
    fontStyle: "italic",
  },
  reviewComment: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  noReviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginTop: 10,
  },
  noReviewsText: {
    color: "#999",
    fontSize: 16,
  },
  specialProductsContainer: {
    padding: 10,
  },
  specialProductsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
  ratingInnerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sold: {
    fontSize: 12,
    color: "#555",
  },
  price: {
    fontSize: 20,
    color: "green",
    fontWeight: "semi-bold",
  },
};

export default ProductInfoScreen;
