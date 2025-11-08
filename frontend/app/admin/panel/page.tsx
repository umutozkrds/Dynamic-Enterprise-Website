"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useRouter } from "next/navigation";
import { logoutUser } from "../../restapi/auth";
import { useEffect, useState } from "react";
import styles from "./panel.module.css";
import { SliderManager } from "../components/sliders";
import { CategoryManager } from "../components/categories";

export default function AdminPanel() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("sliders");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsMounted(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/admin/login");
    }
  }, [user, router, isMounted]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/");
  };

  // Prevent hydration mismatch by not rendering until client-side mounted
  if (!isMounted) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Top Navigation Bar */}
      <nav className={styles.topNav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <svg
              className={styles.logoIcon}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
           <Link href="/"><h1 className={styles.logoText}>Kreatif Admin</h1></Link> 
          </div>
          <div className={styles.navRight}>
            <Link href="/" className={styles.homeLink}>
              <svg
                className={styles.homeIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
            <span className={styles.userName}>
              {user.name}
            </span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <h2 className={styles.sidebarTitle}>Menu</h2>
            <nav className={styles.sidebarNav}>
              <button
                onClick={() => setActiveMenu("sliders")}
                className={`${styles.menuItem} ${
                  activeMenu === "sliders" ? styles.menuItemActive : ""
                }`}
              >
                <svg
                  className={styles.menuIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Sliders
              </button>
              <button
                onClick={() => setActiveMenu("categories")}
                className={`${styles.menuItem} ${
                  activeMenu === "categories" ? styles.menuItemActive : ""
                }`}
              >
                <svg
                  className={styles.menuIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Categories
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>
              {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
            </h1>
            <p className={styles.contentDescription}>
              Manage your {activeMenu} here
            </p>
          </div>

          <div className={styles.contentBody}>
            {activeMenu === "sliders" && <SliderManager />}
            {activeMenu === "categories" && <CategoryManager />}
          </div>
        </main>
      </div>
    </div>
  );
}
