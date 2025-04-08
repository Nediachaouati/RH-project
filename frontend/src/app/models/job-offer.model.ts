export interface JobOffer {
  id: number;
  title: string;
  description: string;
  numberOfPositions: number;
  jobType: string;
  experience: string;
  educationLevel: string;
  salaryRange: string;
  gender?: string;
  language: string;
  requirements: string;
  postedDate: string;
  expirationDate?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: number;
    name: string;
    email: string;
    // Add other user attributes if needed
  };
  isActive: boolean;
}
