# Sử dụng một hình ảnh có Node.js đã cài đặt
FROM node:16

# Đặt thư mục làm thư mục làm việc
WORKDIR /app

# Sao chép các tệp package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ dự án vào thư mục làm việc
COPY . .

# Chạy ứng dụng
CMD ["npm", "start"]
