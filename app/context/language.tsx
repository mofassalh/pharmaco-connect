"use client";
import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  bn: {
    // Auth
    login: "Login করুন",
    register: "Register করুন",
    email: "Email",
    password: "Password",
    fullName: "পুরো নাম",
    phone: "Phone নম্বর",
    confirmPassword: "Password আবার দিন",
    newAccount: "নতুন Account",
    alreadyHaveAccount: "Already account আছে?",
    newUser: "নতুন user?",

    // Dashboard
    dashboard: "Dashboard",
    welcome: "স্বাগতম",
    totalPrescription: "মোট Prescription",
    activeOrders: "চলমান Order",
    regularMedicine: "নিয়মিত Medicine",
    refillDays: "দিনে Refill",
    recentOrders: "সাম্প্রতিক Orders",
    viewAll: "সব দেখুন →",
    noOrders: "এখনো কোনো order নেই",

    // Navigation
    home: "Home",
    prescription: "Prescription",
    orders: "Orders",
    profile: "Profile",
    shop: "Shop",
    logout: "Logout",

    // Prescription
    uploadPrescription: "Prescription Upload",
    takePicture: "ছবি তুলুন",
    aiRead: "AI দিয়ে পড়ুন",
    medicineList: "Medicine তালিকা",
    submit: "Submit করুন",
    submitted: "Submit হয়েছে!",
    adminWillReview: "Admin review করবেন",
    goToDashboard: "Dashboard এ যান",

    // Profile
    myProfile: "আমার Profile",
    editProfile: "Profile Edit করুন",
    totalOrders: "মোট Orders",
    totalSpent: "মোট খরচ",
    loyaltyPoints: "Loyalty Points",
    dueAmount: "বাকি আছে",
    payNow: "পরিশোধ করুন",
    familyMembers: "পরিবারের সদস্য",
    billing: "Billing ও বাকি টাকা",
    monthlyRefill: "Monthly Refill",
    settings: "Settings",

    // Orders
    myOrders: "আমার Orders",
    pending: "অপেক্ষায়",
    confirmed: "নিশ্চিত",
    processing: "প্রস্তুত হচ্ছে",
    outForDelivery: "রাস্তায় আছে",
    delivered: "পৌঁছে গেছে",
    cancelled: "বাতিল",
    total: "মোট",
    paid: "পরিশোধ",
    due: "বাকি",

    // Shop
    buyMedicine: "Medicine কিনুন",
    searchMedicine: "Medicine search করুন...",
    addToCart: "Cart এ যোগ করুন",
    order: "Order করুন",
    available: "Available",
    outOfStock: "Stock নেই",

    // Settings
    language: "ভাষা",
    notification: "Notification",
    deliveryAddress: "Delivery Address",
    savedPayments: "Saved Payment Methods",
    security: "Privacy & Security",
    help: "Help & Support",
  },
  en: {
    // Auth
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    fullName: "Full Name",
    phone: "Phone Number",
    confirmPassword: "Confirm Password",
    newAccount: "New Account",
    alreadyHaveAccount: "Already have an account?",
    newUser: "New user?",

    // Dashboard
    dashboard: "Dashboard",
    welcome: "Welcome",
    totalPrescription: "Total Prescriptions",
    activeOrders: "Active Orders",
    regularMedicine: "Regular Medicine",
    refillDays: "Days to Refill",
    recentOrders: "Recent Orders",
    viewAll: "View All →",
    noOrders: "No orders yet",

    // Navigation
    home: "Home",
    prescription: "Prescription",
    orders: "Orders",
    profile: "Profile",
    shop: "Shop",
    logout: "Logout",

    // Prescription
    uploadPrescription: "Upload Prescription",
    takePicture: "Take a Picture",
    aiRead: "Read with AI",
    medicineList: "Medicine List",
    submit: "Submit",
    submitted: "Submitted!",
    adminWillReview: "Admin will review",
    goToDashboard: "Go to Dashboard",

    // Profile
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    totalOrders: "Total Orders",
    totalSpent: "Total Spent",
    loyaltyPoints: "Loyalty Points",
    dueAmount: "Amount Due",
    payNow: "Pay Now",
    familyMembers: "Family Members",
    billing: "Billing & Due",
    monthlyRefill: "Monthly Refill",
    settings: "Settings",

    // Orders
    myOrders: "My Orders",
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    outForDelivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    total: "Total",
    paid: "Paid",
    due: "Due",

    // Shop
    buyMedicine: "Buy Medicine",
    searchMedicine: "Search medicine...",
    addToCart: "Add to Cart",
    order: "Place Order",
    available: "Available",
    outOfStock: "Out of Stock",

    // Settings
    language: "Language",
    notification: "Notification",
    deliveryAddress: "Delivery Address",
    savedPayments: "Saved Payment Methods",
    security: "Privacy & Security",
    help: "Help & Support",
  }
};

type Language = "bn" | "en";
type TranslationKey = keyof typeof translations.bn;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "bn",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("bn");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Language;
    if (saved === "bn" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.bn[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}