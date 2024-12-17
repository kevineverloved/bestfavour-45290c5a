import { supabase } from "@/integrations/supabase/client";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  // We can now directly use the AuthForm since we're using the integrated Supabase client
  return <AuthForm />;
};

export default Auth;