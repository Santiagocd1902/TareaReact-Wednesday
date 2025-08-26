// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuusmlnpiblmgmtlbxzb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51dXNtbG5waWJsbWdtdGxieHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNzk0MTYsImV4cCI6MjA3MTc1NTQxNn0.jajjomGHEApcFwXkmmxskE8JzZ4anGfm3E3x7wgNZcw';
export const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase; // 👈 muy importante