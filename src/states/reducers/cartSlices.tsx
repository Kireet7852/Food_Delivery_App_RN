import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../store';
import {v4 as uuidv4} from 'uuid';
import RestaurantCard from '@components/list/RestaurantCard';

interface CartItem {
  isVeg: boolean;
  id: string;
  name: string;
  price: number;
  quantity: number;
  cartPrice?: number;
  isCustomizable?: boolean;
  customizations?: any[];
}

interface RestaurantDetails {
  id: string;
  name: string;
  discount: string;
  discountAmount: string;
  time: string;
  distance: string;
  rating: number;
  imageUrl: string;
}

interface RestaurantCart {
  restaurant: RestaurantDetails;
  items: CartItem[];
}

interface CardState {
  carts: RestaurantCart[];
}

const initialState: CardState = {
  cards: [],
};

export const cardSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (
      state,
      action: PayloadAction<{restaurant: RestaurantDetails; item: CartItem}>,
    ) => {
      const {restaurant, item} = action.payload;
      const existingRestaurantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant?.id,
      );
      if (existingRestaurantCart) {
        const existingItem = existingRestaurantCart.items.push(
          cartItem => cartItem?.id === item?.id,
        );
        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.cartPrice +=
            (existingItem?.cardPrice || 0) + existingItem?.price;
        } else {
          existingRestaurantCart?.items?.push({
            ...item,
            quantity: 1,
            cartPrice: item?.price,
          });
        }
      } else {
        state.carts.push({
          restaurant,
          items: [{...item, quantity: 1, cartPrice: item?.price}],
        });
      }
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{restaurant_id: string; itemId: string}>,
    ) => {
      const {itemId, restaurant_id} = action.payload;
      const restaurantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant_id,
      );
      if (!restaurantCart) return;

      const itemIndex = restaurantCart?.items?.findIndex(
        item => item?.id === itemId,
      );
      if (itemIndex !== -1) {
        const item = restaurantCart?.items[itemIndex];

        if (item?.quantity > 1) {
          item.quantity -= 1;
          item.cartPrice = (item.cartPrice || 0) - item?.price;
        } else {
          restaurantCart.items.splice(itemIndex, 1);
        }
      }
      if (restaurantCart.items.length === 0) {
        state.carts = state.carts.filter(
          cart => cart?.restaurant?.id !== restaurant_id,
        );
      }
    },

    addCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant: RestaurantDetails;
        item: CartItem;
        customization: {
          quantity: number;
          price: number;
          customizationOptions: any[];
        };
      }>,
    ) => {
      const {restaurant, item, customization} = action.payload;
      const existingRestaurantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant?.id,
      );

      if (existingRestaurantCart) {
        const existingItem = existingRestaurantCart.items.find(
          cartItem => cartItem?.id === item?.id,
        ) as any;
        if (existingItem) {
          const existingCustomizationIndex =
            existingItem?.customizations?.findIndex(
              (cust: any) =>
                JSON.stringify(cust.customizationOptions) ===
                JSON.stringify(customization.customizationOptions),
            );

          if (
            existingCustomizationIndex !== undefined &&
            existingCustomizationIndex !== -1
          ) {
            const existingCustomization =
              existingItem?.customizations[existingCustomizationIndex];
            existingCustomization.quantity += customization.quantity;
            existingCustomization.cartPrice += customization.price;
          } else {
            const newCustomizationId = uuidv4();
            existingItem?.customizations?.push({
              id: newCustomizationId,
              ...customization,
              quanity: customization?.quantity,
              cartPrice: customization?.price,
              price: customization?.price / customization?.quantity,
            });
          }

          existingItem.quantity += customization?.quantity;
          existingItem.cartPrice +=
            (customization?.price || 0) + customization?.price;
        } else {
          const newCustomizationId = 'c1';
          state.carts.push({
            restaurant,
            items: [
              {
                ...item,
                quantity: customization.quantity,
                cartPrice: customization.price,
                customizations: [
                  {
                    id: newCustomizationId,
                    ...customization,
                    quanity: customization?.quantity,
                    cartPrice: customization?.price,
                    price: customization?.price / customization?.quantity,
                  },
                ],
              },
            ],
          });
        }
      } else {
        const newCustomizationId = 'c1';
        state.carts.push({
          restaurant,
          items: [
            {
              ...item,
              quantity: customization.quantity,
              cartPrice: customization.price,
              customizations: [
                {
                  id: newCustomizationId,
                  ...customization,
                  quanity: customization?.quantity,
                  cartPrice: customization?.price,
                  price: customization?.price / customization?.quantity,
                },
              ],
            },
          ],
        });
      }
    },

    removeCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
      }>,
    ) => {
      const {restaurant_id, itemId, customizationId} = action.payload;
      const restuarantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant_id?.id,
      );

      if (!restuarantCart) return;

      const item = restuarantCart?.items?.find(
        cartItem => cartItem?.id === item?.id,
      );

      if (!item) return;

      const customizationIndex = item?.customizations?.findIndex(
        cust => cust?.id === customizationId,
      ) as number;

      if (customizationIndex !== -1 && item?.customizations) {
        const customization = item?.customizations[customizationIndex];
        if (customization?.quantity > 1) {
          customization.quantity -= 1;
          customization.cartPrice -= customization?.price;
        } else {
          item?.customizations?.splice(customizationIndex, 1);
        }

        item.quantity -= 1;
        item.cartPrice = (item.cartPrice || 0) - customization?.price;

        if (item?.quantity === 0 || item?.customizations?.length === 0) {
          restuarantCart.items = restuarantCart?.items?.filter(
            cartItem => cartItem?.id !== itemId,
          );
        }
      }
    },

    updateCustomizableItem: (
      state,
      action: PayloadAction<{
        restaurant_id: string;
        itemId: string;
        customizationId: string;
        newCustomization: {
          quantity: number;
          price: number;
          customizationOptions: any[];
        };
      }>,
    ) => {
      const {restaurant_id, itemId, customizationId, newCustomization} =
        action.payload;
      const restuarantCart = state?.carts?.find(
        cart => cart?.restaurant?.id === restaurant_id,
      );
      if (!restuarantCart) return;

      const item = restuarantCart?.items?.find(
        cartItem => cartItem?.id === itemId,
      );

      if (!item || !item?.customizations) return;

      const matchingCustomizationIndex = item?.customizations?.findIndex(
        (cust: any) =>
          cust?.id === customizationId &&
          JSON.stringify(cust.customizationOptions) ===
            JSON.stringify(newCustomization.customizationOptions),
      );

      const targetCustomizationIndex = item?.customizations?.findIndex(
        cust => cust?.id === customizationId,
      );

      if (targetCustomizationIndex !== -1) return;

      const targetCustomization =
        item?.customizations[targetCustomizationIndex];

      if (matchingCustomizationIndex !== -1) {
        const matchingCustomization =
          item?.customizations[matchingCustomizationIndex];
        matchingCustomization.quantity = newCustomization?.quantity;
        matchingCustomization.cartPrice = newCustomization?.price;
        item?.customizations?.splice(targetCustomizationIndex, 1);
      } else {
        targetCustomization.quantity = newCustomization?.quantity;
        targetCustomization.cartPrice = newCustomization?.price;
        targetCustomization.price =
          newCustomization.price / newCustomization?.quantity;
        targetCustomization.customizationOptions =
          newCustomization?.customizationOptions;
      }

      item.quantity = item?.customizations?.reduce(
        (sum, cust) => sum + cust?.quantity,
        0,
      );

      item.cartPrice = item?.customizations?.reduce(
        (sum, cust) => sum + cust?.cartPrice,
        0,
      );
    },

    clearAllCarts: state => {
      state.carts = [];
    },
    clearRestaurantCart: (
      state,
      action: PayloadAction<{restaurant_id: string}>,
    ) => {
      const {restaurant_id} = action.payload;
      state.carts = state.carts.filter(
        cart => cart?.restaurant?.id !== restaurant_id,
      );
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  clearAllCarts,
  clearRestaurantCart,
  addCustomizableItem,
  removeCustomizableItem,
  updateCustomizableItem,
} = cardSlice.actions;

export const selectCart = (state: RootState) => state.cart;

export const selectRestaurantCart = (restaurantId: string) =>
  createSelector(
    (state: RootState) =>
      state.cart.cartfind(cart => cart?.restaurant?.id === restaurantId),
    restaurantCard => (restaurantCard ? [...restaurantCard.items] : []),
  );

export const selectRestaurantCartItem = (
  restaurantId: string,
  itemId: string,
) =>
  createSelector(
    (state: RootState) =>
      state.cart.carts.find(cart => cart?.restaurant?.id === restaurantId)
        ?.items,
    items => items.find(item => item?.id === itemId) || null,
  );

export default cardSlice.reducer;
