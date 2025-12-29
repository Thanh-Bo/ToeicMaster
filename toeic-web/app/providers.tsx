// app/providers.tsx
'use client'; // <--- Dòng này bắt buộc để chạy ở Client

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider cũ của bạn vào đây

export function Providers({ children }: { children: React.ReactNode }) {
  // Nên dùng biến môi trường, đừng viết cứng ID ở đây nếu có thể
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}