import { useEffect, useState } from "react";
import { getCurrentUser, editUser, loginUserService, registerUserService, forgotPasswordService } from "./user.api";
import { useAxiosClient } from "../../providers/axiosProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { QUERY_KEYS } from "../../config/common";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  const axiosClient = useAxiosClient();

  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: () => getCurrentUser(axiosClient),
  });
};


// export const useGetCurrentUser = () => {
//   const axiosClient = useAxiosClient();

//   const [isLoading, setIsLoading] = useState(true);
//   const [data, setData] = useState({});
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!axiosClient) return;
//     const fetchCurrentUser = async () => {
//       try {
//         const result = await getCurrentUser(axiosClient);
//         if (result.data) {
//           setData(result.data || {});
//         } else {
//           setError(result.error || "Something went wrong");
//         }
//       } catch (error) {
//         setError(error.message || "An unexpected error occurred");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCurrentUser();
//   }, [axiosClient]);

//   return { data, isLoading, error };
// };

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
