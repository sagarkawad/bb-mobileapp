import { atom } from "recoil";

interface CartItem {
  id: string;
  name: string;
  price: string;
  desc: string;
  img: string;
  quan: number;
}

export const cartData = atom<CartItem[]>({
  key: "cartData",
  default: [],
});
