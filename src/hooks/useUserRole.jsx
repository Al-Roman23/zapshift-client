// Custom Hook To Fetch User Role From Server
import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useUserRole = () => {
  const { user, loading } = useAuth();
  const axios = useAxios();

  const {
    data: role = "user",
    isLoading: isRoleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const response = await axios.get(`/users/${user.email}/role`);
      return response.data.role;
    },
  });

  return { role, isRoleLoading, refetch };
};

export default useUserRole;
