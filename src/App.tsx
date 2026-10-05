/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { FinancingSimulator } from './components/FinancingSimulator';
import { RegistrationForm } from './components/RegistrationForm';
import { RegisteredJamaahPortal } from './components/RegisteredJamaahPortal';
import { ManasikCenter } from './components/ManasikCenter';
import { MitraPortal } from './components/MitraPortal';
import { AdminPortal } from './components/AdminPortal';
import { AboutAndFAQ } from './components/AboutAndFAQ';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { WhatsAppGatewayModal } from './components/WhatsAppGatewayModal';
import { LoginModal } from './components/LoginModal';
import { MascotQafiChat } from './components/MascotQafiChat';
import { INITIAL_REGISTRATIONS, PACKAGES, COMPANY_INFO, DEFAULT_CREDENTIALS, DEFAULT_LOGO } from './data/mockData';
import { RegistrationRecord, UmrahPackage, UserRole, RoleCredentials } from './types';
import { WhatsAppContextMessageOptions } from './utils/whatsapp';
import { Upload, X, Save, Image as ImageIcon, Sparkles, Check, Cloud, Database } from 'lucide-react';
import { 
  testConnection, 
  fetchPackagesFromFirestore, 
  savePackageToFirestore, 
  fetchRegistrationsFromFirestore, 
  saveRegistrationToFirestore, 
  fetchSettingsFromFirestore, 
  saveSettingsToFirestore 
} from './services/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [userRole, setUserRole] = useState<UserRole>('calon_jamaah');
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // Top running announcement text (persisted in local + Firebase)
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    try {
      return localStorage.getItem('qafiya_announcement') || '';
    } catch {
      return '';
    }
  });

  const handleUpdateAnnouncement = (text: string) => {
    setAnnouncementText(text);
    try {
      if (text) {
        localStorage.setItem('qafiya_announcement', text);
      } else {
        localStorage.removeItem('qafiya_announcement');
      }
    } catch (e) {
      console.warn(e);
    }
    saveSettingsToFirestore({ logoUrl: customLogo, marqueeAnnouncement: text });
  };

  // Persistence for Custom Logo (QAFIYA logo)
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('qafiya_custom_logo') || DEFAULT_LOGO;
    } catch (e) {
      return DEFAULT_LOGO;
    }
  });

  const handleUpdateLogo = (newLogo: string | null) => {
    setCustomLogo(newLogo);
    try {
      if (newLogo) {
        localStorage.setItem('qafiya_custom_logo', newLogo);
      } else {
        localStorage.removeItem('qafiya_custom_logo');
      }
    } catch (e) {
      console.warn('LocalStorage logo error:', e);
    }
    saveSettingsToFirestore({ logoUrl: newLogo, marqueeAnnouncement: announcementText });
  };

  // Persistence for Packages (Admin can edit images & details per package)
  const [packages, setPackages] = useState<UmrahPackage[]>(() => {
    try {
      const saved = localStorage.getItem('qafiya_packages');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage packages error:', e);
    }
    return PACKAGES;
  });

  const handleUpdatePackage = (updatedPkg: UmrahPackage) => {
    setPackages((prev) => {
      const next = prev.map((p) => (p.id === updatedPkg.id ? updatedPkg : p));
      try {
        localStorage.setItem('qafiya_packages', JSON.stringify(next));
      } catch (e) {
        console.warn('LocalStorage save packages error:', e);
      }
      return next;
    });
    // Sync with Firebase Firestore
    savePackageToFirestore(updatedPkg);
  };

  const handleResetPackages = () => {
    setPackages(PACKAGES);
    try {
      localStorage.removeItem('qafiya_packages');
    } catch (e) {
      console.warn(e);
    }
  };

  // Sync all local state to Firebase Firestore
  const handleSyncToFirebase = async () => {
    try {
      await saveSettingsToFirestore({ logoUrl: customLogo, marqueeAnnouncement: announcementText });
      for (const p of packages) {
        await savePackageToFirestore(p);
      }
      for (const r of registrations) {
        await saveRegistrationToFirestore(r);
      }
    } catch (e) {
      console.warn('Sync to Firebase error:', e);
    }
  };

  // Persistence for Credentials (Admin, Mitra, Jamaah, Calon)
  const [credentials, setCredentials] = useState<RoleCredentials>(() => {
    try {
      const saved = localStorage.getItem('qafiya_credentials');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage credentials error:', e);
    }
    return DEFAULT_CREDENTIALS;
  });

  const handleUpdateCredentials = (newCreds: RoleCredentials) => {
    setCredentials(newCreds);
    try {
      localStorage.setItem('qafiya_credentials', JSON.stringify(newCreds));
    } catch (e) {
      console.warn('LocalStorage credentials save error:', e);
    }
  };

  // Authentication status per session for all 4 roles
  const [authenticatedRoles, setAuthenticatedRoles] = useState<{
    admin: boolean;
    mitra: boolean;
    jamaah_terdaftar: boolean;
    calon_jamaah: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('qafiya_auth_roles');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      admin: false,
      mitra: false,
      jamaah_terdaftar: false,
      calon_jamaah: true, // starts accessible for visitor, but user can lock/logout or test password
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('qafiya_auth_roles', JSON.stringify(authenticatedRoles));
    } catch (e) {}
  }, [authenticatedRoles]);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [targetLoginRole, setTargetLoginRole] = useState<UserRole | null>(null);

  // Quick photo editor modal for Admin on any package
  const [adminQuickPhotoPkg, setAdminQuickPhotoPkg] = useState<UmrahPackage | null>(null);
  const [quickPhotoInput, setQuickPhotoInput] = useState('');
  const [quickPhotoSuccess, setQuickPhotoSuccess] = useState(false);
  const quickPhotoFileRef = React.useRef<HTMLInputElement>(null);

  // Persistence for registrations: starting cleanly at 0
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('qafiya_registrations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id === 'reg-001') {
          localStorage.removeItem('qafiya_registrations');
          return [];
        }
        return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return INITIAL_REGISTRATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('qafiya_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [registrations]);

  const handleClearAllRegistrations = () => {
    setRegistrations([]);
    try {
      localStorage.removeItem('qafiya_registrations');
    } catch (e) {
      console.warn(e);
    }
  };

  // Context transfer between components
  const [selectedPkgForSim, setSelectedPkgForSim] = useState<UmrahPackage>(packages[0] || PACKAGES[0]);
  const [selectedPkgForReg, setSelectedPkgForReg] = useState<UmrahPackage>(packages[0] || PACKAGES[0]);
  const [preselectedDp, setPreselectedDp] = useState<number | undefined>();
  const [preselectedTenor, setPreselectedTenor] = useState<number | undefined>();

  // Initialize and synchronize with Firebase Firestore on mount
  useEffect(() => {
    testConnection().then((connected) => {
      setFirebaseConnected(connected);
    });

    fetchSettingsFromFirestore().then((settings) => {
      if (settings?.logoUrl) {
        setCustomLogo(settings.logoUrl);
      }
      if (settings?.marqueeAnnouncement !== undefined && settings.marqueeAnnouncement !== null) {
        setAnnouncementText(settings.marqueeAnnouncement);
      }
    });

    fetchPackagesFromFirestore().then((fbPackages) => {
      if (fbPackages && fbPackages.length > 0) {
        setPackages(fbPackages);
      } else {
        // Seed initial packages into Firestore
        PACKAGES.forEach((pkg) => {
          savePackageToFirestore(pkg);
        });
      }
    });

    fetchRegistrationsFromFirestore().then((fbRegs) => {
      if (fbRegs && fbRegs.length > 0) {
        setRegistrations(fbRegs);
      }
    });
  }, []);

  // WhatsApp Gateway Modal state
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [gatewayOptions, setGatewayOptions] = useState<WhatsAppContextMessageOptions>({
    type: 'general',
    targetPhone: 'primary',
  });

  const handleOpenGateway = (options?: WhatsAppContextMessageOptions) => {
    if (options) {
      setGatewayOptions(options);
    } else {
      setGatewayOptions({ type: 'general', targetPhone: 'primary' });
    }
    setIsGatewayOpen(true);
  };

  const handleSelectPackageForSimulation = (pkg: UmrahPackage) => {
    setSelectedPkgForSim(pkg);
    setActiveTab('simulasi');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackageForRegistration = (pkg: UmrahPackage, scheduleId?: string) => {
    setSelectedPkgForReg(pkg);
    setActiveTab('pendaftaran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedFromSimulationToReg = (pkg: UmrahPackage, dpAmount: number, tenor: number) => {
    setSelectedPkgForReg(pkg);
    setPreselectedDp(dpAmount);
    setPreselectedTenor(tenor);
    setActiveTab('pendaftaran');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSuccessRegister = (newRecord: RegistrationRecord) => {
    setRegistrations((prev) => [newRecord, ...prev]);
    saveRegistrationToFirestore(newRecord);
  };

  const handleUpdateRegistration = (updated: RegistrationRecord) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    saveRegistrationToFirestore(updated);
  };

  // Admin shortcut to edit a package photo
  const handleEditPackageByAdmin = (pkg: UmrahPackage) => {
    setAdminQuickPhotoPkg({ ...pkg });
    setQuickPhotoInput(pkg.image);
    setQuickPhotoSuccess(false);
  };

  // Intercept role switching to require password login
  const handleRequestRoleSwitch = (role: UserRole) => {
    if (authenticatedRoles[role]) {
      setUserRole(role);
      if (role === 'calon_jamaah') setActiveTab('beranda');
      else if (role === 'jamaah_terdaftar') setActiveTab('status');
      else if (role === 'mitra') setActiveTab('mitra');
      else if (role === 'admin') setActiveTab('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTargetLoginRole(role);
      setIsLoginModalOpen(true);
    }
  };

  // Logout/lock session for a role
  const handleLogoutRole = (role: UserRole) => {
    setAuthenticatedRoles((prev) => ({
      ...prev,
      [role]: false,
    }));
    setTargetLoginRole(role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (role: UserRole) => {
    setAuthenticatedRoles((prev) => ({
      ...prev,
      [role]: true,
    }));
    setUserRole(role);
    setIsLoginModalOpen(false);

    if (role === 'calon_jamaah') setActiveTab('beranda');
    else if (role === 'jamaah_terdaftar') setActiveTab('status');
    else if (role === 'mitra') setActiveTab('mitra');
    else if (role === 'admin') setActiveTab('admin');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white relative">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onRequestRoleSwitch={handleRequestRoleSwitch}
        onOpenGateway={handleOpenGateway}
        customLogo={customLogo}
        onLogoutRole={handleLogoutRole}
        announcementText={announcementText}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <>
            <HeroSection
              onSelectTab={setActiveTab}
              onOpenGateway={handleOpenGateway}
              customLogo={customLogo}
            />
            <PackagesSection
              packages={packages}
              isAdmin={userRole === 'admin'}
              onEditPackage={handleEditPackageByAdmin}
              onSelectPackageForSimulation={handleSelectPackageForSimulation}
              onSelectPackageForRegistration={handleSelectPackageForRegistration}
              onOpenGateway={handleOpenGateway}
            />
            <FinancingSimulator
              initialPackage={selectedPkgForSim}
              onProceedToRegistration={handleProceedFromSimulationToReg}
              onOpenGateway={handleOpenGateway}
            />
            <AboutAndFAQ onOpenGateway={handleOpenGateway} />
          </>
        )}

        {activeTab === 'paket' && (
          <PackagesSection
            packages={packages}
            isAdmin={userRole === 'admin'}
            onEditPackage={handleEditPackageByAdmin}
            onSelectPackageForSimulation={handleSelectPackageForSimulation}
            onSelectPackageForRegistration={handleSelectPackageForRegistration}
            onOpenGateway={handleOpenGateway}
          />
        )}

        {activeTab === 'simulasi' && (
          <FinancingSimulator
            initialPackage={selectedPkgForSim}
            onProceedToRegistration={handleProceedFromSimulationToReg}
            onOpenGateway={handleOpenGateway}
          />
        )}

        {activeTab === 'pendaftaran' && (
          <RegistrationForm
            preselectedPackage={selectedPkgForReg}
            preselectedDp={preselectedDp}
            preselectedTenor={preselectedTenor}
            onSuccessRegister={handleSuccessRegister}
            onOpenGateway={handleOpenGateway}
          />
        )}

        {activeTab === 'status' && (
          <RegisteredJamaahPortal
            registrations={registrations}
            onOpenGateway={handleOpenGateway}
            onUpdateRegistration={handleUpdateRegistration}
          />
        )}

        {activeTab === 'manasik' && (
          <ManasikCenter onOpenGateway={handleOpenGateway} />
        )}

        {activeTab === 'mitra' && (
          <MitraPortal onOpenGateway={handleOpenGateway} />
        )}

        {activeTab === 'admin' && (
          <AdminPortal
            registrations={registrations}
            onUpdateRegistration={handleUpdateRegistration}
            onClearAllRegistrations={handleClearAllRegistrations}
            onOpenGateway={handleOpenGateway}
            customLogo={customLogo}
            onUpdateLogo={handleUpdateLogo}
            credentials={credentials}
            onUpdateCredentials={handleUpdateCredentials}
            packages={packages}
            onUpdatePackage={handleUpdatePackage}
            onResetPackages={handleResetPackages}
            announcementText={announcementText}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            firebaseConnected={firebaseConnected}
            onSyncToFirebase={handleSyncToFirebase}
          />
        )}

        {activeTab === 'tentang' && (
          <AboutAndFAQ onOpenGateway={handleOpenGateway} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenGateway={handleOpenGateway}
        customLogo={customLogo}
      />

      {/* Persistent Floating WhatsApp Gateway Button (Bottom Right) */}
      <FloatingWhatsApp
        onOpenGateway={() => handleOpenGateway({ type: 'general' })}
      />

      {/* Mascot QAFI Online Interactive Q&A Assistant (Bottom Left) */}
      <MascotQafiChat
        onOpenWhatsApp={handleOpenGateway}
      />

      {/* Live Gateway WhatsApp Modal with Smart Topics */}
      <WhatsAppGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        initialOptions={gatewayOptions}
      />

      {/* Secure Role Login Modal for all 4 roles (Admin, Mitra, Jamaah, Calon) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        targetRole={targetLoginRole}
        credentials={credentials}
        onSuccess={handleLoginSuccess}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenWhatsApp={handleOpenGateway}
      />

      {/* Admin Quick Package Photo Editor Modal */}
      {adminQuickPhotoPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-emerald-100 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 text-white p-5 relative">
              <button
                onClick={() => setAdminQuickPhotoPkg(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
                <ImageIcon className="w-4 h-4" />
                <span>Khusus Admin • Edit Foto Paket</span>
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                {adminQuickPhotoPkg.name}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {quickPhotoSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Foto paket berhasil diperbarui!</span>
                </div>
              )}

              {/* Current photo preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Pratinjau Foto Baru:
                </label>
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 relative shadow-sm">
                  <img
                    src={adminQuickPhotoPkg.image}
                    alt={adminQuickPhotoPkg.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-md font-mono">
                    Resolusi Penuh
                  </span>
                </div>
              </div>

              {/* Upload file or URL */}
              <div className="space-y-3 pt-1">
                <input
                  ref={quickPhotoFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 3 * 1024 * 1024) {
                        alert('Ukuran file maksimal 3 MB.');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        setAdminQuickPhotoPkg({
                          ...adminQuickPhotoPkg,
                          image: base64,
                        });
                        setQuickPhotoInput(base64);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => quickPhotoFileRef.current?.click()}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah Foto dari Galeri HP / Komputer</span>
                </button>

                <div className="text-[11px] text-slate-500 text-center font-medium">atau ketik URL gambar:</div>

                <input
                  type="url"
                  value={quickPhotoInput}
                  onChange={(e) => {
                    setQuickPhotoInput(e.target.value);
                    setAdminQuickPhotoPkg({
                      ...adminQuickPhotoPkg,
                      image: e.target.value,
                    });
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                />

                {/* Preset quick photos */}
                <div className="pt-1">
                  <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Pilihan Cepat Foto Berkualitas Tinggi:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { title: 'Ka\'bah', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop' },
                      { title: 'Nabawi', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=1200&auto=format&fit=crop' },
                      { title: 'Thawaf', url: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1200&auto=format&fit=crop' },
                      { title: 'Arafah', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop' },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAdminQuickPhotoPkg({ ...adminQuickPhotoPkg, image: preset.url });
                          setQuickPhotoInput(preset.url);
                        }}
                        className="group relative rounded-lg overflow-hidden border border-slate-200 hover:border-emerald-500 h-14 bg-slate-800 transition-all cursor-pointer"
                        title={preset.title}
                      >
                        <img src={preset.url} alt={preset.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-bold p-1 text-center">
                          {preset.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    handleUpdatePackage(adminQuickPhotoPkg);
                    setQuickPhotoSuccess(true);
                    setTimeout(() => {
                      setAdminQuickPhotoPkg(null);
                    }, 1200);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Foto Paket Ini</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminQuickPhotoPkg(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
