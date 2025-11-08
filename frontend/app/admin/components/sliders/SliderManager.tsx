"use client";

import { useState } from "react";
import SliderList from "./SliderList";
import AddSlider from "./AddSlider";
import UpdateSlider from "./UpdateSlider";
import styles from "./sliders.module.css";

export default function SliderManager() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "update">("list");

  return (
    <div className={styles.section}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("list")}
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
          Slider List
        </button>
        <button
          onClick={() => setActiveTab("add")}
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
          Add Slider
        </button>
        <button
          onClick={() => setActiveTab("update")}
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
          Update Slider
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "list" && <SliderList />}
        {activeTab === "add" && (
          <AddSlider onSuccess={() => setActiveTab("list")} />
        )}
        {activeTab === "update" && (
          <UpdateSlider onSuccess={() => setActiveTab("list")} />
        )}
      </div>
    </div>
  );
}

