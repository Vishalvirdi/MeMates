import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "priya.sharma@example.com",
    fullName: "Priya Sharma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg?nat=in",
  },
  {
    email: "anjali.patel@example.com",
    fullName: "Anjali Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg?nat=in",
  },
  {
    email: "neha.gupta@example.com",
    fullName: "Neha Gupta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/3.jpg?nat=in",
  },
  {
    email: "pooja.verma@example.com",
    fullName: "Pooja Verma",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/4.jpg?nat=in",
  },
  {
    email: "meera.singh@example.com",
    fullName: "Meera Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/5.jpg?nat=in",
  },
  {
    email: "divya.kumar@example.com",
    fullName: "Divya Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/6.jpg?nat=in",
  },
  {
    email: "ritu.mishra@example.com",
    fullName: "Ritu Mishra",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/7.jpg?nat=in",
  },
  {
    email: "anita.reddy@example.com",
    fullName: "Anita Reddy",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/8.jpg?nat=in",
  },

  // Male Users
  {
    email: "rahul.kumar@example.com",
    fullName: "Rahul Kumar",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg?nat=in",
  },
  {
    email: "amit.shah@example.com",
    fullName: "Amit Shah",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/2.jpg?nat=in",
  },
  {
    email: "vikram.singh@example.com",
    fullName: "Vikram Singh",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/3.jpg?nat=in",
  },
  {
    email: "arjun.patel@example.com",
    fullName: "Arjun Patel",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/4.jpg?nat=in",
  },
  {
    email: "raj.malhotra@example.com",
    fullName: "Raj Malhotra",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/5.jpg?nat=in",
  },
  {
    email: "arun.mehta@example.com",
    fullName: "Arun Mehta",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/6.jpg?nat=in",
  },
  {
    email: "karthik.iyer@example.com",
    fullName: "Karthik Iyer",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/7.jpg?nat=in",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
