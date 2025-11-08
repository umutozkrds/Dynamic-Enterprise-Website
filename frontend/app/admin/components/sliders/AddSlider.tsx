"use client";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { createSlider, fetchSliders } from "../../../restapi/slider";
import { useState } from "react";
import styles from "./sliders.module.css";

interface AddSliderProps {
  onSuccess?: () => void;
}

export default function AddSlider({ onSuccess }: AddSliderProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.slider);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.title || !formData.subtitle || !formData.image_url) {
      setFormError("All fields are required");
      return;
    }

    try {
      await dispatch(createSlider(formData as any)).unwrap();
      // Refetch sliders to get the latest data from the database
      await dispatch(fetchSliders());
      setFormSuccess("Slider created successfully!");
      setFormData({
        title: "",
        subtitle: "",
        image_url: "",
      });
      setTimeout(() => {
        setFormSuccess("");
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setFormError(error || "Failed to create slider");
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="Enter slider title"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="subtitle" className={styles.label}>
            Subtitle *
          </label>
          <textarea
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className={styles.textarea}
            placeholder="Enter slider subtitle"
            rows={4}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image_url" className={styles.label}>
            Image URL *
          </label>
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="https://example.com/image.jpg"
            required
          />
          {formData.image_url && (
            <div className={styles.imagePreview}>
              <img
                src={formData.image_url}
                alt="Preview"
                className={styles.previewImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
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
                Create Slider
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: "",
                subtitle: "",
                image_url: "",
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

