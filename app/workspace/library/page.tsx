"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CloudUpload,
  Sparkles,
  ListFilter,
  LayoutGrid,
  List,
  Ellipsis,
  ChevronDown,
  FileText,
  Presentation,
  Trash2,
  Copy,
  ExternalLink,
  Download,
  Plus,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LibraryItem {
  id: string;
  title: string;
  date: string;
  category: "Presentations" | "Documents" | "Sheets" | "Images";
  type: "doc" | "slides";
  aspect: "portrait-centered" | "full";
  image: string;
  size?: string;
  slidesCount?: number;
}

const INITIAL_OUTPUTS: LibraryItem[] = [
  {
    id: "1",
    title: "Dokie Product Introduction",
    date: "Sep 22, 2026",
    category: "Documents",
    type: "doc",
    aspect: "portrait-centered",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_10036/project_653998/6b/764625ed15.png?imageMogr2/format/webp",
    size: "1.4 MB",
    slidesCount: 8,
  },
  {
    id: "2",
    title: "Dokie Product Guide",
    date: "Sep 22, 2026",
    category: "Presentations",
    type: "slides",
    aspect: "full",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_10036/project_660704/8f/bc0c9c0c37.png?imageMogr2/format/webp",
    size: "2.1 MB",
    slidesCount: 12,
  },
  {
    id: "3",
    title: "Dokie Product Introduction",
    date: "Sep 22, 2026",
    category: "Presentations",
    type: "slides",
    aspect: "full",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_10036/project_660703/b8/599bee543b.png?imageMogr2/format/webp",
    size: "3.2 MB",
    slidesCount: 16,
  },
  {
    id: "4",
    title: "X-Men History in Marvel",
    date: "Mar 24, 2026",
    category: "Presentations",
    type: "slides",
    aspect: "full",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_191259/project_473808/03/7435fbf299.png?imageMogr2/format/webp",
    size: "4.8 MB",
    slidesCount: 24,
  },
  {
    id: "5",
    title: "Dokie Tutorial",
    date: "Oct 28, 2025",
    category: "Presentations",
    type: "slides",
    aspect: "full",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_10001/project_4107/47/0a2daf4400ab5fd859285268b3801714.jpg?imageMogr2/format/webp",
    size: "1.8 MB",
    slidesCount: 10,
  },
];

const INITIAL_UPLOADED: LibraryItem[] = [
  {
    id: "up-1",
    title: "Quarterly Strategy Q3.pdf",
    date: "Sep 18, 2026",
    category: "Documents",
    type: "doc",
    aspect: "full",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_10036/project_660704/8f/bc0c9c0c37.png?imageMogr2/format/webp",
    size: "3.4 MB",
  },
  {
    id: "up-2",
    title: "Product Architecture Diagram.png",
    date: "Sep 10, 2026",
    category: "Images",
    type: "doc",
    aspect: "full",
    image:
      "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_191259/project_473808/03/7435fbf299.png?imageMogr2/format/webp",
    size: "820 KB",
  },
];

