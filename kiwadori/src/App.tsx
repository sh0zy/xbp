import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CourseDetail from './pages/CourseDetail'
import CourseRegister from './pages/CourseRegister'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto max-w-md min-h-screen bg-neutral-950 text-neutral-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses/new" element={<CourseRegister />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
