import type { User } from "../../store/slices/authSlice";
import type { Category } from "../../interfaces/category";
import CategoryList from "./CategoryList";
import UserActions from "./UserActions";
import styles from "./navbar.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  categories: Category[];
  loading: boolean;
  activeCategory: string | null;
  user: User | null;
  onCategoryClick: (slug: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  categories,
  loading,
  activeCategory,
  user,
  onCategoryClick,
  onLogout,
  onClose,
}: MobileMenuProps) {
  return (
    <div
      className={`${styles.mobileMenu} ${
        isOpen ? styles.mobileMenuOpen : ""
      }`}
    >
      <div className={styles.mobileMenuContent}>
        {/* Mobile Categories */}
        <div className={styles.mobileCategoriesSection}>
          <h3 className={styles.mobileMenuTitle}>Categories</h3>
          <CategoryList
            categories={categories}
            loading={loading}
            activeCategory={activeCategory}
            onCategoryClick={onCategoryClick}
            isMobile
          />
        </div>

        {/* Mobile User Actions */}
        <div className={styles.mobileActionsSection}>
          <UserActions
            user={user}
            onLogout={onLogout}
            isMobile
            onMobileMenuClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}

