FROM node:22-alpine

WORKDIR /app

# Sao chép file cấu hình package trước để tận dụng Docker layer caching
COPY package*.json ./

# Cài đặt các gói phụ thuộc production
RUN npm install --omit=dev

# Sao chép mã nguồn ứng dụng và thư mục public
COPY server.js ./
COPY public/ ./public/

# Phân quyền sở hữu thư mục /app cho user 'node' (non-root) để bảo mật
RUN chown -R node:node /app

# Chuyển sang chạy ứng dụng bằng user 'node' thay vì root
USER node

EXPOSE 3000

CMD ["node", "server.js"]
