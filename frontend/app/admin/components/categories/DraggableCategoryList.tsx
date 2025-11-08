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
import {
  fetchCategories,
  bulkReorderCategories,
} from "../../../restapi/category";
import { updateCategoryOrder } from "../../../store/slices/categorySlice";
import type { Category } from "../../../interfaces/category";
import styles from "./categories.module.css";

interface SortableItemProps {
  category: Category;
  isParent: boolean;
  hasChildren: boolean;
  childrenCount: number;
}

function SortableItem({
  category,
  isParent,
  hasChildren,
  childrenCount,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.draggableItem} ${
        !isParent ? styles.subcategoryDraggableItem : ""
      }`}
      {...attributes}
    >
      <div className={styles.dragHandle} {...listeners}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
        </svg>
      </div>
      {!isParent && (
        <div className={styles.childIndicator}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="2" />
          </svg>
        </div>
      )}
      <div className={styles.categoryItemContent}>
        <div className={styles.categoryItemInfo}>
          <h4>{category.name}</h4>
          <p className={styles.categorySlug}>/{category.slug}</p>
          <div className={styles.categoryMeta}>
            <span className={styles.orderBadge}>Order: {category.order}</span>
            {category.parent_id && (
              <span className={styles.parentBadge}>Subcategory</span>
            )}
            {hasChildren && (
              <span className={styles.childrenCountBadge}>
                {childrenCount}{" "}
                {childrenCount === 1 ? "subcategory" : "subcategories"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DraggableCategoryList() {
  const { categories, loading, error } = useAppSelector(
    (state) => state.category
  );
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setItems([...categories]);
  }, [categories]);

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Group categories by parent
  const groupedCategories = items.reduce((acc: any, category: Category) => {
    const parentId = category.parent_id || "root";
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(category);
    return acc;
  }, {});

  // Sort each group by order
  Object.keys(groupedCategories).forEach((key) => {
    groupedCategories[key].sort(
      (a: Category, b: Category) => a.order - b.order
    );
  });

  const rootCategories = groupedCategories["root"] || [];

  const handleDragEnd = (
    event: DragEndEvent,
    parentId: number | null = null
  ) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const parentKey = parentId || "root";
      const siblings = groupedCategories[parentKey] || [];

      const oldIndex = siblings.findIndex(
        (item: Category) => item.id === active.id
      );
      const newIndex = siblings.findIndex(
        (item: Category) => item.id === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        // Reorder the siblings array
        const reorderedSiblings = arrayMove(siblings, oldIndex, newIndex);

        // Assign new order values to reordered siblings
        const updatedSiblings = reorderedSiblings.map((sibling, index) => ({
          ...sibling,
          order: index,
        }));

        // Update the full items list with new order for these siblings
        const updatedItems = items.map((item) => {
          const updatedSibling = updatedSiblings.find((s) => s.id === item.id);
          return updatedSibling || item;
        });

        setItems(updatedItems);
        dispatch(updateCategoryOrder(updatedItems));
      }
    }
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Create the reorder payload with the current order values from items
      const reorderPayload = items.map((item) => ({
        id: item.id,
        order: item.order, // Use the order already set by drag-and-drop
      }));

      console.log("Saving order:", reorderPayload); // Debug log

      await dispatch(bulkReorderCategories(reorderPayload)).unwrap();
      setSaveMessage({ type: "success", text: "Order saved successfully!" });

      // Refresh the list to get updated data from server
      await dispatch(fetchCategories());

      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error: unknown) {
      console.error("Failed to save order:", error);
      setSaveMessage({
        type: "error",
        text: (error as string) || "Failed to save order",
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && items.length === 0) {
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <p>No categories found. Add some categories to get started!</p>
      </div>
    );
  }

  return (
    <div className={styles.draggableListContainer}>
      <div className={styles.draggableHeader}>
        <h3>Drag to Reorder Categories</h3>
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

      {/* Parent Categories Draggable Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e, null)}
      >
        <SortableContext
          items={rootCategories.map((item: Category) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.draggableList}>
            {rootCategories.map((parentCategory: Category) => {
              const children = groupedCategories[parentCategory.id] || [];
              const hasChildren = children.length > 0;
              const isExpanded = expandedCategories.has(parentCategory.id);

              return (
                <div
                  key={parentCategory.id}
                  className={styles.accordionSection}
                >
                  {/* Accordion Toggle & Parent Category */}
                  <div className={styles.accordionItemWrapper}>
                    {hasChildren && (
                      <button
                        className={styles.accordionToggleBtn}
                        onClick={() => toggleCategory(parentCategory.id)}
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

                    <SortableItem
                      category={parentCategory}
                      isParent={true}
                      hasChildren={hasChildren}
                      childrenCount={children.length}
                    />
                  </div>

                  {/* Child Categories */}
                  {hasChildren && isExpanded && (
                    <div className={styles.childCategoriesContainer}>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleDragEnd(e, parentCategory.id)}
                      >
                        <SortableContext
                          items={children.map((item: Category) => item.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {children.map((child: Category) => (
                            <SortableItem
                              key={child.id}
                              category={child}
                              isParent={false}
                              hasChildren={false}
                              childrenCount={0}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
