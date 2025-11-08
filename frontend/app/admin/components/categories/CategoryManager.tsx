"use client";

import { useState } from "react";
import CategoryList from "./CategoryList";
import AddCategory from "./AddCategory";
import UpdateCategory from "./UpdateCategory";
import DraggableCategoryList from "./DraggableCategoryList";
import styles from "./categories.module.css";
import type { Category } from "@/app/interfaces/category";

export default function CategoryManager() {
  const [activeTab, setActiveTab] = useState<
    "list" | "add" | "update" | "reorder"
  >("list");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setActiveTab("update");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    setActiveTab("list");
    setEditingCategory(null);
  };

  return (
    <div className={styles.section}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => {
            setActiveTab("list");
            setEditingCategory(null);
          }}
          className={`${styles.tab} ${
            activeTab === "list" ? styles.tabActive : ""
          }`}
        >
          <svg
            className={styles.tabIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Category List
        </button>
        <button
          onClick={() => {
            setActiveTab("add");
            setEditingCategory(null);
          }}
          className={`${styles.tab} ${
            activeTab === "add" ? styles.tabActive : ""
          }`}
        >
          <svg
            className={styles.tabIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Category
        </button>
        <button
          onClick={() => {
            setActiveTab("update");
          }}
          className={`${styles.tab} ${
            activeTab === "update" ? styles.tabActive : ""
          }`}
        >
          <svg
            className={styles.tabIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Update Category
        </button>
        <button
          onClick={() => {
            setActiveTab("reorder");
            setEditingCategory(null);
          }}
          className={`${styles.tab} ${
            activeTab === "reorder" ? styles.tabActive : ""
          }`}
        >
          <svg
            className={styles.tabIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
            />
          </svg>
          Reorder
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "list" && <CategoryList onEdit={handleEdit} />}
        {activeTab === "add" && <AddCategory onSuccess={handleSuccess} />}
        {activeTab === "update" && (
          <UpdateCategory
            onSuccess={handleSuccess}
            editingCategory={editingCategory}
            onCancelEdit={handleCancelEdit}
          />
        )}
        {activeTab === "reorder" && <DraggableCategoryList />}
      </div>
    </div>
  );
}
