import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase, Profile } from "../lib/supabase";
import { seedInitialLocalData } from "../lib/db";
import type { User, AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoUser: boolean;
  loginAsDemo: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const DEMO_USER: User = {
  id: "demo_farmer_user",
  app_metadata: { provider: "demo" },
  user_metadata: { full_name: "Chaudhry Tariq / چوہدری طارق" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "demo.farmer@fasaldoc.pk",
  phone: "+92 300 7654321",
  role: "authenticated",
  updated_at: new Date().toISOString(),
};

const DEMO_PROFILE: Profile = {
  id: "demo_farmer_user",
  full_name: "Chaudhry Tariq / چوہدری طارق",
  phone: "+92 300 7654321",
  location: "Faisalabad, Punjab (فیصل آباد)",
  farming_type: "both",
  preferred_language: "ur",
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isDemoUser: false,
  loginAsDemo: async () => {},
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => ({ error: null }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (userId === "demo_farmer_user") {
      setProfile(DEMO_PROFILE);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      setProfile(data as Profile);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };
    if (isDemoUser) {
      setProfile(prev => prev ? { ...prev, ...updates } : { ...DEMO_PROFILE, ...updates });
      return { error: null };
    }
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : prev);
    }
    return { error: error?.message || null };
  }, [user, isDemoUser]);

  const loginAsDemo = useCallback(async () => {
    localStorage.setItem("fasaldoc_demo_mode", "true");
    setUser(DEMO_USER);
    setProfile(DEMO_PROFILE);
    setIsDemoUser(true);
    await seedInitialLocalData(DEMO_USER.id);
  }, []);

  useEffect(() => {
    // Check if demo mode was active
    const demoActive = localStorage.getItem("fasaldoc_demo_mode") === "true";
    if (demoActive) {
      setUser(DEMO_USER);
      setProfile(DEMO_PROFILE);
      setIsDemoUser(true);
      seedInitialLocalData(DEMO_USER.id);
      setLoading(false);
      return;
    }

    // Check current Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser.id);
        seedInitialLocalData(currentUser.id);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        setIsDemoUser(false);
        localStorage.removeItem("fasaldoc_demo_mode");
        await fetchProfile(currentUser.id);
        seedInitialLocalData(currentUser.id);
      } else if (!localStorage.getItem("fasaldoc_demo_mode")) {
        setProfile(null);
        setIsDemoUser(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    localStorage.removeItem("fasaldoc_demo_mode");
    setIsDemoUser(false);
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}`,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    localStorage.removeItem("fasaldoc_demo_mode");
    setIsDemoUser(false);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    return { error };
  };

  const signOut = async () => {
    localStorage.removeItem("fasaldoc_demo_mode");
    setIsDemoUser(false);
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isDemoUser,
      loginAsDemo,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);