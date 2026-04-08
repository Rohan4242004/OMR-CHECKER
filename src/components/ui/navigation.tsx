import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Users, BarChart3 } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card shadow-card border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">OMR Checker</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`hover:text-primary transition-colors ${
                isActive("/") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/admin"
              className={`hover:text-primary transition-colors ${
                isActive("/admin") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Admin
            </Link>
            <Link
              to="/student"
              className={`hover:text-primary transition-colors ${
                isActive("/student") ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Student
            </Link>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`px-4 py-2 hover:text-primary transition-colors ${
                  isActive("/") ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/admin"
                className={`px-4 py-2 hover:text-primary transition-colors ${
                  isActive("/admin") ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
              <Link
                to="/student"
                className={`px-4 py-2 hover:text-primary transition-colors ${
                  isActive("/student") ? "text-primary font-medium" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Student Dashboard
              </Link>
              <div className="px-4 pt-4 border-t flex flex-col space-y-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;