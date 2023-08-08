# Sử dụng một hình ảnh có Node.js đã cài đặt
FROM node:16

# Đặt thư mục làm thư mục làm việc
WORKDIR /app

# Sao chép các tệp package.json và yarn.lock vào thư mục làm việc
COPY package*.json yarn.lock ./

# Cài đặt các dependencies
RUN yarn install

# Sao chép toàn bộ dự án vào thư mục làm việc
COPY . .

# Chạy ứng dụng
CMD ["yarn", "dev"]
