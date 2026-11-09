# 🏥 Integrated Healthcare Management System — Frontend

A web-based platform for managing the medical and administrative operations of multiple healthcare facilities (hospitals, clinics, pharmacies, and laboratories) through a single centralized system.

> Graduation project (4th year) — Faculty of Information Engineering, University of Aleppo.
> Supervised by **Dr. Marwa Dahdouh**.

---

## 💡 Project Idea

The system goes beyond storing patient data. Its core idea is to **connect the entire healthcare cycle in one unified workflow**:

```
Appointment → Visit → Diagnosis → Prescription / Lab Request → Dispensing / Lab Results
```

Every step is handled by the appropriate role, and every important action is recorded in the system.

---

## ✨ Key Features

- **Facility Management** — facilities, departments, specializations, and medical staff.
- **Patient Management** — patient profiles, medical records, and medical conditions (e.g. chronic diseases, allergies).
- **Appointments & Visits** — booking, doctor schedules, active visits, and visit history.
- **Diagnoses & Prescriptions** — recording diagnoses and issuing medical prescriptions.
- **Lab Management** — lab test catalog, lab requests, and results entry.
- **Pharmacy Dispensing** — dispensing prescriptions with documented dispensing operations.
- **Role-Based Access Control (RBAC)** — each user only sees what their role allows.
- **Audit Logs** — a log that tracks important operations inside the system.
- **Extensible Architecture** — easy to add new services and modules in the future.

---

## 🔐 Security & Privacy

- **Authentication** using Laravel Sanctum tokens (handled by the backend API).
- **RBAC** enforced on the frontend with route guards:
  - `ProtectedRoute` — requires an authenticated user.
  - `GuestRoute` — login/register pages for unauthenticated users only.
  - `RoleRoute` — restricts pages to specific roles.
- **Facility data independence** — each facility keeps its own data, while basic health information (e.g. chronic diseases, allergies) can be shared with the patient's consent when needed.

---

## 👥 Roles & Dashboards

| Role | Landing Page |
|------|--------------|
| Admin / Manager | `/admin/dashboard` |
| Doctor | `/doctor/dashboard` |
| Patient | `/patient/dashboard` |
| Pharmacist | `/pharmacist/dashboard` |
| Lab Staff | `/lab/dashboard` |

After login, the user is redirected automatically to the dashboard that matches their primary role. The sidebar navigation is also generated per role.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, JavaScript, Tailwind CSS, Vite |
| Routing | React Router v6 (lazy-loaded pages) |
| Server State | TanStack React Query |
| Client State | Zustand (auth, theme, language) |
| Forms & Validation | Formik + Yup |
| HTTP Client | Axios |
| i18n | i18next + react-i18next (Arabic & English, RTL/LTR support) |
| Backend | PHP, Laravel (separate repository) |
| Database | MySQL |
| API | RESTful API |
| Tools | Git, GitHub, Postman, Visual Studio Code |

---

## 🏗️ Architecture & Design Ideas

### Backend (separate repo)
- **MVC** architecture
- **Repository Pattern**
- **Service Layer**

### Frontend — Feature-Based Structure

```
src/
├── app/            # App entry, router, providers
├── core/           # API layer, i18n, shared hooks
│   ├── api/        # axios instance, endpoints, generic CRUD service factory
│   ├── hooks/      # useAuth, useRole, useDirection, useResourceQueries
│   └── i18n/       # ar / en translations
├── features/       # One folder per domain module
│   ├── auth/  admin/  doctor/  patient/  pharmacist/  lab/
│   ├── appointments/  visits/  prescriptions/  dispensings/
│   ├── facilities/  medical-conditions/  lab-tests/  lab-results/
│   └── doctor-schedule/
│       ├── components/  hooks/  services/  pages/
├── shared/         # Reusable UI, layouts, route guards, utilities
├── store/          # Zustand stores (auth, theme, language)
└── types/          # Role definitions and helpers
```

### Main Frontend Ideas
- **Generic CRUD service factory** (`createResourceService`) — one reusable function that generates `list / show / create / update / remove` for any REST resource, avoiding repeated code.
- **Feature modules** — each domain has its own pages, hooks (React Query), and services.
- **Reusable CRUD components** — `CrudPage`, `ResourceFormModal`, `DataTable`, and a shared UI kit (Button, Modal, Card, Badge, Input, Select, ...).
- **Role normalization** — API role formats are normalized into a single role slug used for routing and navigation.
- **Code splitting** — all pages are lazy-loaded to keep the initial bundle small.
- **Multi-language & direction** — Arabic (RTL) and English (LTR) with theme (light/dark) switching.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm or npm

### Installation

```bash
# 1. Install dependencies
pnpm install      # or: npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start the development server
pnpm dev          # or: npm run dev
```

Open `http://localhost:5173` in your browser.

### Environment Variables

```env
VITE_API_URL=<your-backend-api-url>/api
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start the development server |
| `build` | Build for production |
| `preview` | Preview the production build |
| `lint` | Run ESLint on `src` |

---

## 🧪 API Testing

A Postman collection is included in the repository:

```
HealthCare-system.postman_collection.json
```

---

## 🎯 Project Goal

The goal was not only to build a working application, but to **apply what we learned** in software engineering, systems analysis, database design, web development, and teamwork on a real and complex problem.

---

## 🏷️ Tags

`#SoftwareEngineering` `#React` `#Laravel` `#MySQL` `#Healthcare` `#WebDevelopment` `#SoftwareDevelopment`
