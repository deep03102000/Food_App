import { CartState } from "@/types/cartType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem._id == item._id
          );

          if (existingItem) {
            // If the item is already in the cart, increment the quantity
            return {
              cart: state.cart.map((cartItem) =>
                cartItem._id == item._id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          } else {
            // If the item is not in the cart, add it with an initial quantity of 1
            return {
              cart: [...state.cart, { ...item, quantity: 1 }],
            };
          }
        });
      },
      clearCart: () => {
        set({ cart: [] });
      },
      removeFromTheCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        }));
      },
      incrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id
              ? {
                  ...item,
                  quantity:
                    item.quantity < 15 ? item.quantity + 1 : item.quantity,
                }
              : item
          ),
        }));
      },

      decrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id == id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }));
      },
    }),
    {
      name: "cart-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
