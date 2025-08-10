

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Theme, Business, Book, Transaction, EnrichedTransaction, User, TeamMember, AppView } from './types';
import { INITIAL_BUSINESS_DATA } from './constants';
import { SunIcon, MoonIcon, DocumentChartBarIcon, BuildingOfficeIcon, PlusIcon, ChartPieIcon, Cog6ToothIcon, ChevronDownIcon, PencilIcon, TrashIcon, UserGroupIcon, ArrowLeftOnRectangleIcon, Bars3Icon, ArrowLeftIcon, ClipboardIcon, BookOpenIcon, ClockIcon, DocumentTextIcon, EllipsisVerticalIcon, UserIcon, ArrowUpTrayIcon } from './components/icons/Icon';
import CreateBusinessModal from './components/CreateBusinessModal';
import EditBusinessModal from './components/EditBusinessModal';
import CreateBookModal from './components/CreateBookModal';
import EditBookModal from './components/EditBookModal';
import CreateTransactionModal from './components/CreateTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import ConfirmTransferOwnershipModal from './components/ConfirmTransferOwnershipModal';
import Dashboard from './components/Dashboard';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import TransactionsPage from './components/TransactionsPage';
import UsersPage from './components/UsersPage';
import InviteUserModal from './components/InviteUserModal';
import { useTranslations } from './hooks/useTranslations';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import BottomNavBar from './components/BottomNavBar';
import UploadTransactionsModal from './components/UploadTransactionsModal';
import BusinessSwitcher from './components/BusinessSwitcher';
import BookSettingsPage from './components/BookSettingsPage';
import HeaderMenu from './components/HeaderMenu';
import { useLocale } from './hooks/useLocale';
import { useLanguage, useCurrency } from './contexts';

// Base64 encoded Amiri font for Arabic support in PDFs
const AMIRI_FONT_BASE64 = 'AAEAAAARAQAABAAQR0RFRgBsAigAABHMAAAALE9TLzK/NV+AAABgAAAAVmNtYXAAA2QAAAKEAAABpGN2dCAASAAAAB+gAAAAAmZwZ20GrkCQAAGPQAAABJ5nbHlmCAxGvgAAGfQAAHVoZWFk/fEEVgAAADQAAAA2aGhlYQy8BDwAAAEkAAAAJGhtdHgGdQDDAAAAbAAAA9hsb2NhAbQC/QAAHwAAAAwobWF4cAIZAYwAAAFYAAAAIG5hbWUu/wFDAAA48AAAAxxwb3N0/7YADwAADgwAAAK5cHJlcBoAAAAABdQAAAAaAAMAAQAAAAD//wACAAEAAAAAAAD/TQABAAAACgABAAgAAQAAAAAAAQAAAAEAAQAAAEAAAAAAAAAAAQAAAAEAAAAGAEECBAUAAP8AAgAEAAgAAQABAAAAAwADAAEECQAAAAIAAQAACAAFAAQAAAAAAAAAAQACAAEACAAQAAkAAAAoAAAAAQAIAAYACgAjACgALQAyADcAQABFAEoATwBUAFkAXwBkAHEAdgB+AIAAhgCYAKoAswDAANcA4QDxAPsBAwEGAQwBGgEcASMBKwE2ATsBPwFIAVIBXQFgAW0BjAGsAa8BtAG9AcABwwHQAd8B6AHtAfgCAQIOAhkCHQIwAjgCQgJIAloCbAJ2AnwCfAKAAqcCrALBAssCzwLUAtwC5ALsAvADFgMwA0kDVQNsA34DlQOqA68DtAOnA8MDywPQA9kD4APpA+0D+gQABAsEEAQfBDEERwRMBFMEXgRiBGYEbgRwBHwEfgSMBJgEnASoBK8EvATABM8E1ATkBPkFGgUuBTQFPgVEBV8FaAVyBX4FiAWkBa4FtAXBBdAF4QXxBfoGAQYNBh8GIQYrBi8GNgY4BjsGQAZHBk0GUQZVBmEGbgZ7BoMGjQaXBqMGqwatBq8GswbDBs0G2wbdBvIG9gb5BwQHDAcUByQHMAdAB04HWQdoB24Hggd+B4sHmgeiB6sHrwe3B8MHxQfIB8wHzwfoB/QIBQgaCCIIRghcCGEIhwiRCLgIvAjCCM4I4QjoCPgJBAkWCT4JRQlSCWEJdgmICZgJpAmqCbAJuAnICeQJ6gnsChgKPApICloKnAqgCqoKsgq6CsYKzgrgCvsLBAscCzwLTAtoC3ILiguqC8oL0gvYC+kL+gwEDAQMCgwODBA MEETwRYBGMEdgR5BH4EgwSThKcEqgSyhLgEwwTTBPCE94UChQ+FEwUXBR8FJwUyBTsFRgVOBVkFYgVsBXAFcgV/BYgFnAWeBaAFogWoBbEFuAXBBcUF2AXcBeIF7AX1Bf8GAgYLBhAGFQYfBiEGKAYuBjEGNgY4BjsGPAZCBiAGJgYmBicGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYpBikGKQYwAAAAABAAH//gAPAAIAAAAAADQAgAAAAAEAAAAABAAAAAgAAAAAAMwADAAEAAAAAAAQAPAAAAgAAAAIAAgAAAAAABAAwABQAEgAAAAAAAAAAAwAAAAQAAAAUAAEAAAAAAAQAJAA4AAEAAAAAAAYADQBQAAEAAAAAAAoAMABgAAEAAAAAAAwAPwBwAAEAAAAAABAAZgCIAAEAAAAAABgAHgEAAAEAAAAAABwAKgFAAAEAAAAAAB4AQgFSAAEAAAAAACgATwFyAAEAAAAAACQAZQGMAAEAAAAAACgAuAHQAAMAAQQJAAAAEACIAAMAAQQJAAEAGADCAAMAAQQJAAIADgDqAAMAAQQJAAUAIgEYAAMAAQQJAAoAWAGgAAMAAQQJAAsAJgHWAAMAAQQJAAwAEgIQAAMAAQQJABAAZgIYAAMAAQQJABgAKAJAAAMAAQQJABwAcAKQAAMAAQQJAB4AyALIAAMAAQQJACgA5AMQAAMAAQQJACQBFANwAAEAAAAEAAL/igB0ZXh0Q29weXJpZ2h0IChDKSAyMDAzLCAyMDA0LCBKb25hdGhhbiBLZXcgKEprZXcuY28udWsD)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+v77/gMEBQH/AAAAAAAF////9gID//YFBv/2BQb/9gUD/v8HAgIDAQcCAgP+BgT9//v+/wEBAgIGAQH9Av7//v79AQICAf/+/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+-';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};

