"use client"
import "./globals.css";
import MyNavbar from "@/components/Navbar";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { Provider } from 'react-redux';
import { store } from "@/store/store";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider store={store}>
      <head>
        <script
          src="https://kit.fontawesome.com/f72e788797.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <div className="container">
        <MyNavbar /> 
          <div className="row no-gutters">
            <div className="col-12 col-lg-3 h-100 sticky-element" id="col-lb-2">
              <div className="d-flex">
                <a
                  id="notifbtn"
                  className="d-none d-lg-flex btn pe-4 ps-4 text-center bg-dark text-white border-light rounded-lg d-flex align-items-center justify-content-center"
                  href="/notification"
                >
                  <i id="bell-icon" className="fas fa-bell" />
                  {/* Ikon notifikasi dari FontAwesome */}
                  <span id="notif-dot" className="notif-dot ms-1" />
                </a>
                <div
                  className="card bg-dark text-white ms-2 border-light d-none d-lg-flex rounded-lg"
                  style={{ maxWidth: 300 }}
                >
                  <div className="card-body">
                    <input
                      type="text"
                      autoComplete="off"
                      defaultValue="<%= searchTerm %>"
                      id="searchInput"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>
              <div className="card bg-dark text-white border-light d-none d-lg-flex pt-3 rounded-lg mt-2">
                <a href="#" id="myDetails" className="d-lg-flex">
                  <img
                    className="rounded-circle mx-auto"
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: 100,
                      maxHeight: 100,
                    }}
                    id="mypfp"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt="Card image"
                  />
                </a>
                <div className="card-body">
                  <h5 className="card-title text-center" id="myname" />
                  <p
                    className="card-text text-secondary text-center"
                    id="myusername"
                  />
                  <p
                    className="card-text"
                    id="mydesc"
                    style={{ height: "fit-content !important" }}
                  />
                  <p
                    className="card-text mb-0"
                    id="myfollowing"
                    style={{ color: "var(--text)" }}
                  >
                    following
                  </p>
                  <p
                    className="card-text"
                    id="myfollowers"
                    style={{ color: "var(--text)" }}
                  >
                    followers
                  </p>
                  <div className="text-center">
                    <button
                      className="btn btn-primary rounded-pill ms-3"
                      style={{ width: "70%", fontSize: "x-large" }}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
              <div className="card bg-dark text-white border-light d-none d-lg-flex rounded-lg mt-2 mb-2">
                <div className="card-body">
                  <h5
                    className="h5 card-title mb-3"
                    style={{ fontWeight: 900 }}
                  >
                    Mutuals
                  </h5>
                  <div id="follower" />
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              {children}
            </div>
          </div>
        </div>
      </body>
      </Provider>
    </html>
  );
}
