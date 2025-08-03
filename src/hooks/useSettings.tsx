import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Settings {
  id?: string;
  shop_name: string;
  currency: string;
  theme: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
  shop_name: "My Boutique",
  currency: "XAF",
  theme: "light"
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSettings = async () => {
    if (!user) {
      // Load from localStorage for demo mode
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(defaultSettings);
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const { data: newSettings, error: insertError } = await supabase
          .from('settings')
          .insert({
            user_id: user.id,
            ...defaultSettings
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setSettings(newSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Always update local state immediately for better UX
      setSettings(updatedSettings);
      
      // Apply theme immediately
      if (newSettings.theme) {
        const root = document.documentElement;
        if (newSettings.theme === 'dark') {
          root.classList.add('dark');
        } else if (newSettings.theme === 'light') {
          root.classList.remove('dark');
        } else {
          // Auto mode - check system preference
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          if (mediaQuery.matches) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      }

      if (!user) {
        // Store in localStorage for demo mode
        localStorage.setItem('app-settings', JSON.stringify(updatedSettings));
        
        toast({
          title: "Settings Updated",
          description: "Your preferences have been saved",
        });
        return;
      }

      const { error } = await supabase
        .from('settings')
        .update(newSettings)
        .eq('user_id', user.id);

      if (error) throw error;
      
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully",
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}