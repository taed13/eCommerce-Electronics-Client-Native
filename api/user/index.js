import { useState } from "react";
import { getCurrentUser, editUser, loginUserService, registerUserService, forgotPasswordService, setDefaultAddressService, updateAddressService, deleteAddressService, saveAddressService } from "./user.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { QUERY_KEYS, MUTAION_KEYS } from "../../config/common";
import { useQuery, useMutation } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => getCurrentUser(axiosClient),
  });
};

export const useUpdateUser = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const updateUser = async (updatedUserData) => {
    setIsLoading(true);
    try {
      const response = await editUser(axiosClient, updatedUserData);
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUser, isLoading, data, error };
}

export const useLogin = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const login = async (userData) => {
    setIsLoading(true);
    try {
      const response = await loginUserService(axiosClient, userData);
      if (response?.data?.findUser?.token) {
        await AsyncStorage.setItem("authToken", response.data.findUser.token);
      }
      setData(response.data);
      return response.data;
    } catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, data, error };
}

export const useLogout = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      console.log("Auth token cleared");
      navigation.replace("Login");
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      return { success: false, error: error.message || "Failed to logout" };
    }
  };

  return { logout };
};

export const useRegister = () => {
  const axiosClient = useAxiosClient();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await registerUserService(axiosClient, userData);
      setData(response.data);
      return response.data;
    }
    catch (error) {
      setError(error.message || "An unexpected error occurred");
      return null;
    }
    finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, data, error };
}

export const useForgotPassword = () => {
  const axiosClient = useAxiosClient();
  const [isLoading, setIsLoading] = useState(false);

  const sendForgotPasswordEmail = async (userData) => {
    setIsLoading(true);
    try {
      const response = await forgotPasswordService(axiosClient, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  };

  return { sendForgotPasswordEmail, isLoading };
};

export const useSetDefaultAddress = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.SET_DEFAULT_ADDRESS],
    mutationFn: (addressId) => setDefaultAddressService(axiosClient, addressId),
    onError: (error) => {
      console.error("Failed to set default address:", error.message);
    },
  });
};

export const useUpdateAddress = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.UPDATE_ADDRESS],
    mutationFn: ({ addressId, addressData }) =>
      updateAddressService(axiosClient, addressId, addressData),
    onError: (error) => {
      console.error("Failed to update address:", error.message);
    },
  });
};

export const useDeleteAddress = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.DELETE_ADDRESS],
    mutationFn: (addressId) => deleteAddressService(axiosClient, addressId),
    onError: (error) => {
      console.error("Failed to delete address:", error.message);
    },
  });
};

export const useSaveAddress = () => {
  const axiosClient = useAxiosClient();

  return useMutation({
    mutationKey: [MUTAION_KEYS.SAVE_ADDRESS],
    mutationFn: ({ address }) => saveAddressService(axiosClient, address),
    onError: (error) => {
      console.error("Failed to save address:", error.message);
    },
  });
};