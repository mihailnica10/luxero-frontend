export interface Category {
  slug: string;
  name: string;
  label: string;
  iconName: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}