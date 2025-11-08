"use client";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateCategory, fetchCategories } from "../../../restapi/category";
import { useState, useEffect } from "react";
import styles from "./categories.module.css";

interface UpdateCategoryProps {
  onSuccess?: () => void;
  editingCategory?: any;
  onCancelEdit?: () => void;
}

export default function UpdateCategory({ onSuccess, editingCategory, onCancelEdit }: UpdateCategoryProps) {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.category);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
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

  useEffect(() => {
    if (editingCategory) {
      setSelectedCategoryId(editingCategory.id.toString());
      setFormData({
        name: editingCategory.name,
        slug: editingCategory.slug,
        parent_id: editingCategory.parent_id?.toString() || "",
      });
    }
  }, [editingCategory]);

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategoryId(categoryId);
    
    if (categoryId) {
      const category = categories.find((cat) => cat.id === parseInt(categoryId));
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          parent_id: category.parent_id?.toString() || "",
        });
        setFormError("");
        setFormSuccess("");
      }
    } else {
      setFormData({
        name: "",
        slug: "",
        parent_id: "",
      });
    }
  };

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

    if (!selectedCategoryId) {
      setFormError("Please select a category to update");
      return;
    }

    if (!formData.name || !formData.slug) {
      setFormError("Name and slug are required");
      return;
    }

    // Prevent self-referencing
    if (formData.parent_id === selectedCategoryId) {
      setFormError("A category cannot be its own parent");
      return;
    }

    try {
      const categoryData = {
        id: parseInt(selectedCategoryId),
        name: formData.name,
        slug: formData.slug,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
      };

      await dispatch(updateCategory(categoryData)).unwrap();
      await dispatch(fetchCategories());
      setFormSuccess("Category updated successfully!");
      setTimeout(() => {
        setFormSuccess("");
        setSelectedCategoryId("");
        setFormData({
          name: "",
          slug: "",
          parent_id: "",
        });
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setFormError(error || "Failed to update category");
    }
  };

  const handleCancel = () => {
    setSelectedCategoryId("");
    setFormData({
      name: "",
      slug: "",
      parent_id: "",
    });
    setFormError("");
    setFormSuccess("");
    onCancelEdit?.();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {!editingCategory && (
          <div className={styles.formGroup}>
            <label htmlFor="category_select" className={styles.label}>
              Select Category to Update *
            </label>
            <select
              id="category_select"
              value={selectedCategoryId}
              onChange={handleCategorySelect}
              className={styles.select}
              required
            >
              <option value="">-- Select a category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.parent_id ? `↳ ${category.name}` : category.name} (Order: {category.order})
                </option>
              ))}
            </select>
          </div>
        )}

        {(selectedCategoryId || editingCategory) && (
          <>
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
                  .filter((cat) => !cat.parent_id && cat.id.toString() !== selectedCategoryId)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <p className={styles.helpText}>
                Select a parent category to make this a subcategory.
              </p>
            </div>
          </>
        )}

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
            disabled={loading || (!selectedCategoryId && !editingCategory)}
          >
            {loading ? (
              <>
                <div className={styles.buttonSpinner}></div>
                Updating...
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Update Category
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.resetButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

