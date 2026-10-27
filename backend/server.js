const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect MongoDB Atlas
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema & Model Employee
const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, default: 'Đang làm việc' }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema, 'employees');

// 1. Lấy danh sách nhân viên + Tìm kiếm
app.get('/api/employees', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { employeeId: { $regex: search,$options: 'i' } },
          { fullName: { $regex: search,$options: 'i' } }
        ]
      };
    }
    const employees = await Employee.find(query);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// 2. Thêm nhân viên mới
app.post('/api/employees', async (req, res) => {
  try {
    const newEmp = new Employee(req.body);
    await newEmp.save();
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(400).json({ message: 'Dữ liệu không hợp lệ hoặc trùng Mã NV!', error: error.message });
  }
});

// 3. Cập nhật nhân viên
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmp);
  } catch (error) {
    res.status(400).json({ message: 'Cập nhật thất bại!', error: error.message });
  }
});

// 4. Xóa nhân viên
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xóa nhân viên thành công!' });
  } catch (error) {
    res.status(500).json({ message: 'Xóa thất bại!', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
