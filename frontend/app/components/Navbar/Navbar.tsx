"use client";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { useEffect, useState, useCallback } from "react";
import { logoutUser } from "../../restapi/auth";
import { fetchCategories } from "../../restapi/category";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import CategoryList from "./CategoryList";
import UserActions from "./UserActions";
import MobileMenu from "./MobileMenu";
import { MenuIcon, CloseIcon } from "./Icons";
import styles from "./navbar.module.css";

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const { categories, loading } = useAppSelector((state) => state.category);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle user logout
  const handleLogout = useCallback(async () => {
    await dispatch(logoutUser());
    router.push("/");
  }, [dispatch, router]);

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Handle category click
  const handleCategoryClick = useCallback((slug: string) => {
    setActiveCategory(slug);
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Logo />

        {/* Desktop Categories */}
        <div className={styles.categoriesSection}>
          <CategoryList
            categories={categories}
            loading={loading}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>

        {/* Desktop User Actions */}
        <div className={styles.actionsSection}>
          <UserActions user={user} onLogout={handleLogout} />
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <CloseIcon className={styles.menuIcon} />
          ) : (
            <MenuIcon className={styles.menuIcon} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        categories={categories}
        loading={loading}
        activeCategory={activeCategory}
        user={user}
        onCategoryClick={handleCategoryClick}
        onLogout={handleLogout}
        onClose={closeMobileMenu}
      />
    </nav>
  );
}
