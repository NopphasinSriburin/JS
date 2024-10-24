import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // เปิดใช้งาน timestamps สำหรับ createdAt และ updatedAt
  }
);

// ตรวจสอบว่ามีการคอมไพล์โมเดลแล้วหรือยัง เพื่อหลีกเลี่ยงการทับโมเดลเดิม
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
