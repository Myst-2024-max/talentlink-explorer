
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://yumtyrgposhiptzhxieu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bXR5cmdwb3NoaXB0emh4aWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMDI3NzIsImV4cCI6MjA1NjU3ODc3Mn0.8svrg9kWhXPW5-ySySnLCsKbAR6CZvVGKSpXhuIuEmo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
