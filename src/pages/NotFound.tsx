import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="mb-2 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Page not found</p>
        <Button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Back to Dashboard
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
