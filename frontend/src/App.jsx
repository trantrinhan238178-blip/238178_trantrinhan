import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    status: 'Đang làm việc'
  });

  const fetchEmployees = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?search=${keyword}`);
      setEmployees(res.data);
      setMessage('');
    } catch (err) {
      setMessage('Lỗi khi tải danh sách nhân viên!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setMessage('Cập nhật thông tin nhân viên thành công!');
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
        setMessage('Thêm nhân viên thành công!');
      }
      setFormData({
        employeeId: '', fullName: '', department: '', position: '', email: '', phone: '', status: 'Đang làm việc'
      });
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setFormData({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      department: emp.department,
      position: emp.position,
      email: emp.email,
      phone: emp.phone,
      status: emp.status
    });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhân viên "${name}"?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setMessage('Xóa nhân viên thành công!');
        fetchEmployees();
      } catch (err) {
        setMessage('Xóa thất bại!');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>QUẢN LÝ NHÂN SỰ (MSSV: 238178 - Trần Trí Nhân)</h2>

      {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px' }}>{message}</div>}

      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập Nhật Nhân Viên' : 'Thêm Nhân Viên Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="employeeId" placeholder="Mã NV" value={formData.employeeId} onChange={handleChange} required disabled={!!editingId} />
          <input name="fullName" placeholder="Họ và Tên" value={formData.fullName} onChange={handleChange} required />
          <input name="department" placeholder="Phòng ban" value={formData.department} onChange={handleChange} required />
          <input name="position" placeholder="Chức vụ" value={formData.position} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Thử việc">Thử việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" style={{ padding: '8px 15px', background: editingId ? '#ffc107' : '#28a745', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}>
              {editingId ? 'Lưu Cập Nhật' : 'Thêm Nhân Viên'}
            </button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ employeeId: '', fullName: '', department: '', position: '', email: '', phone: '', status: 'Đang làm việc' }); }} style={{ marginLeft: '10px', padding: '8px 15px', background: '#6c757d', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
        <input placeholder="Tìm kiếm theo Mã NV hoặc Họ tên..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '8px' }} />
        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Tìm kiếm</button>
      </form>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#e9ecef' }}>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Phòng ban</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy nhân viên nào</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phone}</td>
                  <td>{emp.status}</td>
                  <td>
                    <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px', padding: '4px 8px', background: '#ffc107', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(emp._id, emp.fullName)} style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