const ThemeToggle: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button onClick={toggleTheme} className="p-2 rounded-full text-primary-200 hover:bg-primary-700 transition-colors" aria-label="Toggle theme">
        {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
    </button>
);

type AuthView = 'login' | 'signup' | 'app';
type SettingsTab = 'general' | 'profile' | 'business';


const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; headerContent?: React.ReactNode }> = ({ title, children, defaultOpen = true, headerContent }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="px-2">
            <div onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center mb-2 cursor-pointer hover:bg-primary-700/60 rounded-md p-2 -m-2">
                 <h3 className="text-xs font-semibold uppercase text-primary-300 select-none">{title}</h3>
                 <div className="flex items-center gap-2">
                    {headerContent}
                    <ChevronDownIcon className={`w-4 h-4 text-primary-300 transition-transform duration-200 ${isOpen ? '' : '-rotate-90'}`} />
                 </div>
            </div>
            {isOpen && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
};

const Sidebar: React.FC<{
    theme: Theme;
    toggleTheme: () => void;
    activeView: AppView;
    onSelectView: (view: AppView) => void;
    currentUser: User;
    onLogout: () => void;
    isMobile: boolean;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}> = ({ theme, toggleTheme, activeView, onSelectView, currentUser, onLogout, isMobile, isOpen, setIsOpen }) => {
    const t = useTranslations();
    
    const generalMenuItems = [
        { id: 'reports' as const, href: '#', label: t.sidebar.reports, icon: ChartPieIcon },
        { id: 'users' as const, href: '#', label: t.sidebar.users, icon: UserGroupIcon },
        { id: 'settings' as const, href: '#', label: t.sidebar.settings, icon: Cog6ToothIcon },
    ];

    return (
        <>
        {isMobile && isOpen && (
            <div 
                className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            ></div>
        )}
        <aside className={`w-72 flex-shrink-0 bg-primary-800 p-4 border-e border-primary-700 flex flex-col transition-transform duration-300 ease-in-out ${isMobile ? `fixed inset-y-0 start-0 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'}` : ''}`}>
            <div className="flex items-center gap-3 mb-6 px-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-xl font-bold text-white">C</span>
                </div>
                <span className="text-2xl font-bold text-white">{t.sidebar.title}</span>
            </div>

            <div className="flex-grow flex flex-col overflow-y-auto -me-4 pe-4 space-y-6">
                <CollapsibleSection title={t.sidebar.general}>
                    <nav className="space-y-1">
                         <a href="#" onClick={(e) => { e.preventDefault(); onSelectView('dashboard'); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${(activeView === 'dashboard' || activeView === 'transactions' || activeView === 'book-settings') ? 'bg-black/20 text-white' : 'text-primary-200 hover:bg-black/10 hover:text-white'}`}>
                            <DocumentChartBarIcon className="w-5 h-5" />
                            <span>{t.sidebar.dashboard}</span>
                        </a>
                        {generalMenuItems.map(item => (
                            <a key={item.id} href={item.href} onClick={(e) => { e.preventDefault(); onSelectView(item.id); }} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeView === item.id ? 'bg-black/20 text-white' : 'text-primary-200 hover:bg-black/10 hover:text-white'}`}>
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </CollapsibleSection>
            </div>
            <div className="mt-auto p-2">
                <div className="p-3 bg-black/20 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-500/20 text-primary-600 dark:text-primary-300 flex items-center justify-center font-bold">
                            {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow truncate">
                            <p className="font-semibold text-sm text-white truncate">{currentUser.name}</p>
                            <p className="text-xs text-primary-300 truncate">{currentUser.email}</p>
                        </div>
                        <button onClick={onLogout} className="flex-shrink-0 p-2 text-primary-200 hover:text-red-400 hover:bg-black/20 rounded-full" aria-label="Logout">
                            <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-primary-300">Theme</span>
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme}/>
                    </div>
                </div>
            </div>
        </aside>
        </>
    );
};

const WelcomePage = () => {
    const t = useTranslations();
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 dark:bg-slate-900">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <BuildingOfficeIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t.welcome.title}</h2>
            <p className="mt-2 max-w-md text-gray-500 dark:text-gray-400">{t.welcome.message}</p>
        </div>
    );
}

const App: React.FC = () => {
    const t = useTranslations();
    const isMobile = useIsMobile();
    const locale = useLocale();
    const { language } = useLanguage();
    const { currency } = useCurrency();
    
    // === STATE MANAGEMENT ===
    
    const [theme, setTheme] = useState<Theme>(() => {
        try {
            const savedTheme = localStorage.getItem('app-theme') as Theme;
            if (savedTheme && Object.values(Theme).includes(savedTheme)) {
                return savedTheme;
            }
        } catch (error) {
            console.error('Failed to read theme from localStorage', error);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
    });

    const [businesses, setBusinesses] = useState<Business[]>(() => {
        try {
            const savedBusinesses = localStorage.getItem('app-businesses');
            return savedBusinesses ? JSON.parse(savedBusinesses) : INITIAL_BUSINESS_DATA;
        } catch (error) {
            console.error('Failed to parse businesses from localStorage', error);
            return INITIAL_BUSINESS_DATA;
        }
    });

    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('app-user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error('Failed to parse user from localStorage', error);
            return null;
        }
    });

    const [authView, setAuthView] = useState<AuthView>(currentUser ? 'app' : 'login');
    const [appView, setAppView] = useState<AppView>('dashboard');
    const [activeBusinessId, setActiveBusinessId] = useState<string | null>(() => {
        try {
            return localStorage.getItem('app-active-business-id');
        } catch {
            return null;
        }
    });
    const [activeBookId, setActiveBookId] = useState<string | null>(null);
    const [initialSettingsTab, setInitialSettingsTab] = useState<SettingsTab>('general');

    // Modal states
    const [isCreateBusinessModalOpen, setCreateBusinessModalOpen] = useState(false);
    const [businessToEdit, setBusinessToEdit] = useState<Business | null>(null);
    const [isCreateBookModalOpen, setCreateBookModalOpen] = useState(false);
    const [bookToEdit, setBookToEdit] = useState<Book | null>(null);
    const [isCreateTransactionModalOpen, setCreateTransactionModalOpen] = useState(false);
    const [newTransactionDetails, setNewTransactionDetails] = useState<{ book: Book, type: 'income' | 'expense' } | null>(null);
    const [transactionToEdit, setTransactionToEdit] = useState<EnrichedTransaction | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ type: string, data: any } | null>(null);
    const [isInviteModalOpen, setInviteModalOpen] = useState(false);
    const [isTransferOwnershipModalOpen, setTransferOwnershipModalOpen] = useState(false);
    const [transferOwnershipPayload, setTransferOwnershipPayload] = useState<{ business: Business, email: string } | null>(null);
    const [bulkDeletePayload, setBulkDeletePayload] = useState<{ bookId: string; transactionIds?: string[] } | null>(null);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isCreateMenuOpen, setCreateMenuOpen] = useState(false);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

    // === DATA DERIVATION ===
    const activeBusiness = useMemo(() => businesses.find(b => b.id === activeBusinessId), [businesses, activeBusinessId]);
    const activeBook = useMemo(() => activeBusiness?.books.find(b => b.id === activeBookId), [activeBusiness, activeBookId]);

    // === EFFECTS ===
    useEffect(() => {
        if (theme === Theme.DARK) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('app-theme', theme);
        } catch (error) {
            console.error('Failed to save theme to localStorage', error);
        }
    }, [theme]);
    
    useEffect(() => {
        try {
            localStorage.setItem('app-businesses', JSON.stringify(businesses));
        } catch (error) {
            console.error('Failed to save businesses to localStorage', error);
        }
    }, [businesses]);
    
    useEffect(() => {
        try {
            if (currentUser) {
                localStorage.setItem('app-user', JSON.stringify(currentUser));
            } else {
                localStorage.removeItem('app-user');
            }
        } catch (error) {
            console.error('Failed to save user to localStorage', error);
        }
    }, [currentUser]);

    useEffect(() => {
        try {
            if (activeBusinessId) {
                localStorage.setItem('app-active-business-id', activeBusinessId);
            } else {
                localStorage.removeItem('app-active-business-id');
            }
        } catch (error) {
            console.error('Failed to save active business ID to localStorage', error);
        }
    }, [activeBusinessId]);
    
    useEffect(() => {
        if (businesses.length > 0 && !activeBusiness) {
            setActiveBusinessId(businesses[0].id);
        }
        if (businesses.length === 0) {
            setActiveBusinessId(null);
        }
    }, [businesses, activeBusiness]);

    // === HANDLERS ===
    const toggleTheme = () => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);

    const handleSelectBusiness = useCallback((business: Business) => {
        setActiveBusinessId(business.id);
        setAppView('dashboard');
        setActiveBookId(null);
        if (isMobile) setIsSidebarOpen(false);
    }, [isMobile]);

    const handleSelectView = (view: AppView, initialTab: SettingsTab = 'general') => {
        if (view !== 'transactions' && view !== 'book-settings') {
             setActiveBookId(null);
        }
        if (view === 'settings') {
            setInitialSettingsTab(initialTab);
        }
        setAppView(view);
        if(isMobile) setIsSidebarOpen(false);
    };

    const handleLogin = (username: string) => {
        const newUser: User = { id: `user_${Date.now()}`, name: username, email: `${username.toLowerCase()}@cashflow.app` };
        setCurrentUser(newUser);
        setAuthView('app');
        if (businesses.length === 0) {
            const firstBusiness: Business = {
                id: `biz_${Date.now()}`,
                name: `${username}'s Business`,
                books: [],
                team: [{ ...newUser, role: 'Owner' }]
            };
            setBusinesses([firstBusiness]);
            setActiveBusinessId(firstBusiness.id);
        }
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        setAuthView('login');
        setActiveBusinessId(null);
    };

    const handleSignUp = (fullName: string, email: string) => {
        const newUser: User = { id: `user_${Date.now()}`, name: fullName, email: email };
        setCurrentUser(newUser);
        setAuthView('app');
        const firstBusiness: Business = {
            id: `biz_${Date.now()}`,
            name: `${fullName}'s Business`,
            books: [],
            team: [{ ...newUser, role: 'Owner' }]
        };
        setBusinesses([firstBusiness]);
        setActiveBusinessId(firstBusiness.id);
    };

    const handleSaveBusiness = (name: string) => {
        if (!currentUser) return;
        const newBusiness: Business = {
            id: `biz_${Date.now()}`,
            name,
            books: [],
            team: [{ ...currentUser, role: 'Owner' }],
        };
        setBusinesses(prev => [...prev, newBusiness]);
        setCreateBusinessModalOpen(false);
        setActiveBusinessId(newBusiness.id);
        setAppView('dashboard');
    };
    
    const handleUpdateBusiness = (id: string, name: string) => {
        setBusinesses(prev => prev.map(b => b.id === id ? { ...b, name } : b));
        setBusinessToEdit(null);
    };

    const handleDuplicateBusiness = (businessToDuplicate: Business) => {
        if (!currentUser) return;
        const newBusiness: Business = JSON.parse(JSON.stringify(businessToDuplicate));
        newBusiness.id = `biz_${Date.now()}`;
        newBusiness.name = t.modals.duplicateBusinessName.replace('{name}', businessToDuplicate.name);
        newBusiness.books = newBusiness.books.map(book => ({
            ...book,
            id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            transactions: book.transactions.map(tx => ({
                ...tx,
                id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                creatorId: currentUser.id,
                creatorName: currentUser.name,
                entryTimestamp: new Date().toISOString()
            }))
        }));
        newBusiness.team = newBusiness.team.map(member => ({
            ...member,
            id: `member_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        }));
        setBusinesses(prev => [...prev, newBusiness]);
    };
    
    const handleDeleteRequest = (type: string, data: any) => setItemToDelete({ type, data });
    
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        const { type, data } = itemToDelete;
        switch (type) {
            case 'business':
                setBusinesses(prev => prev.filter(b => b.id !== data.id));
                if (activeBusinessId === data.id) {
                    setActiveBusinessId(businesses.length > 1 ? businesses.filter(b => b.id !== data.id)[0].id : null);
                }
                break;
            case 'book':
                if (activeBusiness) {
                    const updatedBooks = activeBusiness.books.filter(b => b.id !== data.id);
                    setBusinesses(prev => prev.map(biz => biz.id === activeBusiness.id ? { ...biz, books: updatedBooks } : biz));
                }
                // If we deleted the active book, navigate back to dashboard
                if (activeBookId === data.id) {
                    setActiveBookId(null);
                    setAppView('dashboard');
                }
                break;
            case 'transaction':
                if (activeBusiness) {
                    const updatedBooks = activeBusiness.books.map(book => {
                        if (book.id === data.bookId) {
                            return { ...book, transactions: book.transactions.filter(t => t.id !== data.id) };
                        }
                        return book;
                    });
                    setBusinesses(prev => prev.map(biz => biz.id === activeBusiness.id ? { ...biz, books: updatedBooks } : biz));
                }
                break;
            case 'member':
                 setBusinesses(prev => prev.map(business => {
                    if (business.id === data.businessId) {
                        return { ...business, team: business.team.filter(m => m.id !== data.member.id) };
                    }
                    return business;
                }));
                break;
            case 'all-transactions':
                 if (activeBusiness) {
                    const updatedBooks = activeBusiness.books.map(book => {
                        if (book.id === data.bookId) {
                            return { ...book, transactions: [] };
                        }
                        return book;
                    });
                    setBusinesses(prev => prev.map(biz => biz.id === activeBusiness.id ? { ...biz, books: updatedBooks } : biz));
                }
                break;
        }
        setItemToDelete(null);
    };
    
    const handleSaveBook = (name: string) => {
        if (activeBusiness) {
            const newBook: Book = { id: `book_${Date.now()}`, name, transactions: [] };
            const updatedBooks = [...activeBusiness.books, newBook];
            setBusinesses(prev => prev.map(b => b.id === activeBusiness.id ? { ...b, books: updatedBooks } : b));
            setCreateBookModalOpen(false);
        }
    };
    
    const handleUpdateBook = (id: string, name: string) => {
        if (activeBusiness) {
            const updatedBooks = activeBusiness.books.map(b => b.id === id ? { ...b, name } : b);
            setBusinesses(prev => prev.map(biz => biz.id === activeBusiness.id ? { ...biz, books: updatedBooks } : biz));
            setBookToEdit(null);
            if (appView === 'book-settings') {
                setAppView('transactions');
                setTimeout(() => setAppView('book-settings'), 0);
            }
        }
    };

    const handleSaveTransaction = (data: Omit<Transaction, 'id' | 'creatorId' | 'creatorName' | 'entryTimestamp'>) => {
        if (activeBusiness && newTransactionDetails && currentUser) {
            const newTransaction: Transaction = {
                 ...data,
                 id: `tx_${Date.now()}`,
                 creatorId: currentUser.id,
                 creatorName: currentUser.name,
                 entryTimestamp: new Date().toISOString()
            };
            const updatedBooks = activeBusiness.books.map(book => {
                if (book.id === newTransactionDetails.book.id) {
                    return { ...book, transactions: [...book.transactions, newTransaction] };
                }
                return book;
            });
            setBusinesses(prev => prev.map(b => b.id === activeBusiness.id ? { ...b, books: updatedBooks } : b));
            setCreateTransactionModalOpen(false);
            setNewTransactionDetails(null);
        }
    };

    const handleUpdateTransaction = (data: Transaction) => {
        if (activeBusiness) {
            const updatedBooks = activeBusiness.books.map(book => ({
                ...book,
                transactions: book.transactions.map(t => t.id === data.id ? data : t),
            }));
            setBusinesses(prev => prev.map(b => b.id === activeBusiness.id ? { ...b, books: updatedBooks } : b));
            setTransactionToEdit(null);
        }
    };

    const handleNewTransactionClick = useCallback((book: Book, type: 'income' | 'expense') => {
        setNewTransactionDetails({ book, type });
        setCreateTransactionModalOpen(true);
    }, []);

    const handleInviteMember = (businessId: string, email: string, role: 'Manager' | 'Member') => {
        const ALL_BUSINESSES_ID = '__ALL_BUSINESSES__';
        const newMember: Omit<TeamMember, 'id' | 'role'> = { email, name: email.split('@')[0] };
        
        const inviteToBusiness = (biz: Business) => {
            const isAlreadyMember = biz.team.some(m => m.email.toLowerCase() === email.toLowerCase());
            if (isAlreadyMember) {
                 return { business: biz, invited: false };
            }
            const memberWithId: TeamMember = { ...newMember, id: `user_${Date.now()}_${biz.id}`, role };
            const updatedTeam = [...biz.team, memberWithId];
            return { business: { ...biz, team: updatedTeam }, invited: true };
        }
        
        if (businessId === ALL_BUSINESSES_ID) {
            let invitedCount = 0;
            let alreadyMemberCount = 0;
            const updatedBusinesses = businesses.map(biz => {
                const result = inviteToBusiness(biz);
                if (result.invited) invitedCount++;
                else alreadyMemberCount++;
                return result.business;
            });
            setBusinesses(updatedBusinesses);
            alert(`Invited user to ${invitedCount} new business(es). User was already a member of ${alreadyMemberCount} business(es).`);
        } else {
            const businessToUpdate = businesses.find(b => b.id === businessId);
            if(businessToUpdate) {
                const result = inviteToBusiness(businessToUpdate);
                if (result.invited) {
                    setBusinesses(businesses.map(b => b.id === businessId ? result.business : b));
                    alert(`User ${email} has been invited to ${businessToUpdate.name}.`);
                } else {
                    alert(`User ${email} is already a member of ${businessToUpdate.name}.`);
                }
            }
        }
        
        setInviteModalOpen(false);
    };

    const handleUpdateMemberRole = (businessId: string, memberId: string, role: 'Manager' | 'Member') => {
        setBusinesses(prev => prev.map(business => {
            if (business.id === businessId) {
                return {
                    ...business,
                    team: business.team.map(member => member.id === memberId ? { ...member, role } : member)
                };
            }
            return business;
        }));
    };

    const handleRemoveMemberRequest = (businessId: string, member: TeamMember) => {
        const businessName = businesses.find(b => b.id === businessId)?.name ?? '';
        setItemToDelete({ type: 'member', data: { businessId, member, businessName } });
    };

    const handleTransferOwnershipRequest = (business: Business, email: string) => {
        setTransferOwnershipPayload({ business, email });
        setTransferOwnershipModalOpen(true);
    };

    const handleConfirmTransferOwnership = () => {
        if (!transferOwnershipPayload || !currentUser) return;
        const { business, email } = transferOwnershipPayload;
        const newOwner = business.team.find(m => m.email.toLowerCase() === email.toLowerCase());
        if (!newOwner) {
            alert(`User with email ${email} not found in this business.`);
            setTransferOwnershipModalOpen(false);
            setTransferOwnershipPayload(null);
            return;
        }
        const updatedTeam = business.team.map(member => {
            if (member.id === newOwner.id) return { ...member, role: 'Owner' as const };
            if (member.id === currentUser.id) return { ...member, role: 'Manager' as const };
            return member;
        });
        setBusinesses(prev => prev.map(b => b.id === business.id ? { ...b, team: updatedTeam } : b));
        setTransferOwnershipModalOpen(false);
        setTransferOwnershipPayload(null);
    };
    
    const handleBulkDeleteRequest = (bookId: string, transactionIds: string[]) => {
        setBulkDeletePayload({ bookId, transactionIds });
        setIsBulkDeleteModalOpen(true);
    };
    
    const handleDeleteAllTransactionsInBook = (bookId: string) => {
        setItemToDelete({
            type: 'all-transactions',
            data: { bookId, bookName: activeBook?.name || '' }
        });
    }

    const handleExportBookPDF = async (bookId: string) => {
        const book = activeBusiness?.books.find(b => b.id === bookId);
        if (!book || !activeBusiness) return;
    
        if (book.transactions.length === 0) {
            alert(t.reports.noDataToAnalyze);
            return;
        }
    
        const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 30;
    
        if (language === 'ar') {
            try {
                doc.addFileToVFS("Amiri-Regular.ttf", AMIRI_FONT_BASE64);
                doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
                doc.setFont("Amiri");
            } catch (e) {
                console.error("Failed to load Arabic font for PDF", e);
            }
        }
        
        const currencyFormatter = (amount: number) => {
            if (currency === 'SOS') {
                return `Ssh ${amount.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
            }
            return amount.toLocaleString(locale, { style: 'currency', currency: currency, minimumFractionDigits: 2 });
        };
    
        // Header
        doc.setFillColor(4, 28, 55); // dark blue
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setFillColor(255, 255, 255); // White color for logo bg
        doc.circle(margin, 17.5, 10, 'F'); // Draw a white circle
        doc.setTextColor(4, 28, 55); // Dark blue for text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('C', margin, 21, { align: 'center' }); // Letter 'C'
    
        let yPos = 60;
        // Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text(book.name, pageWidth / 2, yPos, { align: 'center' });
        yPos += 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(activeBusiness.name, pageWidth / 2, yPos, { align: 'center' });
        yPos += 30;
    
        // Summary
        const summary = book.transactions.reduce((acc, tx) => {
            if (tx.type === 'income') acc.income += tx.amount;
            else acc.expense += tx.amount;
            return acc;
        }, { income: 0, expense: 0 });
        const balance = summary.income - summary.expense;

        // Summary Cards
        const cardWidth = (pageWidth - margin * 2 - 20) / 3;
        const cardHeight = 70;
        const cardRadius = 10;
        const balancePdfColor = balance > 0 ? [82, 142, 82] : balance < 0 ? [209, 69, 59] : [29, 78, 216]; // Green, Red, Blue for neutral
        const cards = [
            { title: t.reports.totalCashIn, value: summary.income, color: [82, 142, 82], subtext: t.reports.youllGive },
            { title: t.reports.totalCashOut, value: summary.expense, color: [209, 69, 59], subtext: t.reports.youllGet },
            { title: t.reports.netBalance, value: balance, color: balancePdfColor, subtext: t.reports.youllGet }
        ];

        cards.forEach((card, index) => {
            const xPos = margin + index * (cardWidth + 10);
            doc.setFillColor(card.color[0], card.color[1], card.color[2]);
            doc.roundedRect(xPos, yPos, cardWidth, cardHeight, cardRadius, cardRadius, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(card.title, xPos + cardWidth / 2, yPos + 20, { align: 'center' });
            doc.setFontSize(16);
            doc.text(currencyFormatter(card.value), xPos + cardWidth / 2, yPos + 42, { align: 'center' });
            doc.setFontSize(9);
            doc.text(card.subtext, xPos + cardWidth / 2, yPos + 58, { align: 'center' });
        });
        yPos += cardHeight + 30;
    
        // Table
        const tableHeaders = [t.reports.date, t.reports.details, t.reports.cashIn, t.reports.cashOut, t.reports.balance];
        const colWidths = [80, 165, 90, 90, 110];
        const tableStartX = (pageWidth - colWidths.reduce((a, b) => a + b, 0)) / 2;
        const rowHeight = 25;
        const cellRadius = 8;
        const cellPadding = { top: 15, x: 5 };
    
        const drawTableRow = (rowData: string[], isHeader: boolean, currentY: number, balanceValue?: number) => {
            let currentX = tableStartX;
            rowData.forEach((cell, i) => {
                const cellText = String(cell);
                doc.setDrawColor(180, 180, 180);
        
                if (isHeader) {
                    doc.setFillColor(230, 230, 230);
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'bold');
                } else {
                    doc.setFillColor(255, 255, 255);
                    if (i === 2) doc.setFillColor(220, 240, 220); // Cash In light green
                    
                    doc.setTextColor(0, 0, 0);
                    doc.setFont('helvetica', 'normal');
        
                    if (i === 4 && balanceValue !== undefined) {
                        if (balanceValue > 0) doc.setTextColor(34, 197, 94); // green-500
                        else if (balanceValue < 0) doc.setTextColor(239, 68, 68); // red-500
                        doc.setFont('helvetica', 'bold');
                    }
                }
                doc.roundedRect(currentX, currentY, colWidths[i], rowHeight, cellRadius, cellRadius, 'FD');
                doc.text(cellText, currentX + colWidths[i] / 2, currentY + cellPadding.top, { align: 'center' });
                // Reset color and font after drawing text
                doc.setTextColor(0, 0, 0);
                doc.setFont('helvetica', 'normal');
        
                currentX += colWidths[i];
            });
        };
        
        drawTableRow(tableHeaders, true, yPos);
        yPos += rowHeight;

        const txsForPdf = [...book.transactions].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let runningBalance = 0;

        txsForPdf.forEach(tx => {
            if (tx.type === 'income') runningBalance += tx.amount;
            else runningBalance -= tx.amount;

            if (yPos > pageHeight - 80) {
                doc.addPage();
                yPos = margin;
                drawTableRow(tableHeaders, true, yPos);
                yPos += rowHeight;
            }
          
            const rowData = [
                new Date(tx.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB').replace(/\//g, '-'),
                tx.description,
                tx.type === 'income' ? currencyFormatter(tx.amount) : currencyFormatter(0),
                tx.type === 'expense' ? currencyFormatter(tx.amount) : currencyFormatter(0),
                currencyFormatter(runningBalance)
            ];
            drawTableRow(rowData, false, yPos, runningBalance);
            yPos += rowHeight;
        });
        yPos += 10;
        
        // Grand Total Section
        const grandTotalLabel = t.reports.grandTotal;
        const grandTotals = [summary.income, summary.expense, balance];
        const grandTotalBalanceColor = balance > 0 ? [82, 142, 82] : balance < 0 ? [209, 69, 59] : [109, 75, 65]; // green, red, brown
        const grandTotalColors = [[82, 142, 82], [209, 69, 59], grandTotalBalanceColor];
        const grandTotalCellWidths = [90, 90, 110];
        const grandTotalLabelWidth = 80 + 165;
        let grandTotalX = tableStartX;

        doc.setDrawColor(180, 180, 180);
        doc.setFillColor(230, 230, 230);
        doc.roundedRect(grandTotalX, yPos, grandTotalLabelWidth, rowHeight, cellRadius, cellRadius, 'FD');
        doc.setTextColor(0,0,0);
        doc.setFont('helvetica', 'bold');
        doc.text(grandTotalLabel, grandTotalX + grandTotalLabelWidth / 2, yPos + cellPadding.top, { align: 'center' });
        grandTotalX += grandTotalLabelWidth;

        grandTotals.forEach((total, i) => {
          doc.setFillColor(grandTotalColors[i][0], grandTotalColors[i][1], grandTotalColors[i][2]);
          doc.roundedRect(grandTotalX, yPos, grandTotalCellWidths[i], rowHeight, cellRadius, cellRadius, 'F');
          doc.setTextColor(255, 255, 255);
          doc.text(currencyFormatter(total), grandTotalX + grandTotalCellWidths[i] / 2, yPos + cellPadding.top, { align: 'center' });
          grandTotalX += grandTotalCellWidths[i];
        });
    
        // Footer
        const finalPageHeight = doc.internal.pageSize.getHeight();
        const footerY = finalPageHeight - 25;
        doc.setFillColor(4, 28, 55); // dark blue
        doc.rect(0, footerY - 10, pageWidth, 35, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        const timestamp = new Date().toLocaleString(language === 'ar' ? 'ar-EG' : 'en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).replace(/,/g, '-').replace(/\s/g, '');
        doc.text(timestamp.toUpperCase(), pageWidth / 2, footerY, { align: 'center' });

        const dateStr = new Date().toISOString().slice(0, 10);
        doc.save(`Cashflow-Report-${book.name}-${dateStr}.pdf`);
    };

    const handleImportTransactions = (bookId: string, transactions: Omit<Transaction, 'id'>[]) => {
        if (!currentUser) return;
        setBusinesses(prev => prev.map(business => {
            const bookIndex = business.books.findIndex(b => b.id === bookId);
            if (bookIndex === -1) {
                return business;
            }
    
            const newTransactions: Transaction[] = transactions.map(tx => ({
                ...tx,
                id: `tx_${Date.now()}_${Math.random()}`,
                creatorId: currentUser.id,
                creatorName: currentUser.name,
                entryTimestamp: new Date().toISOString()
            }));
    
            const updatedBooks = business.books.map(book => {
                if (book.id === bookId) {
                    return {
                        ...book,
                        transactions: [...book.transactions, ...newTransactions]
                    }
                }
                return book;
            });
    
            return { ...business, books: updatedBooks };
        }));
        setUploadModalOpen(false);
    };
    
    const handleOpenCreateMenu = () => setCreateMenuOpen(true);
    const handleCloseCreateMenu = () => setCreateMenuOpen(false);

    const handleCreateMenuSelect = (type: 'book' | 'business') => {
        handleCloseCreateMenu();
        if (type === 'book') {
            setCreateBookModalOpen(true);
        } else {
            setCreateBusinessModalOpen(true);
        }
    };

    // === RENDER LOGIC ===
    if (authView !== 'app' || !currentUser) {
        return authView === 'signup' ? 
            <SignUpPage onSignUp={handleSignUp} onNavigateToLogin={() => setAuthView('login')} /> :
            <LoginPage onLogin={handleLogin} onNavigateToSignUp={() => setAuthView('signup')} />;
    }
    
    const businessMenuItems = [
        { label: t.header.addBusiness, icon: BuildingOfficeIcon, onClick: () => setCreateBusinessModalOpen(true) },
        { label: t.header.businessSettings, icon: Cog6ToothIcon, onClick: () => handleSelectView('settings', 'business') },
        { label: t.header.businessProfile, icon: UserIcon, onClick: () => handleSelectView('settings', 'profile') },
        { label: t.header.businessTeam, icon: UserGroupIcon, onClick: () => handleSelectView('settings', 'business') },
    ];

    const Header: React.FC = () => {
        let title: React.ReactNode = t.sidebar.dashboard;
        let menuItems: any[] = [];
        let headerContent: React.ReactNode;
        const isBookView = activeBook || appView === 'book-settings';
        
        if (activeBook) {
            title = appView === 'book-settings' ? t.bookSettings.title : activeBook.name;
            menuItems = [
                { label: t.header.bookSettings, icon: Cog6ToothIcon, onClick: () => setAppView('book-settings') },
                { label: t.header.uploadTransactions, icon: ArrowUpTrayIcon, onClick: () => setUploadModalOpen(true) },
                { label: t.header.bookActivity, icon: ClockIcon, onClick: () => alert('Book Activity coming soon!') },
                { label: t.header.pdfReport, icon: DocumentTextIcon, onClick: () => handleExportBookPDF(activeBook.id) },
                { label: t.header.deleteAllEntries, icon: TrashIcon, isDestructive: true, onClick: () => handleDeleteAllTransactionsInBook(activeBook.id) },
            ];
        } else if (appView === 'book-settings' && activeBook) {
            title = t.bookSettings.title;
        } else {
            title = t.sidebar[appView as keyof typeof t.sidebar] || t.sidebar.dashboard;
        }

        const handleBack = () => {
            if (appView === 'book-settings') {
                setAppView('transactions');
            } else if (activeBook) {
                setActiveBookId(null);
                setAppView('dashboard');
            }
        };

        const showBusinessSwitcher = !isBookView && (appView === 'dashboard' || appView === 'reports') && activeBusiness;
        const showBusinessMenu = !isBookView && activeBusiness;

        if (showBusinessSwitcher) {
            headerContent = <BusinessSwitcher businesses={businesses} activeBusiness={activeBusiness} onSelectBusiness={handleSelectBusiness} isMobile />;
        } else {
            headerContent = <h1 className="text-xl font-bold truncate">{title}</h1>;
        }
        
        const headerClasses = 'bg-gradient-to-r from-emerald-600 via-lime-500 to-green-400 text-white';

        return (
             <header className={`sticky top-0 p-4 z-20 lg:hidden flex items-center justify-between ${headerClasses}`}>
                 <div className="flex items-center gap-3">
                    {isBookView ? (
                        <button onClick={handleBack} className="p-1 -m-1">
                            <ArrowLeftIcon className="w-6 h-6 rtl:rotate-180" />
                        </button>
                    ) : (
                        <button onClick={() => setIsSidebarOpen(true)} className="p-1 -m-1">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    )}
                    {headerContent}
                 </div>
                 <div className="flex items-center gap-2">
                    {activeBook && menuItems.length > 0 && <HeaderMenu items={menuItems} />}
                    {showBusinessMenu && <HeaderMenu items={businessMenuItems} />}
                 </div>
            </header>
        );
    };
    
    const DesktopHeader: React.FC = () => {
        let titleText: React.ReactNode = t.sidebar.dashboard;
        let rightContent: React.ReactNode = null;
        let leftContent: React.ReactNode = null;
        
        const isBookView = activeBook && (appView === 'transactions' || appView === 'book-settings');
        
        const bookMenuItems = activeBook ? [
            { label: t.header.bookSettings, icon: Cog6ToothIcon, onClick: () => setAppView('book-settings') },
            { label: t.header.uploadTransactions, icon: ArrowUpTrayIcon, onClick: () => setUploadModalOpen(true) },
            { label: t.header.bookActivity, icon: ClockIcon, onClick: () => alert('Book Activity coming soon!') },
            { label: t.header.pdfReport, icon: DocumentTextIcon, onClick: () => handleExportBookPDF(activeBook.id) },
            { label: t.header.deleteAllEntries, icon: TrashIcon, isDestructive: true, onClick: () => handleDeleteAllTransactionsInBook(activeBook.id) },
        ] : [];

        if (isBookView) {
            leftContent = (
                <button 
                    onClick={() => { appView === 'book-settings' ? setAppView('transactions') : setActiveBookId(null); setAppView('dashboard'); }} 
                    className="p-2 -m-2 rounded-full text-white hover:bg-black/20 transition-colors"
                >
                   <ArrowLeftIcon className="w-6 h-6 rtl:rotate-180"/>
                </button>
            );
            titleText = appView === 'book-settings' ? t.bookSettings.title : activeBook.name;
            rightContent = <HeaderMenu items={bookMenuItems} />;
        } else {
             switch (appView) {
                case 'dashboard':
                    titleText = t.sidebar.dashboard;
                    break;
                case 'reports':
                    titleText = t.reports.title;
                    break;
                case 'users':
                    titleText = t.users.title;
                    break;
                case 'settings':
                    titleText = t.settings.title;
                    break;
            }

            if (activeBusiness) {
                rightContent = (
                    <div className="flex items-center gap-2">
                      <BusinessSwitcher businesses={businesses} activeBusiness={activeBusiness} onSelectBusiness={handleSelectBusiness} />
                      <HeaderMenu items={businessMenuItems} />
                    </div>
                );
            } else if (appView === 'dashboard') {
                 titleText = t.welcome.title;
            }
        }
       
        if (appView === 'dashboard' && !activeBusiness) {
            return null;
        }

        const headerClasses = 'bg-gradient-to-r from-emerald-600 via-lime-500 to-green-400';
        const titleClasses = 'text-white';
            
        return (
            <header className={`flex-shrink-0 p-4 hidden lg:flex items-center justify-between ${headerClasses}`}>
                <div className="flex items-center gap-4">
                    {leftContent}
                    <h1 className={`text-2xl font-bold ${titleClasses}`}>{titleText}</h1>
                </div>
                <div>{rightContent}</div>
            </header>
        );
    };

    const MainContent: React.FC = () => {
        switch (appView) {
            case 'transactions':
                return activeBook ? <TransactionsPage book={activeBook} onNewTransactionClick={handleNewTransactionClick} onEditTransactionClick={(tx) => setTransactionToEdit({...tx, bookId: activeBook.id})} onDeleteTransactionClick={(tx) => handleDeleteRequest('transaction', {...tx, bookId: activeBook.id})} /> : <Dashboard business={activeBusiness!} onViewTransactions={(book) => { setActiveBookId(book.id); setAppView('transactions'); }} onNewBookClick={() => setCreateBookModalOpen(true)} />;
            case 'book-settings':
                return activeBook && activeBusiness ? <BookSettingsPage book={activeBook} business={activeBusiness} currentUser={currentUser} onEditBook={setBookToEdit} onInviteMember={() => setInviteModalOpen(true)} onDeleteBook={(book) => handleDeleteRequest('book', book)} /> : <p>Error: Book or business not found.</p>;
            case 'reports':
                return activeBusiness ? <ReportsPage activeBusiness={activeBusiness} /> : <WelcomePage />;
            case 'users':
                return <UsersPage businesses={businesses} onInviteClick={() => setInviteModalOpen(true)} onUpdateMemberRole={handleUpdateMemberRole} onRemoveMember={handleRemoveMemberRequest} />;
            case 'settings':
                return <SettingsPage initialTab={initialSettingsTab} theme={theme} toggleTheme={toggleTheme} businesses={businesses} activeBusiness={activeBusiness} currentUser={currentUser} onUpdateBusiness={handleUpdateBusiness} onDeleteBusiness={(b) => handleDeleteRequest('business', b)} 
                    onUpdateMemberRole={(memberId, role) => {
                        if (activeBusiness) {
                            handleUpdateMemberRole(activeBusiness.id, memberId, role);
                        }
                    }} 
                    onRemoveMember={(m) => handleRemoveMemberRequest(activeBusiness?.id || '', m)} onInviteMember={(businessId, email) => handleInviteMember(businessId, email, 'Member')} onTransferOwnership={handleTransferOwnershipRequest} />;
            case 'dashboard':
            default:
                return activeBusiness ? <Dashboard business={activeBusiness!} onViewTransactions={(book) => { setActiveBookId(book.id); setAppView('transactions'); }} onNewBookClick={() => setCreateBookModalOpen(true)} /> : <WelcomePage />;
        }
    };
    
    return (
        <div className={`h-screen w-screen flex antialiased text-gray-800 dark:text-gray-200 ${isMobile ? 'flex-col' : ''}`}>
            <Sidebar theme={theme} toggleTheme={toggleTheme} activeView={appView} onSelectView={handleSelectView} currentUser={currentUser} onLogout={handleLogout} isMobile={isMobile} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-slate-900">
                <Header/>
                <DesktopHeader/>
                <main className="flex-1 overflow-y-auto">
                    <MainContent />
                </main>
            </div>
            {isMobile && !activeBook && <BottomNavBar activeView={appView} onSelectView={handleSelectView} onFabClick={handleOpenCreateMenu} />}

            {/* Modals */}
            {isCreateMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={handleCloseCreateMenu}>
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute bottom-24 right-1/2 translate-x-1/2 flex flex-col gap-3 items-center animate-fab-in">
                        <button onClick={() => handleCreateMenuSelect('book')} className="flex items-center gap-3 w-48 justify-start p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                            <ChartPieIcon className="w-5 h-5 text-primary-500" />
                            <span className="font-semibold">{t.fab.newBook}</span>
                        </button>
                        <button onClick={() => handleCreateMenuSelect('business')} className="flex items-center gap-3 w-48 justify-start p-3 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
                            <BuildingOfficeIcon className="w-5 h-5 text-primary-500" />
                            <span className="font-semibold">{t.fab.newBusiness}</span>
                        </button>
                    </div>
                </div>
            )}
            {isCreateBusinessModalOpen && <CreateBusinessModal onClose={() => setCreateBusinessModalOpen(false)} onSave={handleSaveBusiness} businesses={businesses}/>}
            {businessToEdit && <EditBusinessModal business={businessToEdit} onClose={() => setBusinessToEdit(null)} onSave={handleUpdateBusiness} businesses={businesses}/>}
            {isCreateBookModalOpen && activeBusiness && <CreateBookModal onClose={() => setCreateBookModalOpen(false)} onSave={handleSaveBook} activeBusiness={activeBusiness}/>}
            {bookToEdit && activeBusiness && <EditBookModal book={bookToEdit} onClose={() => setBookToEdit(null)} onSave={handleUpdateBook} activeBusiness={activeBusiness}/>}
            {isCreateTransactionModalOpen && newTransactionDetails && <CreateTransactionModal book={newTransactionDetails.book} transactionType={newTransactionDetails.type} onClose={() => setCreateTransactionModalOpen(false)} onSave={handleSaveTransaction} />}
            {transactionToEdit && <EditTransactionModal transaction={transactionToEdit} onClose={() => setTransactionToEdit(null)} onSave={handleUpdateTransaction}/>}
            {isInviteModalOpen && <InviteUserModal businesses={businesses} onClose={() => setInviteModalOpen(false)} onInvite={handleInviteMember} />}
            {isTransferOwnershipModalOpen && transferOwnershipPayload && <ConfirmTransferOwnershipModal newOwnerEmail={transferOwnershipPayload.email} onClose={() => setTransferOwnershipModalOpen(false)} onConfirm={handleConfirmTransferOwnership}/>}
            {isUploadModalOpen && activeBook && (
                <UploadTransactionsModal
                    book={activeBook}
                    onClose={() => setUploadModalOpen(false)}
                    onImport={handleImportTransactions}
                />
            )}
            {itemToDelete && (
                <ConfirmDeleteModal
                    title={
                        itemToDelete.type === 'business' ? t.modals.deleteBusinessTitle :
                        itemToDelete.type === 'book' ? t.modals.deleteBookTitle :
                        itemToDelete.type === 'transaction' ? t.modals.deleteTransactionTitle :
                        itemToDelete.type === 'all-transactions' ? t.modals.deleteAllTransactionsTitle :
                        t.modals.removeMemberTitle
                    }
                    message={
                        itemToDelete.type === 'business' ? t.modals.deleteBusinessMessage.replace('{businessName}', itemToDelete.data.name) :
                        itemToDelete.type === 'book' ? t.modals.deleteBookMessage.replace('{bookName}', itemToDelete.data.name) :
                        itemToDelete.type === 'transaction' ? t.modals.deleteTransactionMessage.replace('{transactionDesc}', itemToDelete.data.description) :
                        itemToDelete.type === 'all-transactions' ? t.modals.deleteAllTransactionsMessage :
                        t.modals.removeMemberMessage.replace('{memberName}', itemToDelete.data.member.name)
                    }
                    onClose={() => setItemToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    confirmText={itemToDelete.type === 'member' ? t.modals.remove : t.modals.delete}
                />
            )}
            {isBulkDeleteModalOpen && bulkDeletePayload && (
                <ConfirmDeleteModal
                    title={t.modals.deleteTransactionsTitle.replace('{count}', String(bulkDeletePayload.transactionIds?.length))}
                    message={t.modals.deleteTransactionsMessage.replace('{count}', String(bulkDeletePayload.transactionIds?.length))}
                    onClose={() => setIsBulkDeleteModalOpen(false)}
                    onConfirm={() => {}}
                    confirmText={t.modals.delete}
                />
            )}
        </div>
    );
};

export default App;
