import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://dwphefmvhumpltwesvyq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cGhlZm12aHVtcGx0d2VzdnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzA3NzIsImV4cCI6MjA4ODgwNjc3Mn0.pyhHvkmDnkKqXPO5j6p3csFrz9v6gjbu-seShhnivCA"

export const supabase = createClient(supabaseUrl, supabaseKey)