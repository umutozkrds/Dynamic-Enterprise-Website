"use client";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateSlider, fetchSliders } from "../../../restapi/slider";
import { useState, useEffect } from "react";
import styles from "./sliders.module.css";

interface UpdateSliderProps {
  onSuccess?: () => void;
}

export default function UpdateSlider({ onSuccess }: UpdateSliderProps) {
  const dispatch = useAppDispatch();
  const { sliders, loading } = useAppSelector((state) => state.slider);
  const [selectedSliderId, setSelectedSliderId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSliderId && sliders.length > 0) {
      const selectedSlider = sliders.find((s) => s.id === selectedSliderId);
      if (selectedSlider) {
        setFormData({
          title: selectedSlider.title,
          subtitle: selectedSlider.subtitle,
          image_url: selectedSlider.image_url,
        });
      }
    }
  }, [selectedSliderId, sliders]);

  const handleSliderSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sliderId = parseInt(e.target.value);
    setSelectedSliderId(sliderId || null);
    setFormError("");
    setFormSuccess("");
  };

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

    if (!selectedSliderId) {
      setFormError("Please select a slider to update");
      return;
    }

    if (!formData.title || !formData.subtitle || !formData.image_url) {
      setFormError("All fields are required");
      return;
    }

    try {
      await dispatch(
        updateSlider({
          id: selectedSliderId,
          title: formData.title,
          subtitle: formData.subtitle,
          image_url: formData.image_url,
          created_at: "", // Will be ignored by the API
        })
      ).unwrap();
      
      // Refetch sliders to get the latest data from the database
      await dispatch(fetchSliders());
      setFormSuccess("Slider updated successfully!");
      
      setTimeout(() => {
        setFormSuccess("");
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setFormError(error || "Failed to update slider");
    }
  };

  const handleReset = () => {
    if (selectedSliderId && sliders.length > 0) {
      const selectedSlider = sliders.find((s) => s.id === selectedSliderId);
      if (selectedSlider) {
        setFormData({
          title: selectedSlider.title,
          subtitle: selectedSlider.subtitle,
          image_url: selectedSlider.image_url,
        });
      }
    }
    setFormError("");
    setFormSuccess("");
  };

  if (sliders.length === 0) {
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
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className={styles.emptyText}>No sliders found</p>
        <p className={styles.emptySubtext}>
          Create a slider first before updating
        </p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="slider-select" className={styles.label}>
            Select Slider to Update *
          </label>
          <select
            id="slider-select"
            value={selectedSliderId || ""}
            onChange={handleSliderSelect}
            className={styles.select}
            required
          >
            <option value="">-- Choose a slider --</option>
            {sliders.map((slider) => (
              <option key={slider.id} value={slider.id}>
                {slider.title}
              </option>
            ))}
          </select>
        </div>

        {selectedSliderId && (
          <>
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

        {selectedSliderId && (
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
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
                  Update Slider
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              Reset Form
            </button>
          </div>
        )}
      </form>
    </div>
  );
}


