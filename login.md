```mermaid


sequenceDiagram
    autonumber
    actor User as Người dùng
    participant FE as Frontend (Next.js)
    participant API as Backend API (AuthController)
    participant DB as Database (SQL Server)

    Note over User, FE: Trang Đăng nhập (/login)

    User->>FE: Nhập Email, Mật khẩu
    User->>FE: Bấm nút "Đăng nhập"

    FE->>API: POST /api/v1/auth/login
    activate API

    API->>DB: Tìm User theo Email
    
    alt Không tìm thấy User
        DB-->>API: Null
        API-->>FE: Trả về 401 Unauthorized ("Email hoặc mật khẩu sai")
        FE-->>User: Hiển thị lỗi đăng nhập
    else Tìm thấy User
        DB-->>API: Trả về thông tin User (gồm PasswordHash)
        
        API->>API: So sánh Mật khẩu nhập vào vs PasswordHash (BCrypt)
        
        alt Mật khẩu sai
            API-->>FE: Trả về 401 Unauthorized ("Email hoặc mật khẩu sai")
            FE-->>User: Hiển thị lỗi đăng nhập
        else Mật khẩu đúng
            API->>API: Tạo JWT Token (Chứa Id, Email, Role)
            API-->>FE: Trả về 200 OK (AuthResponse: Token, UserInfo)
            
            activate FE
            FE->>FE: Lưu Token vào localStorage/Cookie
            FE->>FE: Cập nhật Global State (Redux/Context)
            FE-->>User: Chuyển hướng về Trang chủ / Dashboard
            deactivate FE
        end
    end
    deactivate API