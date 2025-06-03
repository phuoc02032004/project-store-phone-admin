# Dự án Quản lý Cửa hàng Điện thoại

Đây là bảng điều khiển quản trị (admin panel) cho dự án Cửa hàng Điện thoại. Dự án được xây dựng sử dụng React và Vite.

## Cài đặt

1.  **Sao chép kho mã nguồn (repository):**

    ```bash
    git clone <repository_url>
    cd project-store-phone-admin
    ```

2.  **Cài đặt các gói phụ thuộc (dependencies):**

    ```bash
    npm install
    ```

3.  **Biến môi trường (Environment Variables):**

    Tạo một tệp `.env` ở thư mục gốc của dự án và thêm các biến môi trường cần thiết.

    ```env
    # Ví dụ biến môi trường
    VITE_API_URL=http://localhost:8080/api
    ```

## Chạy dự án cục bộ

Để chạy dự án cục bộ ở chế độ phát triển:

```bash
npm run dev
```

Lệnh này sẽ khởi động máy chủ phát triển, thường chạy tại `http://localhost:5173`.

## Xây dựng cho môi trường Production

Để xây dựng dự án cho môi trường production:

```bash
npm run build
```

Lệnh này sẽ tạo ra thư mục `dist` chứa các tệp tĩnh sẵn sàng cho production.

## Docker

Dockerfile được cung cấp để xây dựng ảnh Docker của ứng dụng và phục vụ bằng Nginx.

1.  **Xây dựng ảnh Docker:**

    ```bash
    docker build -t store-phone-admin .
    ```

2.  **Chạy container Docker:**

    ```bash
    docker run -p 80:80 store-phone-admin
    ```

    Lệnh này sẽ chạy container và ánh xạ cổng 80 trên container tới cổng 80 trên máy chủ của bạn. Bạn có thể truy cập ứng dụng trong trình duyệt tại `http://localhost`.

## Công cụ và Chức năng

Dự án này cung cấp các công cụ và chức năng quản lý chính cho cửa hàng điện thoại, bao gồm:

*   **Quản lý Người dùng:** Xem, thêm, sửa, xóa thông tin người dùng.
*   **Quản lý Sản phẩm:** Xem, thêm, sửa, xóa thông tin sản phẩm, quản lý hình ảnh và chi tiết sản phẩm.
*   **Quản lý Đơn hàng:** Xem danh sách đơn hàng, cập nhật trạng thái đơn hàng.
*   **Quản lý Mã giảm giá (Coupon):** Tạo, quản lý và theo dõi các mã giảm giá.
*   **Quản lý Thông báo:** Gửi và quản lý các thông báo đến người dùng.
*   **Quản lý Danh mục:** Tổ chức sản phẩm theo các danh mục khác nhau.
*   **Quản lý Đánh giá:** Xem và quản lý các đánh giá của khách hàng về sản phẩm.
*   **Cài đặt:** Cấu hình các thiết lập chung cho hệ thống.