const FILTER_OPTIONS = ["All", "Presentations", "Documents", "Sheets", "Images"];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<"outputs" | "uploaded">("outputs");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [items, setItems] = useState<LibraryItem[]>(INITIAL_OUTPUTS);
  const [uploadedItems, setUploadedItems] = useState<LibraryItem[]>(INITIAL_UPLOADED);

  const filterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
      if (
        activeMenuId &&
        !(e.target as HTMLElement).closest(`[data-menu-container="${activeMenuId}"]`)
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [activeMenuId]);

  const currentList = activeTab === "outputs" ? items : uploadedItems;

  const filteredItems = currentList.filter((item) => {
    if (selectedFilter === "All") return true;
    return item.category === selectedFilter;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const timestamp = Date.now();
    const newUploaded: LibraryItem[] = Array.from(files).map((file, idx) => ({
      id: `custom-${timestamp}-${idx}`,
      title: file.name,
      date: "Sep 22, 2026",
      category: file.name.endsWith(".pdf") || file.name.endsWith(".doc") || file.name.endsWith(".docx")
        ? "Documents"
        : file.name.endsWith(".ppt") || file.name.endsWith(".pptx")
        ? "Presentations"
        : file.name.endsWith(".xls") || file.name.endsWith(".xlsx") || file.name.endsWith(".csv")
        ? "Sheets"
        : "Images",
      type: "doc",
      aspect: "full",
      image:
        "https://ai-ppt-1311181695.cos.na-siliconvalley.myqcloud.com/user_10036/project_660704/8f/bc0c9c0c37.png?imageMogr2/format/webp",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }));

    setUploadedItems((prev) => [...newUploaded, ...prev]);
    setActiveTab("uploaded");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteItem = (id: string) => {
    if (activeTab === "outputs") {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setUploadedItems((prev) => prev.filter((item) => item.id !== id));
    }
    setActiveMenuId(null);
  };

  const handleDuplicateItem = (item: LibraryItem) => {
    const duplicate: LibraryItem = {
      ...item,
      id: `${item.id}-copy`,
      title: `${item.title} (Copy)`,
      date: "Sep 22, 2026",
    };
    if (activeTab === "outputs") {
      setItems((prev) => [duplicate, ...prev]);
    } else {
      setUploadedItems((prev) => [duplicate, ...prev]);
    }
    setActiveMenuId(null);
  };

  return (
    <div className="relative z-0 flex h-full min-h-0 w-full flex-col overflow-hidden text-default">
      {/* Dark Theme Backdrop Blur Layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] dark:bg-[rgba(24,24,24,0.78)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:backdrop-blur-[24px]"
      />

      {/* Main Scrollable View */}
      <div className="relative z-0 flex h-full min-h-0 flex-1 flex-col overflow-y-auto overscroll-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-h-full flex-col pb-12">
          {/* Header Bar */}
          <div className="px-6">
            <div className="mx-auto w-full max-w-[1120px]">
              <header className="flex w-full shrink-0 items-center justify-between pt-6">
                <h1 className="text-default text-2xl font-semibold font-['Figtree'] leading-8 tracking-[-0.6px]">
                  Library
                </h1>
                <div className="relative cursor-pointer">
                  <button
                    data-slot="button"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload files"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-[6px] whitespace-nowrap rounded-full border border-[#020617] bg-[#28282b] pl-3 pr-[16px] font-['Figtree'] text-sm font-medium text-[#f4f4f5] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(2,6,23,0.15)] outline-none transition-colors hover:bg-[#323237] focus-visible:ring-2 focus-visible:ring-[#020617]/25 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
                  >
                    <CloudUpload className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span>Upload</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    accept=".png,.jpg,.jpeg,.gif,.webp,.bmp,.tiff,.ico,.svg,.pdf,.txt,.doc,.docx,.ppt,.pptx,.csv,.xls,.xlsx,.html,.md"
                    multiple
                    type="file"
                    style={{ zIndex: -1 }}
                    onChange={handleFileUpload}
                  />
                </div>
              </header>
            </div>
          </div>

          {/* Sticky Tabs & Controls Bar */}
          <div className="sticky top-0 z-10 shrink-0 border-b border-transparent bg-workspace-content/95 backdrop-blur-md transition-colors">
            <div className="px-6">
              <div className="mx-auto w-full max-w-[1120px]">
                <div className="flex shrink-0 items-center justify-between gap-4 py-6">
                  {/* Left: Tab Switcher (Outputs vs Uploaded) */}
                  <div
                    className="flex shrink-0 items-center gap-1"
                    role="tablist"
                    aria-label="Select library section"
                  >
                    <button
                      data-slot="button"
                      role="tab"
                      aria-selected={activeTab === "outputs"}
                      onClick={() => setActiveTab("outputs")}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer disabled:cursor-not-allowed hover:text-dark dark:hover:text-default h-10 px-3 min-w-20",
                        activeTab === "outputs"
                          ? "bg-light-gray hover:bg-light-gray font-semibold"
                          : "hover:bg-light-gray-hover text-mute hover:text-dark dark:hover:text-default"
                      )}
                    >
                      <Sparkles className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      <span className="text-sm font-medium font-['Figtree'] leading-6 text-default">
                        Outputs
                      </span>
                    </button>

                    <button
                      data-slot="button"
                      role="tab"
                      aria-selected={activeTab === "uploaded"}
                      onClick={() => setActiveTab("uploaded")}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer disabled:cursor-not-allowed hover:text-dark dark:hover:text-default h-10 px-3 min-w-20",
                        activeTab === "uploaded"
                          ? "bg-light-gray hover:bg-light-gray font-semibold"
                          : "hover:bg-light-gray-hover text-mute hover:text-dark dark:hover:text-default"
                      )}
                    >
                      <CloudUpload className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      <span className="text-sm font-medium font-['Figtree'] leading-6 text-default">
                        Uploaded
                      </span>
                    </button>
                  </div>

                  {/* Right: Filter dropdown & View switchers */}
                  <div className="flex shrink-0 items-center gap-2">
                    {/* Filter Dropdown */}
                    <div className="relative" ref={filterRef}>
                      <button
                        data-slot="dropdown-menu-trigger"
                        type="button"
                        aria-label="Filter"
                        aria-haspopup="menu"
                        aria-expanded={isFilterOpen}
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none border border-[var(--border)] shadow-xs hover:bg-light-gray-hover hover:text-dark dark:border-[var(--border)] dark:hover:text-default group bg-transparent h-10 min-w-20 px-3 py-2 cursor-pointer"
                      >
                        <ListFilter className="size-4" strokeWidth={1.8} aria-hidden="true" />
                        <span className="text-sm leading-6">{selectedFilter}</span>
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isFilterOpen && "rotate-180"
                          )}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {isFilterOpen && (
                        <div
                          role="menu"
                          aria-orientation="vertical"
                          className="absolute right-0 top-12 z-50 min-w-36 rounded-xl border border-[var(--border)] bg-workspace-content p-1.5 shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 backdrop-blur-md"
                        >
                          {FILTER_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              role="menuitem"
                              type="button"
                              onClick={() => {
                                setSelectedFilter(opt);
                                setIsFilterOpen(false);
                              }}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-start text-sm transition-colors",
                                selectedFilter === opt
                                  ? "bg-light-gray font-medium text-default"
                                  : "text-mute hover:bg-light-gray-hover hover:text-default"
                              )}
                            >
                              <span>{opt}</span>
                              {selectedFilter === opt && (
                                <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* View Switchers: Grid / List */}
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        data-slot="button"
                        type="button"
                        aria-label="Grid view"
                        aria-pressed={viewMode === "grid"}
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer rounded-full text-default shadow-none size-10",
                          viewMode === "grid"
                            ? "bg-light-gray hover:bg-light-gray text-default"
                            : "hover:bg-light-gray-hover text-mute hover:text-dark dark:hover:text-default"
                        )}
                      >
                        <LayoutGrid className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      </button>

                      <button
                        data-slot="button"
                        type="button"
                        aria-label="List view"
                        aria-pressed={viewMode === "list"}
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none cursor-pointer rounded-full text-default shadow-none size-10",
                          viewMode === "list"
                            ? "bg-light-gray hover:bg-light-gray text-default"
                            : "hover:bg-light-gray-hover text-mute hover:text-dark dark:hover:text-default"
                        )}
                      >
                        <List className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex min-h-0 flex-1 px-6">
            <div className="mx-auto flex w-full max-w-[1120px] min-h-0 flex-1 flex-col">
              {filteredItems.length === 0 ? (
                /* Empty state when no items match */
                <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-[var(--border)] bg-light-gray text-mute">
                    <FolderOpen className="size-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 font-['Figtree'] text-base font-semibold text-default">
                    {activeTab === "outputs" ? "No outputs found" : "No uploaded files"}
                  </h3>
                  <p className="mt-1 text-sm text-mute">
                    {activeTab === "outputs"
                      ? "Start generating presentations or documents to see them here."
                      : "Upload documents or slides to keep them in your library."}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-default bg-dark px-4 py-2 text-xs font-medium text-dark-foreground transition-all hover:bg-dark/90 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    Upload file
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                /* ========================================================================= */
                /* 1. GRID VIEW MODE                                                         */
                /* ========================================================================= */
                <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="group flex w-full min-w-0 flex-col gap-1 rounded-xl p-2 transition-all"
                    >
                      {/* Thumbnail Container */}
                      <button
                        type="button"
                        aria-label={item.title}
                        className="aspect-[264/148.5] w-full cursor-pointer overflow-hidden rounded-xl outline-none"
                      >
                        <div className="relative size-full overflow-hidden rounded-xl border border-[var(--border)] bg-light-gray shadow-none outline-none transition-transform duration-200 group-hover:scale-[1.015]">
                          {item.aspect === "portrait-centered" ? (
                            <div className="flex size-full min-h-0 min-w-0 items-center justify-center bg-light-gray">
                              <div
                                className="h-full min-h-0 min-w-0 overflow-hidden shadow-xs"
                                style={{ aspectRatio: "3 / 4" }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  alt={item.title}
                                  loading="lazy"
                                  decoding="async"
                                  className="size-full object-cover object-top"
                                  src={item.image}
                                />
                              </div>
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                              className="size-full object-cover object-top"
                              src={item.image}
                            />
                          )}
                        </div>
                      </button>

                      {/* Card Caption & Actions */}
                      <div className="relative flex items-start gap-2.5 py-1">
                        <div className="min-w-0 flex-1">
                          <div
                            title={item.title}
                            className="truncate text-sm font-medium font-['Figtree'] leading-5 text-default"
                          >
                            {item.title}
                          </div>
                          <div className="text-xs font-normal font-['Figtree'] leading-4 text-mute">
                            {item.date}
                          </div>
                        </div>

                        {/* Card More Button & Dropdown */}
                        <div
                          className="relative"
                          data-menu-container={item.id}
                        >
                          <button
                            data-slot="button"
                            type="button"
                            aria-label="More"
                            aria-haspopup="menu"
                            aria-expanded={activeMenuId === item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId((prev) => (prev === item.id ? null : item.id));
                            }}
                            className={cn(
                              "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium outline-none has-[>svg]:px-1.5 size-6 shrink-0 cursor-pointer rounded-lg p-0 text-default transition-all focus:pointer-events-auto focus:opacity-100 focus-visible:ring-2 focus-visible:ring-blue/30",
                              activeMenuId === item.id
                                ? "pointer-events-auto opacity-100 bg-light-gray-hover"
                                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 hover:bg-light-gray-hover hover:text-dark dark:hover:text-default"
                            )}
                          >
                            <Ellipsis
                              className="size-4 text-default"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          </button>

                          {/* Context Menu Dropdown */}
                          {activeMenuId === item.id && (
                            <div
                              role="menu"
                              aria-orientation="vertical"
                              className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-[var(--border)] bg-workspace-content p-1 text-xs shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 backdrop-blur-md"
                            >
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => setActiveMenuId(null)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-default hover:bg-light-gray-hover transition-colors"
                              >
                                <ExternalLink className="size-3.5 text-mute" />
                                <span>Open project</span>
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => handleDuplicateItem(item)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-default hover:bg-light-gray-hover transition-colors"
                              >
                                <Copy className="size-3.5 text-mute" />
                                <span>Make a copy</span>
                              </button>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => setActiveMenuId(null)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-default hover:bg-light-gray-hover transition-colors"
                              >
                                <Download className="size-3.5 text-mute" />
                                <span>Download</span>
                              </button>
                              <div className="my-1 h-px bg-[var(--border)]" />
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => handleDeleteItem(item.id)}
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-red-600 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* ========================================================================= */
                /* 2. LIST VIEW MODE (BORDERLESS)                                            */
                /* ========================================================================= */
                <div className="w-full bg-transparent overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs font-medium text-mute">
                    <div className="col-span-6 sm:col-span-5">Name</div>
                    <div className="hidden sm:block sm:col-span-3">Category</div>
                    <div className="col-span-4 sm:col-span-3">Modified</div>
                    <div className="col-span-2 sm:col-span-1 text-end">Actions</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-1">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="group grid grid-cols-12 items-center gap-4 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-light-gray cursor-pointer"
                      >
                        {/* Title & Preview Thumbnail */}
                        <div className="col-span-6 flex min-w-0 items-center gap-3 sm:col-span-5">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-light-gray">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt={item.title}
                              src={item.image}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-medium font-['Figtree'] text-default">
                              {item.title}
                            </div>
                            <div className="text-xs text-mute sm:hidden">{item.category}</div>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="hidden sm:flex sm:col-span-3 items-center gap-1.5 text-xs text-mute">
                          {item.type === "slides" ? (
                            <Presentation className="size-3.5" />
                          ) : (
                            <FileText className="size-3.5" />
                          )}
                          <span>{item.category}</span>
                        </div>

                        {/* Date */}
                        <div className="col-span-4 sm:col-span-3 text-xs font-['Figtree'] text-mute">
                          {item.date}
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 sm:col-span-1 flex justify-end">
                          <div className="relative" data-menu-container={item.id}>
                            <button
                              type="button"
                              aria-label="More"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId((prev) => (prev === item.id ? null : item.id));
                              }}
                              className="inline-flex size-7 items-center justify-center rounded-lg text-default hover:bg-light-gray-hover transition-colors cursor-pointer"
                            >
                              <Ellipsis className="size-4 text-default" strokeWidth={1.8} />
                            </button>

                            {activeMenuId === item.id && (
                              <div
                                role="menu"
                                aria-orientation="vertical"
                                className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-[var(--border)] bg-workspace-content p-1 text-xs shadow-lg animate-in fade-in-0 zoom-in-95 backdrop-blur-md"
                              >
                                <button
                                  type="button"
                                  onClick={() => setActiveMenuId(null)}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-default hover:bg-light-gray-hover transition-colors"
                                >
                                  <ExternalLink className="size-3.5 text-mute" />
                                  <span>Open project</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicateItem(item)}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-default hover:bg-light-gray-hover transition-colors"
                                >
                                  <Copy className="size-3.5 text-mute" />
                                  <span>Make a copy</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-start text-red-600 hover:bg-red-500/10 transition-colors"
                                >
                                  <Trash2 className="size-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Watermark SVG at bottom-right corner */}
      <div className="pointer-events-none absolute bottom-[-18px] end-[-10px] z-0 text-[220px] leading-none opacity-50 dark:opacity-10 text-light-gray select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="296"
          height="264"
          fill="none"
          viewBox="0 0 296 264"
          aria-hidden="true"
        >
          <path
            fill="#020617"
            fillRule="evenodd"
            d="M277.553 95.896c-3.141-5.41-10.075-7.25-15.484-4.109-5.407 3.142-7.243 10.07-4.104 15.479 19.136 32.955 28.596 78.774 19.592 114.218-4.773 18.788-13.728 35.13-27.263 47.079-13.447 11.869-32.127 20.043-57.571 21.419-45.409 2.454-73.747-14.864-89.827-32.95-13.071-14.702-27.372-39.666 2.439-26.329 6.383 2.856 14.323 6.47 22.243 8.212 8.174 1.799 17.866 1.967 26.915-3.688 17.02-10.638 19.595-30.787 15.894-46.83-3.744-16.225-14.679-32.998-31.306-40.388-15.187-6.75-31.179-7.059-44.618-1.034-13.547 6.073-23.544 18.181-27.093 34.149-1.357 6.106 2.494 12.158 8.6 13.516 6.105 1.357 12.158-2.493 13.515-8.599 2.057-9.252 7.476-15.358 14.246-18.393 6.878-3.083 16.112-3.398 26.147 1.061 8.594 3.82 15.876 13.677 18.438 24.776 2.603 11.28-.432 19.156-5.829 22.53-2.16 1.35-5.082 1.871-10.043.779-5.214-1.147-10.933-3.666-17.857-6.763-6.292-2.815-14.093-6.367-21.551-7.759-8.005-1.494-17.628-.848-25.411 6.935-2.559 2.559-3.696 5.602-4.232 7.875-.556 2.364-.671 4.766-.58 6.974.183 4.423 1.254 9.376 2.975 14.428 3.468 10.182 10.062 22.221 20.18 33.601 20.502 23.059 55.444 43.355 107.978 40.515 29.931-1.618 53.637-11.433 71.34-27.06 17.612-15.548 28.571-36.217 34.226-58.476 10.422-41.024-.109-93.537-21.959-131.168m-67.29 76.468c0-47.497-49.689-92.173-117.54-84.904-6.22.667-10.722 6.249-10.055 12.468s6.248 10.721 12.467 10.055c57.7-6.182 92.476 31.407 92.476 62.381 0 6.255 5.071 11.326 11.326 11.326s11.326-5.071 11.326-11.326m-41.95-111.812c-6.03-1.66-12.266 1.88-13.927 7.911s1.882 12.266 7.912 13.927c43.067 11.862 67.349 45.06 67.349 81.563 0 6.255 5.071 11.327 11.326 11.327 6.255-.001 11.326-5.072 11.326-11.327 0-47.57-31.96-89.071-83.986-103.401"
            clipRule="evenodd"
            opacity="0.04"
          />
        </svg>
      </div>
    </div>
  );
}
