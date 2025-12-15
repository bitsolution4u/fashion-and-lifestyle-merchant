import {
  BsHouse,
  BsGear,
  BsPlusCircle,
  BsBoxSeam,
  BsCart,
  BsSliders,
} from "react-icons/bs";

export const fashionAndLifestyleModule = [
  {
    icon: <BsHouse />, // Home icon
    module: "Home",
    link: "/admin/dashboard",
    subModule: [],
  },
  {
    icon: <BsSliders />, // Settings / Store Config icon
    module: "Store Config",
    link: "/admin/type-cat-subcat-by-store",
    subModule: [],
  },
  {
    icon: <BsPlusCircle />, // Add Product icon
    module: "Add Product",
    link: "/admin/product-info/add-item",
    subModule: [],
  },
  {
    icon: <BsBoxSeam />, // Product Info icon
    module: "Product Info",
    link: "/admin/product-info",
    subModule: [],
  },
  {
    icon: <BsCart />, // Order Info icon
    module: "Order Info",
    link: "/admin/order-info",
    subModule: [],
  },
  {
    icon: <BsGear />, // store setting icon
    module: "Store Setting",
    link: "/admin/store-setting",
    subModule: [],
  },
];
