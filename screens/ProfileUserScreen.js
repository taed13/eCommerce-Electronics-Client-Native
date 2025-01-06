import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View, StyleSheet, Alert, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../config/constants";
import Cell from "../components/Cell";
import Header from "../components/Header";
import { useGetCurrentUser, useUpdateUser, useUpdateAddress } from "../api/user";
import Loading from "../components/Loading";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from "@react-navigation/native";

const ProfileUser = () => {
  const { data, isLoading, error } = useGetCurrentUser();
  const currentUser = data?.data;
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || "");
  const [newEmail, setNewEmail] = useState(currentUser?.email || "");
  const { mutate: updateUser, isLoading: isUpdatingUser } = useUpdateUser();

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const { mutate: updateAddress, isLoading: isUpdatingAddress } = useUpdateAddress();

  useEffect(() => {
    const defaultAddress = currentUser?.addresses?.find((address) => address.default);
    if (defaultAddress?.mobileNo) setNewPhone(defaultAddress.mobileNo);
    if (currentUser?.name) setNewName(currentUser.name);
    if (currentUser?.email) setNewEmail(currentUser.email);
  }, [currentUser]);

  if (isLoading || isUpdatingUser || isUpdatingAddress) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tải được dữ liệu người dùng. Vui lòng thử lại sau.</Text>
      </View>
    );
  }

  const handleSaveName = () => {
    if (!newName.trim()) {
      Alert.alert("Lỗi", "Tên không được để trống.");
      return;
    }

    updateUser(
      { name: newName },
      {
        onSuccess: (updatedData) => {
          Alert.alert("Thành công", "Tên đã được cập nhật.");

          queryClient.setQueryData(['GET_CURRENT_USER'], (oldData) => ({
            ...oldData,
            data: { ...oldData.data, name: newName },
          }));

          setIsEditingName(false);
        },
        onError: () => {
          Alert.alert("Lỗi", "Không thể cập nhật tên.");
        },
      }
    );
  };

  const handleSaveEmail = () => {
    if (!validateEmail(newEmail)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    updateUser(
      { email: newEmail },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Email đã được cập nhật.");

          // Cập nhật dữ liệu trong cache
          queryClient.setQueryData(['GET_CURRENT_USER'], (oldData) => ({
            ...oldData,
            data: { ...oldData.data, email: newEmail },
          }));

          setIsEditingEmail(false);
        },
        onError: () => {
          Alert.alert("Lỗi", "Không thể cập nhật email.");
        },
      }
    );
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleChangeProfilePicture = () => {
    Alert.alert('Change Profile Picture', 'This feature is coming soon.');
  };

  const handleShowProfilePicture = () => {
    Alert.alert('Show Profile Picture', 'This feature is coming soon.');
  };

  const handleSavePhone = () => {
    if (!newPhone.trim()) {
      Alert.alert("Lỗi", "Số điện thoại không được để trống.");
      return;
    }

    const defaultAddress = currentUser?.addresses?.find((address) => address.default);
    if (!defaultAddress) {
      Alert.alert("Lỗi", "Không tìm thấy địa chỉ mặc định.");
      return;
    }

    updateAddress(
      { addressId: defaultAddress._id, addressData: { mobileNo: newPhone } },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Số điện thoại đã được cập nhật.");
          queryClient.setQueryData(['GET_CURRENT_USER'], (oldData) => ({
            ...oldData,
            data: {
              ...oldData.data,
              addresses: oldData.data.addresses.map((address) =>
                address._id === defaultAddress._id
                  ? { ...address, mobileNo: newPhone }
                  : address
              ),
            },
          }));
          setIsEditingPhone(false);
        },
        onError: () => {
          Alert.alert("Lỗi", "Không thể cập nhật số điện thoại.");
        },
      }
    );
  };

  return (
    <>
      <Header title='Hồ sơ' />

      <SafeAreaView style={styles.container}>
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.avatar} onPress={handleShowProfilePicture}>
            <Text style={styles.avatarLabel}>
              {currentUser?.name?.split(' ').map((name) => name.charAt(0)).join('') || "JD"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraIcon} onPress={handleChangeProfilePicture}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* User Info Cells */}
        <View style={styles.infoContainer}>
          {isEditingName ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên mới"
                value={newName}
                onChangeText={setNewName}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setIsEditingName(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveName} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Cell
              title='Tên'
              icon='person-outline'
              iconColor="black"
              subtitle={currentUser?.name || "Chưa thiết lập tên"}
              secondIcon='pencil-outline'
              onPress={() => setIsEditingName(true)}
              style={styles.cell}
            />
          )}

          {isEditingEmail ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập email mới"
                value={newEmail}
                onChangeText={setNewEmail}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setIsEditingEmail(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveEmail} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Cell
              title='Email'
              subtitle={currentUser?.email || "Chưa thiết lập email"}
              icon='mail-outline'
              iconColor="black"
              secondIcon='pencil-outline'
              onPress={() => setIsEditingEmail(true)}
              style={styles.cell}
            />
          )}

          {isEditingPhone ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại mới"
                value={newPhone}
                keyboardType="phone-pad"
                onChangeText={setNewPhone}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setIsEditingPhone(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSavePhone} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Cell
              title='Số điện thoại'
              subtitle={currentUser?.addresses?.find((address) => address.default)?.mobileNo || "Chưa thiết lập số điện thoại"}
              icon='call-outline'
              iconColor="black"
              secondIcon='pencil-outline'
              onPress={() => setIsEditingPhone(true)}
              style={styles.cell}
            />
          )}

          {/* <Cell
            title='Số điện thoại'
            subtitle={currentUser?.addresses?.find((address) => address.default)?.mobileNo || "Chưa thiết lập số điện thoại"}
            icon='call-outline'
            iconColor="black"
            secondIcon='pencil-outline'
            onPress={handleSavePhone}
            style={styles.cell}
          /> */}

          <Cell
            title="Address"
            subtitle={
              currentUser?.addresses?.find((address) => address.default)?.street +
              ", " +
              currentUser?.addresses?.find((address) => address.default)?.ward?.full_name +
              ", " +
              currentUser?.addresses?.find((address) => address.default)?.district?.full_name +
              ", " +
              currentUser?.addresses?.find((address) => address.default)?.province?.name ||
              "Chưa thiết lập địa chỉ"
            }
            icon="location-outline"
            iconColor="black"
            secondIcon="pencil-outline"
            onPress={() => navigation.navigate("Address")}
            style={styles.cell}
          />

          <Cell
            title='About'
            subtitle='Available'
            icon='information-circle-outline'
            iconColor="black"
            secondIcon='pencil-outline'
            onPress={() => navigation.navigate("Address")}
            style={styles.cell}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  infoContainer: {
    marginTop: 40,
    width: '90%',
  },
  cell: {
    marginBottom: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 0.5,
  },
  editContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileUser;
