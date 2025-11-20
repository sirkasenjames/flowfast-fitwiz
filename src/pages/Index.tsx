import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ImprovedGoalSelection } from "@/components/ImprovedGoalSelection";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to daily-plan
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/daily-plan");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen relative">
      <ImprovedGoalSelection />
    </div>
  );
};

export default Index;
