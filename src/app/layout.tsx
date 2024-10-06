"use client";
import "./styles/globals.css";
import MyNavbar from "@/components/Navbar";
import MyFooter from "@/components/Footer";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { Provider } from 'react-redux';
import { store } from "@/store/store";
import MyHeader from "@/components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css'; // Pastikan ini diimpor setelah Bootstrap

export default function RootLayout({ children }: { children: React.ReactNode }) {


  return (
    <html lang="en">
      <Provider store={store}>
        <head>
        </head>
        <body className={inter.className}>
          <div className="container">
            <MyNavbar />
            <div className="row no-gutters">
            <div className='col-12 col-lg-3 h-100 pt-0 mt-0' id='col-lb-2'>
              <MyHeader />
            </div>
              <div className="col-lg-6 col-12">
                { children }
              </div>
              <div className="col-12 col-lg-3 h-100 sticky-element">
              <MyFooter />
              </div>
            </div>
          </div>
        </body>
      </Provider>
    </html>
  );
}
