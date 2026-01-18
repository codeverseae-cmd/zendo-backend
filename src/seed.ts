import mongoose from "mongoose";
import { Product } from "./models/product.model";
import { Category } from "./models/category.model";

async function seedDB() {
  await mongoose.connect(
    "mongodb+srv://meshaalkozhikodan_db_user:KHIwQIldjuxhSzVn@cluster0.1jhktz6.mongodb.net/"
  );

  await Product.insertMany([
    {
      name: { en: "Fresh Orange Juice", ar: "عصير برتقال طازج" },
      categoryId: "6928208ac70b2d0f81692723",
      brandId: "692821211f3d0276d403cd79",
      image: "https://picsum.photos/300/300?1",
      price: 13,
      originalPrice: 15,
      rating: 4.2,
      discount: "10%",
      discountColor: "#FF7F3F",
      badge: "Best Seller",
      badgeColor: "#FFD700",
    },
    {
      name: { en: "Mint Tea", ar: "شاي بالنعناع" },
      categoryId: "6928208ac70b2d0f81692723",
      brandId: "692821211f3d0276d403cd7a",
      image: "https://picsum.photos/300/300?2",
      price: 8,
      originalPrice: 10,
      rating: 4.0,
      discount: "20%",
      discountColor: "#008000",
    },
    {
      name: { en: "Whole Milk", ar: "حليب كامل الدسم" },
      categoryId: "6928208ac70b2d0f81692735",
      brandId: "692821211f3d0276d403cd7b",
      image: "https://picsum.photos/300/300?3",
      price: 12,
      originalPrice: 15,
      rating: 4.5,
      badge: "Fresh",
      badgeColor: "#00BFFF",
    },
    {
      name: { en: "Cheddar Cheese", ar: "جبنة شيدر" },
      categoryId: "6928208ac70b2d0f81692735",
      brandId: "692821211f3d0276d403cd7c",
      image: "https://picsum.photos/300/300?4",
      price: 22,
      originalPrice: 25,
      rating: 4.1,
    },
    {
      name: { en: "Classic Lays Chips", ar: "رقائق ليز كلاسيكية" },
      categoryId: "6928208ac70b2d0f8169273d",
      brandId: "692821211f3d0276d403cd7d",
      image: "https://picsum.photos/300/300?5",
      price: 5,
      rating: 4.3,
      discount: "5%",
      discountColor: "#FFA500",
    },
    {
      name: { en: "Doritos Spicy Chips", ar: "دوريتوس حار" },
      categoryId: "6928208ac70b2d0f8169273d",
      brandId: "692821211f3d0276d403cd7e",
      image: "https://picsum.photos/300/300?6",
      price: 6,
      rating: 4.4,
    },
    {
      name: { en: "Brown Bread", ar: "خبز بني" },
      categoryId: "6928208ac70b2d0f81692744",
      brandId: "692821211f3d0276d403cd7f",
      image: "https://picsum.photos/300/300?7",
      price: 4,
      rating: 4.1,
    },
    {
      name: { en: "Chocolate Cake", ar: "كعكة الشوكولاتة" },
      categoryId: "6928208ac70b2d0f81692744",
      brandId: "692821211f3d0276d403cd80",
      image: "https://picsum.photos/300/300?8",
      price: 35,
      originalPrice: 40,
      rating: 4.8,
      badge: "Top Rated",
      badgeColor: "#800080",
    },
    {
      name: { en: "Arabic Bread", ar: "خبز عربي" },
      categoryId: "6928208ac70b2d0f8169274b",
      brandId: "692821211f3d0276d403cd81",
      image: "https://picsum.photos/300/300?9",
      price: 3,
      rating: 3.9,
    },
    {
      name: { en: "Face Wash", ar: "غسول وجه" },
      categoryId: "6928208ac70b2d0f81692767",
      brandId: "692821211f3d0276d403cd82",
      image: "https://picsum.photos/300/300?10",
      price: 18,
      originalPrice: 22,
      rating: 4.3,
      discount: "15%",
      discountColor: "#FF4500",
    },
  ]);

  console.log("Data seeded successfully!");
  process.exit(0);
}

seedDB();
