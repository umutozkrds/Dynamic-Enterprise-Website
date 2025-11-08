"use client";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createCategory, fetchCategories } from "../../../restapi/category";
import { useState, useEffect } from "react";
import styles from "./categories.module.css";

interface AddCategoryProps {
  onSuccess?: () => void;
}

export default function AddCategory({ onSuccess }: AddCategoryProps) {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.category);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent_id: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    
    // Auto-generate slug from name
    if (e.target.name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData({
        ...formData,
        name: value,
        slug: slug,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    }
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.name || !formData.slug) {
      setFormError("Name and slug are required");
      return;
    }

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
      };

      await dispatch(createCategory(categoryData as any)).unwrap();
      await dispatch(fetchCategories());
      setFormSuccess("Category created successfully!");
      setFormData({
        name: "",
        slug: "",
        parent_id: "",
      });
      setTimeout(() => {
        setFormSuccess("");
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setFormError(error || "Failed to create category");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Category Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter category name"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="slug" className={styles.label}>
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="category-slug"
            required
          />
          <p className={styles.helpText}>
            URL-friendly version of the name. Auto-generated from name.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="parent_id" className={styles.label}>
            Parent Category (Optional)
          </label>
          <select
            id="parent_id"
            name="parent_id"
            value={formData.parent_id}
            onChange={handleInputChange}
            className={styles.select}
          >
            <option value="">None (Root Category)</option>
            {categories
              .filter((cat) => !cat.parent_id)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
          <p className={styles.helpText}>
            Select a parent category to create a subcategory.
          </p>
        </div>

        {formError && (
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
            {formError}
          </div>
        )}

        {formSuccess && (
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
            {formSuccess}
          </div>
        )}

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Creating...
              </>
            ) : (
              <>
                <svg
                  className={styles.buttonIcon}
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
                Create Category
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                slug: "",
                parent_id: "",
              });
              setFormError("");
              setFormSuccess("");
            }}
            className={styles.resetButton}
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}

