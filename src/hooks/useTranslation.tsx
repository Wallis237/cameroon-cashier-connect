
import { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    'Profile': 'Profile',
'Personal Information': 'Personal Information',
'Your account details and contact information': 'Your account details and contact information',
'Edit': 'Edit',
'Cancel': 'Cancel',
'Save Changes': 'Save Changes',
'Account Security': 'Account Security',
'Manage your password and security settings': 'Manage your password and security settings',
'Password': 'Password',
'Last changed 30 days ago': 'Last changed 30 days ago',
'Change Password': 'Change Password',
'Two-Factor Authentication': 'Two-Factor Authentication',
'Add an extra layer of security': 'Add an extra layer of security',
'Enable 2FA': 'Enable 2FA',
'Login Sessions': 'Login Sessions',
'Manage active login sessions': 'Manage active login sessions',
'View Sessions': 'View Sessions',
'Account Details': 'Account Details',
'Joined': 'Joined',
'Performance This Month': 'Performance This Month',
'Recent Activity': 'Recent Activity',
'Shop Owner': 'Shop Owner',
'Active': 'Active',
'Full Name': 'Full Name',
'Email Address': 'Email Address',
'Location': 'Location',
'Processed sale': 'Processed sale',
'Added product': 'Added product',
'Summer Dress - Clothing': 'Summer Dress - Clothing',
'Updated inventory': 'Updated inventory',
"Men's Sneakers - Stock adjustment": "Men's Sneakers - Stock adjustment",
'Generated report': 'Generated report',
'Weekly sales report': 'Weekly sales report',
'Low stock alert': 'Low stock alert',
"Women's Handbag below minimum": "Women's Handbag below minimum",
'Total Sales This Month': 'Total Sales This Month',
'Products Added': 'Products Added',
'Successful Transactions': 'Successful Transactions',
'Customer Satisfaction': 'Customer Satisfaction',
'Manage your account information and preferences': 'Manage your account information and preferences',
'Profile Updated': 'Profile Updated',
'Your profile information has been saved successfully': 'Your profile information has been saved successfully',
'Password Change': 'Password Change',
'Password change functionality would be implemented here': 'Password change functionality would be implemented here',
'2 hours ago': '2 hours ago',
'4 hours ago': '4 hours ago',
'1 day ago': '1 day ago',
'2 days ago': '2 days ago',
'3 days ago': '3 days ago',
    
    // Navigation
    'Dashboard': 'Dashboard',
    'Sales': 'Sales',
    'Products': 'Products',
    'Inventory': 'Inventory',
    'Reports': 'Reports',
    'Settings': 'Settings',
    'Profile': 'Profile',
    'Add Product': 'Add Product',
    'Mado Boutique': 'Mado Boutique',
    'POS System': 'POS System',
    'Main Menu': 'Main Menu',
    'Quick Actions': 'Quick Actions',
    'Account': 'Account',
    'View Stock': 'View Stock',
    'Low Stock': 'Low Stock',
    'Sign Out': 'Sign Out',
    
    // QR Scanner
    'Scan QR Code': 'Scan QR Code',
    'Scan Product QR Code': 'Scan Product QR Code',
    'Camera Access Required': 'Camera Access Required',
    'Please allow camera access to scan QR codes': 'Please allow camera access to scan QR codes',
    'Allow Camera': 'Allow Camera',
    'Initializing camera...': 'Initializing camera...',
    'Point your camera at a QR code to scan': 'Point your camera at a QR code to scan',
    'QR Code Scanned': 'QR Code Scanned',
    'Successfully scanned': 'Successfully scanned',
    'Camera Error': 'Camera Error',
    'Scanner Error': 'Scanner Error',
    
    // Product Scanner
    'Add Product via QR Scan': 'Add Product via QR Scan',
    'Product Name': 'Product Name',
    'Enter product name': 'Enter product name',
    'Category': 'Category',
    'Select category': 'Select category',
    'Clothing': 'Clothing',
    'Accessories': 'Accessories',
    'Shoes': 'Shoes',
    'Bags': 'Bags',
    'Electronics': 'Electronics',
    'Home': 'Home',
    'Other': 'Other',
    'Purchase Price': 'Purchase Price',
    'Enter purchase price': 'Enter purchase price',
    'Selling Price': 'Selling Price',
    'Enter selling price': 'Enter selling price',
    'Quantity': 'Quantity',
    'Enter quantity': 'Enter quantity',
    'Barcode': 'Barcode',
    'Scan QR Code to add product': 'Scan QR Code to add product',
    'Adding product...': 'Adding product...',
    
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
    'French': 'French',
    'Save All Settings': 'Save All Settings',
    
    // Dashboard
    'Today\'s Sales': 'Today\'s Sales',
    'Revenue': 'Revenue',
    'Orders': 'Orders',
    'Products Sold': 'Products Sold',
    'Low Stock Items': 'Low Stock Items',
    'Recent Sales': 'Recent Sales',
    'Total Revenue': 'Total Revenue',
    'Total Orders': 'Total Orders',
    'Total Products': 'Total Products',
    'Items': 'Items',
    
    // Sales
    'Point of Sale': 'Point of Sale',
    'Search products...': 'Search products...',
    'Cart': 'Cart',
    'Your cart is empty': 'Your cart is empty',
    'Add products to start a sale': 'Add products to start a sale',
    'Total': 'Total',
    'Process Sale': 'Process Sale',
    'Clear Cart': 'Clear Cart',
    'In Stock': 'In Stock',
    'Out of Stock': 'Out of Stock',
    'Remove': 'Remove',
    
    // Products
    'Product Management': 'Product Management',
    'Manage your product inventory': 'Manage your product inventory',
    'Name': 'Name',
    'Price': 'Price',
    'Stock': 'Stock',
    'Status': 'Status',
    
    // Common
    'Cancel': 'Cancel',
    'Save': 'Save',
    'Add': 'Add',
    'Edit': 'Edit',
    'Delete': 'Delete',
    'Search': 'Search',
    'Filter': 'Filter',
    'Actions': 'Actions',
    'Loading...': 'Loading...',
    'No data available': 'No data available',
  },
  fr: {
    Profile': 'Profil',
'Personal Information': 'Informations personnelles',
'Your account details and contact information': 'Détails et informations de contact du compte',
'Edit': 'Modifier',
'Cancel': 'Annuler',
'Save Changes': 'Sauvegarder les modifications',
'Account Security': 'Sécurité du compte',
'Manage your password and security settings': 'Gérer le mot de passe et les paramètres de sécurité',
'Password': 'Mot de passe',
'Last changed 30 days ago': 'Dernière modification il y a 30 jours',
'Change Password': 'Changer le mot de passe',
'Two-Factor Authentication': 'Authentification à deux facteurs',
'Add an extra layer of security': 'Ajoutez une couche de sécurité supplémentaire',
'Enable 2FA': 'Activer 2FA',
'Login Sessions': 'Sessions de connexion',
'Manage active login sessions': 'Gérer les sessions actives',
'View Sessions': 'Voir les sessions',
'Account Details': 'Détails du compte',
'Joined': 'Inscrit',
'Performance This Month': 'Performance ce mois-ci',
'Recent Activity': 'Activité récente',
'Shop Owner': 'Propriétaire de la boutique',
'Active': 'Actif',
'Full Name': 'Nom complet',
'Email Address': 'Adresse e-mail',
'Location': 'Localisation',
'Processed sale': 'Vente traitée',
'Added product': 'Produit ajouté',
'Summer Dress - Clothing': 'Robe d\'été - Vêtements',
'Updated inventory': 'Inventaire mis à jour',
"Men's Sneakers - Stock adjustment": "Baskets homme - Ajustement du stock",
'Generated report': 'Rapport généré',
'Weekly sales report': 'Rapport hebdomadaire des ventes',
'Low stock alert': 'Alerte stock faible',
"Women's Handbag below minimum": "Sac à main femme en dessous du minimum",
'Total Sales This Month': 'Ventes totales ce mois-ci',
'Products Added': 'Produits ajoutés',
'Successful Transactions': 'Transactions réussies',
'Customer Satisfaction': 'Satisfaction client',
'Manage your account information and preferences': 'Gérez les informations et préférences de votre compte',
'Profile Updated': 'Profil mis à jour',
'Your profile information has been saved successfully': 'Les informations de votre profil ont été enregistrées avec succès',
'Password Change': 'Changement de mot de passe',
'Password change functionality would be implemented here': 'La fonctionnalité de changement de mot de passe serait implémentée ici',
'2 hours ago': 'il y a 2 heures',
'4 hours ago': 'il y a 4 heures',
'1 day ago': 'il y a 1 jour',
'2 days ago': 'il y a 2 jours',
'3 days ago': 'il y a 3 jours',
    // Navigation
    'Dashboard': 'Tableau de bord',
    'Sales': 'Ventes',
    'Products': 'Produits',
    'Inventory': 'Inventaire',
    'Reports': 'Rapports',
    'Settings': 'Paramètres',
    'Profile': 'Profil',
    'Add Product': 'Ajouter Produit',
    'Mado Boutique': 'Mado Boutique',
    'POS System': 'Système PDV',
    'Main Menu': 'Menu Principal',
    'Quick Actions': 'Actions Rapides',
    'Account': 'Compte',
    'View Stock': 'Voir Stock',
    'Low Stock': 'Stock Bas',
    'Sign Out': 'Déconnexion',
    
    // QR Scanner
    'Scan QR Code': 'Scanner Code QR',
    'Scan Product QR Code': 'Scanner Code QR Produit',
    'Camera Access Required': 'Accès Caméra Requis',
    'Please allow camera access to scan QR codes': 'Veuillez autoriser l\'accès à la caméra pour scanner les codes QR',
    'Allow Camera': 'Autoriser Caméra',
    'Initializing camera...': 'Initialisation caméra...',
    'Point your camera at a QR code to scan': 'Dirigez votre caméra vers un code QR pour scanner',
    'QR Code Scanned': 'Code QR Scanné',
    'Successfully scanned': 'Scanné avec succès',
    'Camera Error': 'Erreur Caméra',
    'Scanner Error': 'Erreur Scanner',
    
    // Product Scanner
    'Add Product via QR Scan': 'Ajouter Produit via Scan QR',
    'Product Name': 'Nom du Produit',
    'Enter product name': 'Entrez le nom du produit',
    'Category': 'Catégorie',
    'Select category': 'Sélectionner catégorie',
    'Clothing': 'Vêtements',
    'Accessories': 'Accessoires',
    'Shoes': 'Chaussures',
    'Bags': 'Sacs',
    'Electronics': 'Électronique',
    'Home': 'Maison',
    'Other': 'Autre',
    'Purchase Price': 'Prix d\'Achat',
    'Enter purchase price': 'Entrez le prix d\'achat',
    'Selling Price': 'Prix de Vente',
    'Enter selling price': 'Entrez le prix de vente',
    'Quantity': 'Quantité',
    'Enter quantity': 'Entrez la quantité',
    'Barcode': 'Code-barres',
    'Scan QR Code to add product': 'Scanner Code QR pour ajouter produit',
    'Adding product...': 'Ajout produit...',
    
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
    'French': 'Français',
    'Save All Settings': 'Sauvegarder tous les paramètres',
    
    // Dashboard
    'Today\'s Sales': 'Ventes d\'Aujourd\'hui',
    'Revenue': 'Revenus',
    'Orders': 'Commandes',
    'Products Sold': 'Produits Vendus',
    'Low Stock Items': 'Articles Stock Bas',
    'Recent Sales': 'Ventes Récentes',
    'Total Revenue': 'Revenus Totaux',
    'Total Orders': 'Commandes Totales',
    'Total Products': 'Produits Totaux',
    'Items': 'Articles',
    
    // Sales
    'Point of Sale': 'Point de Vente',
    'Search products...': 'Rechercher produits...',
    'Cart': 'Panier',
    'Your cart is empty': 'Votre panier est vide',
    'Add products to start a sale': 'Ajoutez des produits pour commencer une vente',
    'Total': 'Total',
    'Process Sale': 'Traiter Vente',
    'Clear Cart': 'Vider Panier',
    'In Stock': 'En Stock',
    'Out of Stock': 'Rupture Stock',
    'Remove': 'Supprimer',
    
    // Products
    'Product Management': 'Gestion des Produits',
    'Manage your product inventory': 'Gérez votre inventaire de produits',
    'Name': 'Nom',
    'Price': 'Prix',
    'Stock': 'Stock',
    'Status': 'Statut',
    
    // Common
    'Cancel': 'Annuler',
    'Save': 'Sauvegarder',
    'Add': 'Ajouter',
    'Edit': 'Modifier',
    'Delete': 'Supprimer',
    'Search': 'Rechercher',
    'Filter': 'Filtrer',
    'Actions': 'Actions',
    'Loading...': 'Chargement...',
    'No data available': 'Aucune donnée disponible',
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
