"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { fetchSliders, reorderSliders } from "../../../restapi/slider";
import { updateSliderOrder } from "../../../store/slices/sliderSlice";
import type { Slider } from "../../../interfaces/slider";
import styles from "./sliders.module.css";

interface SortableItemProps {
  slider: Slider;
}

function SortableItem({ slider }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slider.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.draggableItem}
      {...attributes}
    >
      <div className={styles.dragHandle} {...listeners}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>
      <div className={styles.sliderItemContent}>
        <div className={styles.sliderImagePreview}>
          {slider.image_url && (
            <img src={slider.image_url} alt={slider.title} />
          )}
        </div>
        <div className={styles.sliderItemInfo}>
          <h4>{slider.title}</h4>
          <p>{slider.subtitle}</p>
          <span className={styles.orderBadge}>Order: {slider.order}</span>
        </div>
      </div>
    </div>
  );
}

export default function DraggableSliderList() {
  const { sliders, loading, error } = useAppSelector((state) => state.slider);
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Slider[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchSliders());
  }, [dispatch]);

  useEffect(() => {
    setItems([...sliders]);
  }, [sliders]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update local state immediately for smooth UX
        dispatch(updateSliderOrder(newItems));
        
        return newItems;
      });
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Create the reorder payload with updated order values
      const reorderPayload = items.map((item, index) => ({
        id: item.id,
        order: index,
      }));

      await dispatch(reorderSliders(reorderPayload)).unwrap();
      setSaveMessage({ type: "success", text: "Order saved successfully!" });
      
      // Refresh the list to get updated data from server
      await dispatch(fetchSliders());
      
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: any) {
      console.error("Failed to save order:", error);
      setSaveMessage({ type: "error", text: error || "Failed to save order" });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && items.length === 0) {
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

  if (items.length === 0) {
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
        <p>No sliders found. Add some sliders to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.draggableListContainer}>
      <div className={styles.draggableHeader}>
        <h3>Drag to Reorder Sliders</h3>
        <button
          onClick={handleSaveOrder}
          disabled={isSaving}
          className={styles.saveOrderBtn}
        >
          {isSaving ? "Saving..." : "Save Order"}
        </button>
      </div>

      {saveMessage && (
        <div className={`${styles.message} ${styles[saveMessage.type]}`}>
          {saveMessage.text}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.draggableList}>
            {items.map((slider) => (
              <SortableItem key={slider.id} slider={slider} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

