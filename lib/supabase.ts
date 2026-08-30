import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://bklftlgrfvwashzhmjwb.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbGZ0bGdyZnZ3YXNoemhtandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMzcxNDIsImV4cCI6MjEwMzYxMzE0Mn0.wQzErgAp29u0DQrgczigjjanbzYbJX-Oa6dy5q3-zZ0";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
