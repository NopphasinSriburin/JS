import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/app/lib/mongodb'; // ฟังก์ชันเชื่อมต่อ MongoDB
import User from '@/app/model/Users'; // Model ของผู้ใช้
import bcrypt from 'bcryptjs'; // สำหรับการแฮชรหัสผ่าน
import mongoose from 'mongoose';

// GET - ดึงข้อมูลผู้ใช้ทั้งหมด
export async function GET() {
  try {
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    // ดึงข้อมูลผู้ใช้ทั้งหมดจาก MongoDB
    const users = await User.find({}).select('-password'); // ไม่คืนค่ารหัสผ่าน

    // ส่งข้อมูลกลับไปในรูปแบบ JSON
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch users', error }, { status: 500 });
  }
}

// POST - สร้างผู้ใช้ใหม่
// POST - สร้างผู้ใช้ใหม่
export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json(); // ดึงข้อมูลจาก request body

    // ตรวจสอบว่า username, email, และ password มีอยู่หรือไม่
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email, and password are required." },
        { status: 400 }
      );
    }

    // เชื่อมต่อกับ MongoDB
    await connectMongoDB();
    const db = mongoose.connection;
    const usersCollection = db.collection("users");

    // ตรวจสอบว่าผู้ใช้นั้นมีอยู่แล้วหรือไม่
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 201 }
      );
    }

    // สร้างผู้ใช้ใหม่ (อย่าลืมแฮชรหัสผ่านที่นี่)
    const hashedPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่าน
    const newUser = { username, email, password: hashedPassword, createdAt: new Date() };
    await usersCollection.insertOne(newUser);

    // ดึงข้อมูลผู้ใช้ใหม่ที่สร้างขึ้นโดยไม่รวมรหัสผ่าน
    const createdUser = await usersCollection.findOne(
      { username },
      { projection: { password: 0 } } // ไม่คืนค่ารหัสผ่านในผลลัพธ์
    );

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the user." },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตข้อมูลผู้ใช้โดย username
export async function PUT(request: Request) {
  try {
    const { username, email, password } = await request.json(); // ดึงข้อมูลจาก request body
    console.log('Request Body:', { username, email, password }); // เช็คข้อมูลที่ถูกส่งมา

    await connectMongoDB(); // เชื่อมต่อ MongoDB

    // ตรวจสอบว่า username มีอยู่หรือไม่
    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    // เตรียมข้อมูลการอัปเดต
    const updateData: { email?: string; password?: string } = {};

    if (email) {
      updateData.email = email; // อัปเดตอีเมล
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // แฮชรหัสผ่านใหม่
      updateData.password = hashedPassword; // อัปเดตรหัสผ่าน
    }

    // อัปเดตข้อมูลผู้ใช้โดยค้นหาจาก username
    const updatedUser = await User.findOneAndUpdate(
      { username }, // ค้นหาจาก username
      updateData,
      {
        new: true, // ให้คืนค่าผลลัพธ์ที่อัปเดตใหม่
        runValidators: true, // ตรวจสอบความถูกต้องของข้อมูล
      }
    );

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log('Updated User:', updatedUser); // เช็คข้อมูลที่ถูกอัปเดตแล้ว

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Failed to update user:', error.message);
    return NextResponse.json({ message: 'Failed to update user', error: error.message }, { status: 500 });
  }
}

// DELETE - ลบข้อมูลผู้ใช้โดย username
export async function DELETE(request: Request) {
  try {
    const { username } = await request.json(); // ดึงข้อมูลจาก request body
    await connectMongoDB(); // เชื่อมต่อกับ MongoDB

    // ตรวจสอบว่า username มีอยู่หรือไม่
    if (!username) {
      return NextResponse.json({ message: 'Username is required' }, { status: 400 });
    }

    // ลบผู้ใช้ที่มีอยู่โดยค้นหาตาม username
    const deletedUser = await User.findOneAndDelete({ username });

    // ตรวจสอบว่าพบผู้ใช้หรือไม่
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete user', error }, { status: 500 });
  }
}
