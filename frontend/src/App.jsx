// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import Header from './components/Header';
// import './App.css';

// // Simple test component
// const TestComponent = () => {
//   return (
//     <div className="min-h-screen bg-blue-100 flex items-center justify-center">
//       <div className="text-center">
//         <h1 className="text-4xl font-bold text-blue-900 mb-4">MittArv</h1>
//         <p className="text-xl text-blue-700">App is working with Header!</p>
//         <div className="mt-8">
//           <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
//             Test Button
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//           <Header />
//           <main className="relative">
//             <Routes>
//               <Route path="/" element={<TestComponent />} />
//             </Routes>
//           </main>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Bookmarks from "./pages/Bookmarks";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Header />
          <main className="relative">
            <Routes>
              {/* Public Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Authenticated / Main Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/bookmarks" element={<Bookmarks />} />

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <div className="p-8 text-center text-red-600">
                    <h1 className="text-3xl font-bold mb-4">404 Not Found</h1>
                    <p>Oops! The page you are looking for does not exist.</p>
                  </div>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
