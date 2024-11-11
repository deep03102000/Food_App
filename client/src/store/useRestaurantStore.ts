import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { MenuItem, RestaurantState } from "@/types/restaurantType";
import { Orders } from "@/types/orderType";

const API_END_POINT = "http://localhost:8000/api/v1/restaurant";
axios.defaults.withCredentials = true;

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      searchedRestaurant: null,
      appliedFilter: [],
      singleRestaurant: null,
      restaurantOrders: [],
      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, restaurant: response.data.restaurant });
          }
        } catch (error: any) {
          console.error("Error creating restaurant:", error);
          toast.error(
            error.response?.data?.message || "Failed to create restaurant."
          );
          set({ loading: false });
        }
      },

      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`);
          if (response.data.success) {
            set({ loading: false, restaurant: response.data.restaurant });
          }
        } catch (error: any) {
          console.error("Error fetching restaurant:", error);
          toast.error(
            error.response?.data?.message || "Failed to fetch restaurant."
          );
          set({ loading: false, restaurant: null });
        }
      },

      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(`${API_END_POINT}/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, restaurant: response.data.restaurant });
          }
        } catch (error: any) {
          console.error("Error updating restaurant:", error);
          toast.error(
            error.response?.data?.message || "Failed to update restaurant."
          );
          set({ loading: false });
        }
      },
      searchRestaurant: async (
        searchText: string,
        searchQuery: string,
        selectedCuisines: any
      ) => {
        try {
          set({ loading: true });

          const params = new URLSearchParams();
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));

          //  await new Promise((resolve) => setTimeout(resolve, 1500));
          const response = await axios.get(
            `${API_END_POINT}/search/${searchText}?${params.toString()}`
          );
          if (response.data.success) {
            console.log(response.data);
            set({ loading: false, searchedRestaurant: response.data });
          }
        } catch (error: any) {
          console.error("Error searching restaurant:", error);
          set({ loading: false });
        }
      },

      addMenuToRestaurant: (menu: MenuItem) => {
        set((state) => ({
          restaurant: state.restaurant
            ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] }
            : null,
        }));
      },

      updateMenuToRestaurant: (updatedMenu: MenuItem) => {
        set((state) => {
          if (state.restaurant) {
            const updatedMenus = state.restaurant.menus.map((menu) =>
              menu._id === updatedMenu._id ? updatedMenu : menu
            );
            return { restaurant: { ...state.restaurant, menus: updatedMenus } };
          }
          return state;
        });
      },
      setAppliedFilter: (value: string) => {
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied
            ? state.appliedFilter.filter((item) => item !== value)
            : [...state.appliedFilter, value];
          return { appliedFilter: updatedFilter };
        });
      },
      setResetFilter: () => {
        set({ appliedFilter: [] });
      },
      getSingleRestaurant: async (restaurantId: string) => {
        try {
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`);
          if (response.data.success) {
            set({ singleRestaurant: response.data.restaurant });
          }
        } catch (error) {
          console.error("Error getting single restaurant:", error);
        }
      },
      getRestaurantOrders: async () => {
        try {
          const response = await axios.get(`${API_END_POINT}/order`);
          if (response.data.success) {
            set({ restaurantOrders: response.data.orders });
          }
        } catch (error) {
          console.log("Error fetching restaurant orders:", error);
        }
      },
      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/order/${orderId}/status`,
            { status },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            const updatedOrder = get().restaurantOrders.map((order: Orders) => {
              return order._id == orderId
                ? { ...order, status: response.data.status }
                : order;
            });
            set({ restaurantOrders: updatedOrder });
            toast.success(response.data.message);
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "restaurant-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
