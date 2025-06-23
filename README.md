# Kebab UMKM Frontend

Frontend aplikasi manajemen UMKM Kebab menggunakan React.js dengan TypeScript.

## Features

- **Landing Page** dengan animasi menarik
- **Dashboard Admin** dengan fitur CRUD lengkap
- **Responsive Design** untuk semua device
- **Authentication** dengan JWT
- **Charts & Analytics** untuk visualisasi data
- **Modern UI/UX** dengan Tailwind CSS

## Tech Stack

- React.js 18 dengan TypeScript
- Tailwind CSS untuk styling
- Framer Motion untuk animasi
- React Router untuk navigasi
- Axios untuk HTTP requests
- Chart.js untuk visualisasi data
- React Hook Form untuk form handling

## Installation

```bash
npm install
```

## Environment Setup

Aplikasi akan otomatis connect ke backend di `http://localhost:5000`. Jika backend berjalan di URL lain, edit `AuthContext.tsx`:

```typescript
axios.defaults.baseURL = 'http://your-backend-url';
```

## Running the Application

### Development
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Test
```bash
npm test
```

## Project Structure

```
frontend/
├── public/
│   ├── index.html         # Main HTML file
│   ├── manifest.json      # PWA manifest
│   └── favicon.ico        # Favicon
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   ├── Footer.tsx          # Footer component
│   │   │   └── DashboardLayout.tsx # Dashboard layout
│   │   └── sections/
│   │       ├── Hero.tsx            # Hero section
│   │       ├── About.tsx           # About section
│   │       ├── Products.tsx        # Products section
│   │       ├── Pricing.tsx         # Pricing section
│   │       └── Contact.tsx         # Contact section
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication context
│   ├── pages/
│   │   ├── Login.tsx               # Login page
│   │   ├── Dashboard.tsx           # Dashboard overview
│   │   ├── ProductsPage.tsx        # Products management
│   │   ├── CustomersPage.tsx       # Customers management
│   │   ├── EmployeesPage.tsx       # Employees management
│   │   └── SalesPage.tsx           # Sales management
│   ├── App.tsx                     # Main App component
│   ├── index.tsx                   # Entry point
│   └── index.css                   # Global styles
├── package.json
├── tailwind.config.js              # Tailwind configuration
└── tsconfig.json                   # TypeScript configuration
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Components

### Layout Components

#### Header
- Responsive navigation
- Mobile hamburger menu
- Brand logo and navigation links
- Call-to-action button

#### Footer
- Company information
- Quick links
- Contact information
- Newsletter signup

#### DashboardLayout
- Sidebar navigation
- User profile section
- Logout functionality
- Responsive design

### Section Components

#### Hero
- Eye-catching headline
- Product showcase
- Call-to-action buttons
- Animated elements

#### About
- Company story
- Value propositions
- Trust indicators
- Visual elements

#### Products
- Product catalog
- Category filtering
- Product cards with pricing
- "View More" functionality

#### Pricing
- Pricing packages
- Feature comparisons
- Popular package highlighting
- Custom package information

#### Contact
- Contact form
- Business information
- Operating hours
- Location details

### Page Components

#### Login
- Email/password form
- Remember me option
- Forgot password link
- Responsive design

#### Dashboard
- Sales statistics
- Quick actions
- Charts and graphs
- Recent activities

#### ProductsPage
- Product listing table
- Add/Edit product modal
- Search and filtering
- Pagination

#### CustomersPage
- Customer listing table
- Add/Edit customer modal
- Customer statistics
- Export functionality

#### EmployeesPage
- Employee listing table
- Add/Edit employee modal
- Employee status management
- Role-based access

#### SalesPage
- Sales listing table
- Add/Edit sale modal
- Date range filtering
- Sales analytics

## Styling

### Tailwind CSS Configuration

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'kebab-red': '#DC2626',
        'kebab-brown': '#92400E',
        'kebab-yellow': '#F59E0B',
        'kebab-green': '#059669',
        'kebab-white': '#FFFFFF'
      },
      fontFamily: {
        'accent': ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}
```

### Custom CSS Classes

```css
.btn-primary {
  @apply bg-kebab-red hover:bg-kebab-brown text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300;
}

.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.accent-font {
  @apply font-accent;
}
```

## State Management

### AuthContext

Mengelola state authentication global:

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Local State

Setiap page menggunakan React hooks untuk local state management:
- `useState` untuk component state
- `useEffect` untuk side effects
- `useNavigate` untuk programmatic navigation

## API Integration

### Axios Configuration

```typescript
// Base URL configuration
axios.defaults.baseURL = 'http://localhost:5000';

// Request interceptor for auth token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Error Handling

```typescript
try {
  const response = await axios.get('/api/products');
  setProducts(response.data.data);
} catch (error) {
  setError(error.response?.data?.error || 'Something went wrong');
}
```

## Animations

### Framer Motion

```typescript
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Content */}
</motion.div>

// Button hover effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

## Charts & Analytics

### Chart.js Integration

```typescript
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
```

## Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Responsive Utilities

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy loading pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));

// Suspense wrapper
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

### Image Optimization

- Use WebP format when possible
- Implement lazy loading for images
- Optimize image sizes for different screen sizes

## Deployment

### Build for Production

```bash
npm run build
```

### Static Hosting (Netlify/Vercel)

1. Build the application
2. Upload `build/` folder
3. Configure redirects for SPA routing

### Environment Variables

```env
REACT_APP_API_URL=https://your-api-url.com
REACT_APP_VERSION=1.0.0
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful component names
4. Add proper error handling
5. Test responsive design

## License

This project is licensed under the MIT License.

