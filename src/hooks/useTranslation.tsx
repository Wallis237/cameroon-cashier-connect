
import { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'Dashboard': 'Dashboard',
    'Sales': 'Sales',
    'Products': 'Products',
    'Inventory': 'Inventory',
    'Reports': 'Reports',
    'Settings': 'Settings',
    'Profile': 'Profile',
    'Add Product': 'Add Product',
    
    // Settings page
    'Configure your boutique POS system preferences': 'Configure your boutique POS system preferences',
    'Shop Information': 'Shop Information',
    'Basic information about your boutique': 'Basic information about your boutique',
    'Shop Name': 'Shop Name',
    'Enter your shop name': 'Enter your shop name',
    'Address': 'Address',
    'Enter your shop address': 'Enter your shop address',
    'Phone Number': 'Phone Number',
    'Email': 'Email',
    'Currency & Pricing': 'Currency & Pricing',
    'Configure currency and pricing preferences': 'Configure currency and pricing preferences',
    'Default Currency': 'Default Currency',
    'Tax Rate (%)': 'Tax Rate (%)',
    'Low Stock Alert Threshold': 'Low Stock Alert Threshold',
    'Appearance': 'Appearance',
    'Customize the look and feel of your POS': 'Customize the look and feel of your POS',
    'Theme': 'Theme',
    'Language': 'Language',
    'Date Format': 'Date Format',
    'Light Mode': 'Light Mode',
    'Dark Mode': 'Dark Mode',
    'System Default': 'System Default',
    'English': 'English',
    'Save All Settings': 'Save All Settings',
    
    // Common
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Add': 'Add',
    'Edit': 'Edit',
    'Delete': 'Delete',
  },
  fr: {
    // Navigation
    'Dashboard': 'Tableau de bord',
    'Sales': 'Ventes',
    'Products': 'Produits',
    'Inventory': 'Inventaire',
    'Reports': 'Rapports',
    'Settings': 'Paramètres',
    'Profile': 'Profil',
    'Add Product': 'Ajouter Produit',
    
    // Settings page
    'Configure your boutique POS system preferences': 'Configurez les préférences de votre système de caisse boutique',
    'Shop Information': 'Informations de la boutique',
    'Basic information about your boutique': 'Informations de base sur votre boutique',
    'Shop Name': 'Nom de la boutique',
    'Enter your shop name': 'Entrez le nom de votre boutique',
    'Address': 'Adresse',
    'Enter your shop address': 'Entrez l\'adresse de votre boutique',
    'Phone Number': 'Numéro de téléphone',
    'Email': 'E-mail',
    'Currency & Pricing': 'Devise et tarification',
    'Configure currency and pricing preferences': 'Configurez les préférences de devise et de tarification',
    'Default Currency': 'Devise par défaut',
    'Tax Rate (%)': 'Taux de taxe (%)',
    'Low Stock Alert Threshold': 'Seuil d\'alerte de stock faible',
    'Appearance': 'Apparence',
    'Customize the look and feel of your POS': 'Personnalisez l\'apparence de votre PDV',
    'Theme': 'Thème',
    'Language': 'Langue',
    'Date Format': 'Format de date',
    'Light Mode': 'Mode clair',
    'Dark Mode': 'Mode sombre',
    'System Default': 'Système par défaut',
    'English': 'Anglais',
    'Save All Settings': 'Sauvegarder tous les paramètres',
    
    // Common
    'Cancel': 'Annuler',
    'Save': 'Sauvegarder',
    'Add': 'Ajouter',
    'Edit': 'Modifier',
    'Delete': 'Supprimer',
  }
};

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
