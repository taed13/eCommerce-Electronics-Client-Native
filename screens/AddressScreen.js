import React, { useEffect, useState, useContext } from "react";
import { Text, View, ScrollView, TextInput, Pressable, Alert, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { UserType } from "../UserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { APP_CONFIG } from "../config/common";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useSaveAddress } from "../api/user";

const AddressScreen = () => {
  const navigation = useNavigation();
  const { mutate: saveAddress, isLoading, error } = useSaveAddress();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [province, setProvince] = useState({ id: "", name: "" });
  const [district, setDistrict] = useState({ id: "", full_name: "" });
  const [ward, setWard] = useState({ id: "", full_name: "" });
  const [street, setStreet] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [token, setToken] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [openProvince, setOpenProvince] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [mobileNoError, setMobileNoError] = useState("");
  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [wardError, setWardError] = useState("");
  const [streetError, setStreetError] = useState("");

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

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
      if (response.data.error === 0) {
        setProvinces(
          response.data.data.map((province) => ({
            label: province.name,
            value: province.id,
            key: province.id,
          }))
        );
        setDistricts([]);
        setWards([]);
      } else {
        console.error("Error fetching provinces:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }

    try {
      const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
      if (response.data.error === 0) {
        setDistricts(
          response.data.data.map((district) => ({
            label: district.full_name,
            value: district.id,
            key: district.id,
          }))
        );
        setWards([]);
      } else {
        console.error("Error fetching districts:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    if (!districtId) {
      setWards([]);
      return;
    }

    try {
      const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      if (response.data.error === 0) {
        setWards(
          response.data.data.map((ward) => ({
            label: ward.full_name,
            value: ward.id,
            key: ward.id,
          }))
        );
      } else {
        console.error("Error fetching wards:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleAddAddress = () => {
    let valid = true;

    if (!firstname.trim()) {
      setFirstnameError("Vui lòng nhập Họ");
      valid = false;
    } else {
      setFirstnameError("");
    }

    if (!lastname.trim()) {
      setLastnameError("Vui lòng nhập Tên");
      valid = false;
    } else {
      setLastnameError("");
    }

    if (!mobileNo.trim()) {
      setMobileNoError("Vui lòng nhập Số điện thoại");
      valid = false;
    } else {
      setMobileNoError("");
    }

    if (!province.id) {
      setProvinceError("Vui lòng chọn tỉnh/thành phố");
      valid = false;
    } else {
      setProvinceError("");
    }

    if (!district.id) {
      setDistrictError("Vui lòng chọn quận/huyện");
      valid = false;
    } else {
      setDistrictError("");
    }

    if (!ward.id) {
      setWardError("Vui lòng chọn phường/xã");
      valid = false;
    } else {
      setWardError("");
    }

    if (!street.trim()) {
      setStreetError("Vui lòng nhập tên đường, tòa nhà, số nhà");
      valid = false;
    } else {
      setStreetError("");
    }

    if (!valid) return;

    const address = {
      firstname,
      lastname,
      mobileNo,
      province,
      district,
      ward,
      street,
      default: false,
    };

    saveAddress({ address }, {
      onSuccess: () => {
        console.log("Address saved successfully!");
        Alert.alert("Success", "Thêm địa chỉ thành công");
        setFirstname("");
        setLastname("");
        setMobileNo("");
        setProvince({ id: "", name: "" });
        setDistrict({ id: "", full_name: "" });
        setWard({ id: "", full_name: "" });
        setStreet("");

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" && 0}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerText}>Địa chỉ của tôi</Text>
      </View>
      <ScrollView style={styles.scrollView}>

        <View style={styles.container}>
          <Text style={styles.title}>Thêm địa chỉ mới</Text>

          <Text style={styles.label}>Họ và tên</Text>
          <View style={{ flexDirection: "row", width: "100%", gap: 10 }}>
            <View style={styles.nameInputContainer}>
              <TextInput
                value={firstname}
                onChangeText={(text) => {
                  setFirstname(text);
                  if (text.trim()) {
                    setFirstnameError("");
                  }
                }}
                placeholderTextColor={"#888"}
                style={styles.input}
                placeholder="Họ"
              />
              {firstnameError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12 }}>{firstnameError}</Text> : null}
            </View>

            <View style={styles.nameInputContainer}>
              <TextInput
                value={lastname}
                onChangeText={(text) => {
                  setLastname(text);
                  if (text.trim()) {
                    setLastnameError("");
                  }
                }}
                placeholderTextColor={"#888"}
                style={styles.input}
                placeholder="Tên"
              />
              {lastnameError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12 }}>{lastnameError}</Text> : null}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              value={mobileNo}
              onChangeText={(text) => {
                setMobileNo(text);
                if (text.trim()) {
                  setMobileNoError("");
                }
              }}
              placeholderTextColor={"#888"}
              style={styles.input}
              placeholder="Nhập số điện thoại đủ 11 số"
            />
            {mobileNoError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12 }}>{mobileNoError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tỉnh/Thành phố</Text>
            <DropDownPicker
              open={openProvince}
              value={province.id || null}
              items={provinces}
              setOpen={setOpenProvince}
              setValue={(callback) => {
                const id = callback(province.id);
                const selectedProvince = provinces.find((p) => p.value === id);
                setProvince(selectedProvince ? { id: selectedProvince.value, name: selectedProvince.label } : { id: "", name: "" });
                setDistrict({ id: "", full_name: "" });
                setWard({ id: "", full_name: "" });
                fetchDistricts(id);
              }}
              setItems={setProvinces}
              placeholder="Chọn Tỉnh/Thành"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
              onChangeValue={(id) => fetchDistricts(id)}
              onOpen={() => {
                setOpenDistrict(false);
                setOpenWard(false);
              }}
            />
            {provinceError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12, marginHorizontal: 3, fontSize: 12 }}>{provinceError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quận/Huyện</Text>
            <DropDownPicker
              open={openDistrict}
              value={district.id || null}
              items={districts}
              setOpen={setOpenDistrict}
              setValue={(callback) => {
                const id = callback(district.id);
                const selectedDistrict = districts.find((d) => d.value === id);
                setDistrict(selectedDistrict ? { id: selectedDistrict.value, full_name: selectedDistrict.label } : { id: "", full_name: "" });
                setWard({ id: "", full_name: "" });
                fetchWards(id);
              }}
              setItems={setDistricts}
              placeholder="Chọn Quận/Huyện"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              disabled={!province.id}
              zIndex={2000}
              zIndexInverse={2000}
              onOpen={() => {
                setOpenProvince(false);
                setOpenWard(false);
              }}
            />
            {districtError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12 }}>{districtError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phường/Xã</Text>
            <DropDownPicker
              open={openWard}
              value={ward.id || null}
              items={wards}
              setOpen={setOpenWard}
              setValue={(callback) => {
                const id = callback(ward.id);
                const selectedWard = wards.find((w) => w.value === id);
                setWard(selectedWard ? { id: selectedWard.value, full_name: selectedWard.label } : { id: "", full_name: "" });
              }}
              setItems={setWards}
              placeholder="Chọn Phường/Xã"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              disabled={!district.id}
              zIndex={1000}
              zIndexInverse={3000}
              onOpen={() => {
                setOpenProvince(false);
                setOpenDistrict(false);
              }}
            />
            {wardError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12 }}>{wardError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tên đường, tòa nhà, số nhà</Text>
            <TextInput
              value={street}
              onChangeText={(text) => {
                setStreet(text);
                if (text.trim()) {
                  setStreetError("");
                }
              }}
              placeholderTextColor={"#888"}
              style={styles.input}
              placeholder="Nhập tên đường, tòa nhà, số nhà"
            />
            {streetError ? <Text style={{ color: "red", marginTop: 5, marginHorizontal: 3, fontSize: 12 }}>{streetError}</Text> : null}
          </View>

          <Pressable onPress={handleAddAddress} style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  header: {
    marginTop: 47,
    height: 60,
    backgroundColor: "#131921",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 10,
    position: "absolute",
    left: 5,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    marginBottom: 20,
  },
  nameInputContainer: {
    width: "48.6%",
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    padding: 12,
    fontSize: 17,
    borderColor: "#777",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 8,
  },
  dropdown: {
    borderRadius: 8,
    borderColor: "#777",
    marginTop: 10,
    backgroundColor: "#fff",
    fontSize: 22,
  },
  dropdownContainer: {
    borderColor: "#777",
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#FFC72C",
    padding: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

export default AddressScreen;