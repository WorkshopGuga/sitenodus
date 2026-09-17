import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Frente from "./pages/Frente";
import Cases from "./pages/Cases";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contato from "./pages/Contato";
import Privacidade from "./pages/Privacidade";
import NotFound from "./pages/NotFound";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminEmpresas from "./admin/AdminEmpresas";
import AdminDepoimentos from "./admin/AdminDepoimentos";
import AdminCases from "./admin/AdminCases";
import AdminGaleria from "./admin/AdminGaleria";
import AdminBlog from "./admin/AdminBlog";
import { FRENTES } from "./content/frentes";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {FRENTES.map((f) => (
          <Route key={f.slug} path={`/${f.slug}`} element={<Frente slug={f.slug} />} />
        ))}
        <Route path="/cases" element={<Cases />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/privacidade" element={<Privacidade />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminEmpresas />} />
          <Route path="empresas" element={<AdminEmpresas />} />
          <Route path="depoimentos" element={<AdminDepoimentos />} />
          <Route path="cases" element={<AdminCases />} />
          <Route path="galeria" element={<AdminGaleria />} />
          <Route path="blog" element={<AdminBlog />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
