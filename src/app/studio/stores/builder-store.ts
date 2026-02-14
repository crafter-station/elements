import { create } from "zustand";
import type { RegistryItemType, RegistryFileType } from "@/lib/studio/types";

export interface BuilderRegistryFile {
  id: string;
  path: string;
  type: RegistryFileType;
  target: string | null;
  content: string;
}

export interface BuilderRegistryItem {
  id: string;
  name: string;
  type: RegistryItemType;
  title: string | null;
  description: string | null;
  docs: string | null;
  dependencies: string[];
  registryDependencies: string[];
  devDependencies: string[];
  cssVars: {
    theme?: Record<string, string>;
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  css: Record<string, unknown> | null;
  envVars: Record<string, string>;
  categories: string[];
  meta: Record<string, unknown>;
  sortOrder: number;
  files: BuilderRegistryFile[];
}

export interface BuilderRegistry {
  id: string;
  name: string;
  slug: string;
  displayName: string | null;
  homepage: string | null;
  description: string | null;
  isPublic: boolean;
  githubRepoUrl?: string | null;
}

interface BuilderState {
  registry: BuilderRegistry | null;
  items: BuilderRegistryItem[];
  selectedItemId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;

  setRegistry: (registry: BuilderRegistry | null) => void;
  setItems: (items: BuilderRegistryItem[]) => void;
  selectItem: (itemId: string | null) => void;
  addItem: (item: BuilderRegistryItem) => void;
  updateItem: (itemId: string, updates: Partial<BuilderRegistryItem>) => void;
  removeItem: (itemId: string) => void;
  addFile: (itemId: string, file: BuilderRegistryFile) => void;
  updateFile: (
    itemId: string,
    fileId: string,
    updates: Partial<BuilderRegistryFile>,
  ) => void;
  removeFile: (itemId: string, fileId: string) => void;
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
}

const initialState = {
  registry: null,
  items: [],
  selectedItemId: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
};

export const useBuilderStore = create<BuilderState>((set) => ({
  ...initialState,

  setRegistry: (registry) => set({ registry }),

  setItems: (items) => set({ items }),

  selectItem: (itemId) => set({ selectedItemId: itemId }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
      selectedItemId: item.id,
      isDirty: true,
    })),

  updateItem: (itemId, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
      isDirty: true,
    })),

  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
      selectedItemId:
        state.selectedItemId === itemId ? null : state.selectedItemId,
      isDirty: true,
    })),

  addFile: (itemId, file) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, files: [...item.files, file] } : item,
      ),
      isDirty: true,
    })),

  updateFile: (itemId, fileId, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              files: item.files.map((file) =>
                file.id === fileId ? { ...file, ...updates } : file,
              ),
            }
          : item,
      ),
      isDirty: true,
    })),

  removeFile: (itemId, fileId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              files: item.files.filter((file) => file.id !== fileId),
            }
          : item,
      ),
      isDirty: true,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setSaving: (saving) => set({ isSaving: saving }),

  setDirty: (dirty) => set({ isDirty: dirty }),

  reset: () => set(initialState),
}));
