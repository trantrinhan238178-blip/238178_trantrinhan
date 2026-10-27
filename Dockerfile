# Sử dụng Node.js image chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy package.json và package-lock.json để cài đặt dependency
COPY package*.json ./

# Cài đặt các thư viện cần thiết
RUN npm install

# Copy toàn bộ mã nguồn backend vào container
COPY . .

# Mở cổng 5000 cho backend
EXPOSE 5000

# Khởi chạy ứng dụng backend
CMD ["node", "server.js"]
