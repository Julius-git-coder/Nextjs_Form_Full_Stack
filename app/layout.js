import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import Toast from "./components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Form Validation - Full Stack",
  description: "Complete authentication system with form validation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
        <script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid.auth.js"
          async
          defer
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Sync OAuth cookies to localStorage on page load
              (function() {
                try {
                  const userCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('user='))
                    ?.split('=')[1];
                  
                  if (userCookie) {
                    try {
                      const userData = JSON.parse(decodeURIComponent(userCookie));
                      localStorage.setItem('auth_user', JSON.stringify(userData));
                      // Also set a flag that OAuth was successful
                      localStorage.setItem('oauth_synced', 'true');
                    } catch (parseErr) {
                      console.error('Failed to parse user cookie:', parseErr);
                    }
                  }
                } catch (e) {
                  console.error('Failed to sync auth data from cookies:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <ToastProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
            <Toast />
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
