
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Providers from "@/components/providers";
import MouseMoveEffect from "@/components/mouse-hover-effect";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "nextJs Boilerplate", 
  description: "Boilerplate for nextJs projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
      <body>
        <Navbar />
        {children}
        <Toaster 
        position="top-center"
        reverseOrder={false}
        />
        <MouseMoveEffect />
      </body>
      </Providers>
    </html>
  );
}
