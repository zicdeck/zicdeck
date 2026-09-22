export interface LibraryItem {
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

export const INITIAL_OUTPUTS: LibraryItem[] = [
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

export const INITIAL_UPLOADED: LibraryItem[] = [
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

export const FILTER_OPTIONS = ["All", "Presentations", "Documents", "Sheets", "Images"];
