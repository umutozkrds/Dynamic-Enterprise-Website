import { useState, useEffect, useMemo } from "react";
import type { Category } from "../../interfaces/category";
import type { SubCategory } from "../../interfaces/subCategory";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchSubCategories } from "../../restapi/subCategory";
import styles from "./navbar.module.css";

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  activeCategory: string | null;
  onCategoryClick: (slug: string) => void;
  isMobile?: boolean;
}

export default function CategoryList({
  categories,
  loading,
  activeCategory,
  onCategoryClick, // Reserved for future use when implementing category filtering
  isMobile = false,
}: CategoryListProps) {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  const { subCategories, loading: subCategoriesLoading } = useAppSelector(
    (state) => state.subCategory
  );

  // Suppress unused variable warning - will be used when adding subcategory navigation
  void onCategoryClick;

  useEffect(() => {
    dispatch(fetchSubCategories());
  }, [dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  // Group subcategories by category_id
  const subCategoriesByCategory = useMemo(() => {
    return subCategories.reduce((acc, subCategory) => {
      if (!acc[subCategory.category_id]) {
        acc[subCategory.category_id] = [];
      }
      acc[subCategory.category_id].push(subCategory);
      return acc;
    }, {} as Record<number, SubCategory[]>);
  }, [subCategories]);

  if (loading) {
    return (
      <div
        className={
          isMobile ? styles.mobileLoadingContainer : styles.categoriesLoading
        }
      >
        <div className={styles.loadingSkeleton}></div>
        <div className={styles.loadingSkeleton}></div>
        <div className={styles.loadingSkeleton}></div>
      </div>
    );
  }

  const listClassName = isMobile
    ? styles.mobileCategoriesList
    : styles.categoriesList;
  const itemClassName = isMobile
    ? styles.mobileCategoryItem
    : styles.categoryItem;
  const linkClassName = isMobile
    ? styles.mobileCategoryLink
    : styles.categoryLink;

  const handleMouseEnter = (categoryId: number) => {
    if (!isMobile) {
      // Clear any pending close timeout
      if (closeTimeout) {
        clearTimeout(closeTimeout);
        setCloseTimeout(null);
      }
      setOpenDropdown(categoryId);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      // Add a small delay before closing for better UX
      const timeout = setTimeout(() => {
        setOpenDropdown(null);
      }, 150);
      setCloseTimeout(timeout);
    }
  };

  const handleMobileClick = (categoryId: number) => {
    if (isMobile) {
      setOpenDropdown(openDropdown === categoryId ? null : categoryId);
    }
  };

  return (
    <ul className={listClassName}>
      {categories.map((category) => (
        <li key={category.id} className={itemClassName}>
          <div
            className={styles.categoryDropdownWrapper}
            onMouseEnter={() => handleMouseEnter(category.id)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`${linkClassName} ${
                activeCategory === category.slug ? styles.active : ""
              }`}
              onClick={() => {
                if (isMobile) {
                  handleMobileClick(category.id);
                } else {
                  handleMouseEnter(category.id);
                }
              }}
            >
              {isMobile && (
                <svg
                  className={styles.categoryIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {category.name}
              {!isMobile && (
                <svg
                  className={styles.dropdownArrow}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
            </button>

            {/* Dropdown menu with subcategories */}
            {openDropdown === category.id && (
              <div
                className={
                  isMobile ? styles.mobileDropdownMenu : styles.dropdownMenu
                }
              >
                <div className={styles.dropdownContent}>
                  {subCategoriesLoading ? (
                    <div className={styles.dropdownLoading}>
                      <div className={styles.loadingSkeleton}></div>
                      <div className={styles.loadingSkeleton}></div>
                    </div>
                  ) : subCategoriesByCategory[category.id]?.length > 0 ? (
                    <ul className={styles.subCategoryList}>
                      {subCategoriesByCategory[category.id].map(
                        (subCategory) => (
                          <li
                            key={subCategory.id}
                            className={styles.subCategoryItem}
                          >
                            <a
                              href={`/category/${category.slug}/${subCategory.slug}`}
                              className={styles.subCategoryLink}
                            >
                              {subCategory.name}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className={styles.dropdownPlaceholder}>
                      No subcategories available
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
