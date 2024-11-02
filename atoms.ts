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

interface AddressItem {
  id: string;
  ad: string;
}

export const cartDataState = atom<CartItem[]>({
  key: "cartData",
  default: [],
});

export const userDataState = atom<UserItem>({
  key: "userData",
  default: { id: null, email: null },
});

export const AddressesState = atom<AddressItem[]>({
  key: "Addresses",
  default: [],
});

export const SelectedAddressState = atom({
  key: "SelectedAddress",
  default: "",
});
