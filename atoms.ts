import { atom } from "recoil";

interface CartItem {
  id: string;
  name: string;
  price: string;
  desc: string;
  img: string;
  quan: number;
}

interface UserItem {
  id: string | null;
  email: string | null;
}

export const cartData = atom<CartItem[]>({
  key: "cartData",
  default: [],
});

export const userData = atom<UserItem>({
  key: "userData",
  default: { id: null, email: null },
});
