import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/Theme-provider";
import { Signin, Signup, Blog, Publish, Blogs, MyBlogs } from "./pages";
function App() {
  return (
    <div>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/publish" element={<Publish />} />
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/myblogs" element={<MyBlogs />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
