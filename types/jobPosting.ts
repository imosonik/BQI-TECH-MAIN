export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  postedDate: string;
  isActive: boolean;
  employmentType: string;
  category: string;
  requirements?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
}
