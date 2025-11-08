"use client";

import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { fetchSliders, deleteSlider } from "../../../restapi/slider";
import { useEffect, useState } from "react";
import styles from "./sliders.module.css";

export default function SliderList() {
  const { sliders, loading, error } = useAppSelector((state) => state.slider);
  const dispatch = useAppDispatch();
  const [deleteSuccess, setDeleteSuccess] = useState<string>("");
  const [deleteError, setDeleteError] = useState<string>("");

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        setDeleteError("");
        setDeleteSuccess("");
        await dispatch(deleteSlider(id)).unwrap();
        await dispatch(fetchSliders());
        setDeleteSuccess("Slider deleted successfully!");
        setTimeout(() => setDeleteSuccess(""), 3000);
      } catch (error: any) {
        console.error("Failed to delete slider:", error);
        setDeleteError(error || "Failed to delete slider");
        setTimeout(() => setDeleteError(""), 5000);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading sliders...</p>
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
          Click "Add Slider" tab to create your first slider
        </p>
      </div>
    );
  }

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

      <div className={styles.sliderGrid}>
        {sliders.map((slider) => (
          <div key={slider.id} className={styles.sliderCard}>
            <div
              className={styles.sliderCardImage}
              style={{
                backgroundImage: `url(${slider.image_url})`,
              }}
            >
              <div className={styles.sliderCardOverlay}>
                <button className={styles.sliderActionBtn}>
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
                </button>
                <button
                  className={styles.sliderDeleteBtn}
                  onClick={() => handleDelete(slider.id)}
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
                </button>
              </div>
            </div>
            <div className={styles.sliderCardContent}>
              <h3 className={styles.sliderCardTitle}>{slider.title}</h3>
              <p className={styles.sliderCardSubtitle}>{slider.subtitle}</p>
              <p className={styles.sliderCardDate}>
                {new Date(slider.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
