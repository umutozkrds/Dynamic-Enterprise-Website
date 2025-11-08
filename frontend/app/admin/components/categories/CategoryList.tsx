"use client";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { fetchCategories, deleteCategory } from "../../../restapi/category";
import { useEffect, useState } from "react";
import styles from "./categories.module.css";
import type { Category } from "@/app/interfaces/category";

interface CategoryListProps {
  onEdit?: (category: Category) => void;
}

export default function CategoryList({ onEdit }: CategoryListProps) {
  const { categories, loading, error } = useAppSelector(
    (state) => state.category
  );
  const dispatch = useAppDispatch();
  const [deleteSuccess, setDeleteSuccess] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        setDeleteError("");
        setDeleteSuccess("");
        await dispatch(deleteCategory(id)).unwrap();
        await dispatch(fetchCategories());
        setDeleteSuccess("Category deleted successfully!");
        setTimeout(() => setDeleteSuccess(""), 3000);
      } catch (error: unknown) {
        console.error("Failed to delete category:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete category";
        setDeleteError(typeof error === "string" ? error : errorMessage);
        setTimeout(() => setDeleteError(""), 5000);
      }
    }
  };

  // Group categories by parent_id and sort by order
  type GroupedCategories = Record<string | number, Category[]>;
  const groupedCategories = categories.reduce<GroupedCategories>(
    (acc, category) => {
      const parentId = category.parent_id || "root";
      if (!acc[parentId]) {
        acc[parentId] = [];
      }
      acc[parentId].push(category);
      return acc;
    },
    {}
  );

  // Sort each group by order
  Object.keys(groupedCategories).forEach((key) => {
    groupedCategories[key].sort((a, b) => a.order - b.order);
  });

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (
    category: Category,
    level: number = 0
  ): React.JSX.Element => {
    const children = groupedCategories[category.id] || [];
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = children.length > 0;

    return (
      <div key={category.id} className={styles.categoryWrapper}>
        <div
          className={`${styles.categoryItem} ${
            level > 0 ? styles.subcategoryItem : ""
          }`}
        >
          <div className={styles.categoryInfo}>
            <div className={styles.categoryHeader}>
              {hasChildren && (
                <button
                  className={styles.accordionToggle}
                  onClick={() => toggleCategory(category.id)}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  <svg
                    className={`${styles.accordionIcon} ${
                      isExpanded ? styles.accordionIconExpanded : ""
                    }`}
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
                </button>
              )}
              {!hasChildren && level > 0 && (
                <div className={styles.childIndicator}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                </div>
              )}
              <h3 className={styles.categoryName}>{category.name}</h3>
              {hasChildren && (
                <span className={styles.childrenCount}>
                  ({children.length}{" "}
                  {children.length === 1 ? "subcategory" : "subcategories"})
                </span>
              )}
              <span className={styles.categoryBadge}>
                Order: {category.order}
              </span>
            </div>
            <p className={styles.categorySlug}>/{category.slug}</p>
          </div>
          <div className={styles.categoryActions}>
            <button
              className={styles.editButton}
              onClick={() => onEdit?.(category)}
            >
              <svg
                className={styles.actionIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Edit
            </button>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(category.id)}
            >
              <svg
                className={styles.actionIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.childCategories}>
            {children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <svg
          className={styles.errorIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={styles.emptyState}>
        <svg
          className={styles.emptyIcon}
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
        <p className={styles.emptyText}>No categories found</p>
        <p className={styles.emptySubtext}>
          Click "Add Category" tab to create your first category
        </p>
      </div>
    );
  }

  const rootCategories = groupedCategories["root"] || [];

  return (
    <>
      {deleteSuccess && (
        <div className={styles.alertSuccess}>
          <svg
            className={styles.alertIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {deleteSuccess}
        </div>
      )}

      {deleteError && (
        <div className={styles.alertError}>
          <svg
            className={styles.alertIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {deleteError}
        </div>
      )}

      <div className={styles.categoryList}>
        {rootCategories.map((category) => renderCategory(category, 0))}
      </div>
    </>
  );
}
