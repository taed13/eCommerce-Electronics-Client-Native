import React, { useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../feature/products/productSlice";
import { useNavigation } from "@react-navigation/native";

const HeaderSearchInput = () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productOtp, setProductOtp] = useState([]);
    const dispatch = useDispatch();
    const inputRef = useRef(null);
    const productState = useSelector((state) => state?.product?.product);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    useEffect(() => {
        if (productState?.length) {
            const formattedProducts = productState.map((product, index) => ({
                id: product._id,
                name: product.product_name,
            }));
            setProductOtp(formattedProducts);
        }
    }, [productState]);

    const handleSearch = (text) => {
        setQuery(text);
        if (text.trim() === "") {
            setFilteredProducts([]);
        } else {
            const results = productOtp.filter((item) =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredProducts(results);
        }
    };

    const handleClearInput = () => {
        setQuery(""); // Clear the input field
        setFilteredProducts([]); // Clear the filtered results
    };

    const handleSelectProduct = (product) => {
        setQuery(product.name);
        setFilteredProducts([]);
        navigation.navigate("Info", { id: product.id });
    };

    return (
        <View style={styles.container}>
            <Pressable style={styles.searchBox} onPress={() => { inputRef.current.focus(); }}>
                <AntDesign style={styles.icon} name="search1" size={20} color="black" />
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChangeText={handleSearch}
                />
                {query.length > 0 && (
                    <Pressable onPress={handleClearInput}>
                        <AntDesign style={styles.clearIcon} name="closecircle" size={20} color="gray" />
                    </Pressable>
                )}
            </Pressable>
            {filteredProducts.length > 0 && (
                <View style={styles.suggestionsBox}>
                    <FlatList
                        data={filteredProducts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.suggestionItem}
                                onPress={() => handleSelectProduct(item)}
                            >
                                <Text style={styles.suggestionText}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#131921",
        padding: 10,
        flexDirection: "column",
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 50,
        height: 40,
        flex: 1,
        paddingHorizontal: 10,
    },
    icon: {
        paddingRight: 5,
    },
    clearIcon: {
        paddingLeft: 5,
    },
    input: {
        fontSize: 16,
        flex: 1,
    },
    suggestionsBox: {
        width: "120%",
        height: Dimensions.get("window").height,
        backgroundColor: "white",
        elevation: 5,
        position: "absolute",
        top: 60,
        zIndex: 100,
    },
    suggestionItem: {
        padding: 13,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    suggestionText: {
        paddingHorizontal: 10,
        fontSize: 17,
        fontWeight: "600",
    },
});

export default HeaderSearchInput;
