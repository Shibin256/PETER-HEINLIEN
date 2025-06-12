
import { Route, Router, Routes } from "react-router-dom"
import AdminRoutes from "./routes/AdminRoutes"
import UserRoutes from "./routes/UserRoutes"
import { Flip, Slide, ToastContainer, Zoom } from "react-toastify"
function App() {
  return (
    <>
      <ToastContainer theme='dark'  hideProgressBar={true}  autoClose={2500}  transition={Slide} />
      <Routes>
              {/* User Routes */}
              <Route path="/*" element={<UserRoutes />} />
              {/* Admin Routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
</>
  )
}

export default App
