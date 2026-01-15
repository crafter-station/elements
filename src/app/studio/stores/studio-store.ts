import { create } from "zustand";

export interface StudioElement {
  id: string;
  code: string;
  imports: string[];
  position: { x: number; y: number };
}

interface StudioState {
  elements: StudioElement[];
  pendingElements: StudioElement[];
  selectedId: string | null;

  addElement: (element: Omit<StudioElement, "id">) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<StudioElement>) => void;
  selectElement: (id: string | null) => void;

  setPendingElements: (elements: StudioElement[]) => void;
  addPendingElement: (element: Omit<StudioElement, "id">) => void;
  commitPendingElements: () => void;
  clearPendingElements: () => void;

  clearAll: () => void;
}

const createId = () => Math.random().toString(36).slice(2, 9);

export const useStudioStore = create<StudioState>((set, get) => ({
  elements: [],
  pendingElements: [],
  selectedId: null,

  addElement: (element) => {
    const id = createId();
    set((state) => ({
      elements: [...state.elements, { ...element, id }],
      selectedId: id,
    }));
  },

  removeElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el,
      ),
    }));
  },

  selectElement: (id) => set({ selectedId: id }),

  setPendingElements: (elements) => set({ pendingElements: elements }),

  addPendingElement: (element) => {
    const id = `pending-${createId()}`;
    set((state) => ({
      pendingElements: [...state.pendingElements, { ...element, id }],
    }));
  },

  commitPendingElements: () => {
    set((state) => {
      const newElements = state.pendingElements.map((el) => ({
        ...el,
        id: createId(),
      }));
      return {
        elements: [...state.elements, ...newElements],
        pendingElements: [],
        selectedId:
          newElements.length > 0 ? newElements[0].id : state.selectedId,
      };
    });
  },

  clearPendingElements: () => set({ pendingElements: [] }),

  clearAll: () => set({ elements: [], pendingElements: [], selectedId: null }),
}));
