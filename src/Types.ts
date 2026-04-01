
export interface DoctorProfile {
  id: number;
  email: string;
  name: string;
  password: string;
  profileImage: string | null;
  profilePublicId: string | null;
  profileColor: string;
  gender: "MALE" | "FEMALE";
  addresses: Address[] | null;
  phone: string | null;
  role: "DOCTOR";
  dateOfBirth: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: number;
  userId: number;
  specialty: string;
  degree: string;
  experience: number;
  fee: number;
  about: string;
  isActive: boolean;
  ratingAverage: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  profile: DoctorProfile;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface UserData {
  id: number;
  name: string;
  email: string;
  gender: string;
  role: string;
  profileColor: string;
  profileImage: string | null;
  profilePublicId: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  addresses: Address[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentsResponse {
  status: number;
  appointments: Appointment[];
}

export interface Appointment {
  id: number;
  appointmentDate: string; // ISO date string
  patientId: number;
  doctorId: number;
  isCancel: boolean;
  isCompleted: boolean;
  isPaid: boolean;
  canceledByUserId: number | null;
  cancellationReason: string | null;
  completedByUserId: number | null;
  completionSummary: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  doctor: AppointmentDoctor;
  reviews?:
    | {
        rating: number;
        comment: string;
        createdAt: string;
      }[]
    | null;
}

export interface AppointmentDoctor {
  fee: number;
  specialty: string;
  profile: AppointmentDoctorProfile;
}

export interface AppointmentDoctorProfile {
  name: string;
  profileColor: string;
  profileImage: string | null;
  addresses: Address[] | null;
}

export interface Pagination {
  total: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface DoctorFilters {
  specialties?: string[];
  min_fee?: number;
  max_fee?: number;
  min_rating?: number;
  max_rating?: number;
  gender?: "MALE" | "FEMALE";
  sort_by?: "newly" | "alphabetically";
  name?: string;
}

export interface ReviewPerson {
  name: string;
  profileImage: string | null;
  profileColor: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  patient: ReviewPerson;
  doctor: ReviewPerson;
}

export interface ReviewResponse {
  status: number;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  pagination: Pagination;
}

export interface RelatedDoctorsResponse {
  status: number;
  doctor:Doctor;
  related_doctors: Doctor[];
  weeklyBookings:WeeklyBooking[];

}
export interface WeeklyBooking {
  id: number;
  appointmentDate: string;
  patientId: number;
  doctorId: number;
  isCancel: boolean;
  isCompleted: boolean;
  canceledByUserId: number | null;
  completedByUserId: number | null;
  cancellationReason: string | null;
  completionSummary: string | null;
  createdAt: string;
  updatedAt: string;
}
 