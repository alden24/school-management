import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

// --- Komponen Ikon SVG ---
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Komponen NavLink untuk item menu utama ---
const SidebarNavLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
            active
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
        {children}
    </Link>
);

// --- Komponen Dropdown untuk Menu ---
const SidebarDropdown = ({ name, icon, children }) => {
    const { url } = usePage();
    
    // Cek apakah URL saat ini adalah bagian dari anak-anak menu ini
    const isActive = children.some(child => route().current(child.route.split('.')[0] + '.*'));

    const [isOpen, setIsOpen] = useState(isActive);

    // Efek ini akan memastikan dropdown terbuka jika Anda bernavigasi ke halaman anaknya
    useEffect(() => {
        setIsOpen(isActive);
    }, [isActive, url]);

    const handleToggle = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
            >
                <div className="flex items-center">
                    <Icon path={icon} className="w-5 h-5" />
                    <span className="ml-4">{name}</span>
                </div>
                <Icon path="M19 9l-7 7-7-7" className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200 space-y-1">
                    {children.map((child) => (
                        <Link
                            key={child.name}
                            href={route(child.route)}
                            className={`block px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                                route().current(child.route)
                                    ? 'text-indigo-600 font-semibold'
                                    : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {child.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Daftar Menu ---
const adminMenuItems = [
    { name: 'Dashboard', route: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    {
        name: 'Master Data',
        icon: 'M3 7v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zM5 5a2 2 0 00-2 2v1h14V7a2 2 0 00-2-2H5z',
        children: [
            // { name: 'Presensi', route: 'presensi.guru.index', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { name: 'Guru', route: 'guru.index' },
            { name: 'Kelas', route: 'kelas.index' },
            { name: 'Kejuruan', route: 'kejuruan.index' },
            // { name: 'Orang Tua', route: 'orangtua.index' },
            { name: 'Siswa', route: 'siswa.index' },
            { name: 'Semester', route: 'semester.index' },
            { name: 'Kategori Mapel', route: 'kategori-matapelajaran.index' },
            { name: 'Mata Pelajaran', route: 'matapelajaran.index' },
            { name: 'Kurikulum', route: 'kurikulum.index' },
        ],
    },
    {
        name: 'Transaksi',
        icon: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM2 10v6a2 2 0 002 2h12a2 2 0 002-2v-6H2z',
        children: [
            { name: 'Jadwal Pelajaran', route: 'jadwal-pelajaran.index' },
            { name: 'Kenaikan Kelas', route: 'kenaikan-kelas.index' },
            { name: 'Mutasi Siswa', route: 'mutasi-siswa.index' },
            { name: 'Pembayaran SPP', route: 'pembayaran.index' },
        ],
    },
    {
        name: 'Prakerin',
        icon: 'M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM2 10v6a2 2 0 002 2h12a2 2 0 002-2v-6H2z',
        children: [
            { name: 'Manajemen DUDI', route: 'dudi.index' },
            { name: 'Pembimbing DUDI', route: 'pembimbing-dudi.index' }, // <-- Tambahkan ini
            { name: 'Penempatan', route: 'penempatan-prakerin.index' },
            { name: 'Penilaian Prakerin', route: 'penilaian.prakerin.index' }, // <-- Pindahkan ke sini

        ],
    },
    { name: 'Bank Soal', route: 'ujian.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    {
        name: 'Laporan',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        children: [
            { name: 'Presensi Guru', route: 'laporan.presensi.guru.index' },
        ],
    },
    { name: 'Pengaturan Sekolah', route: 'pengaturan.sekolah.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },

];

const guruMenuItems = [
    { name: 'Dashboard', route: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Presensi', route: 'presensi.guru.index', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Jadwal Mengajar', route: 'guru.jadwalSaya', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Absensi', route: 'absensi.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Nilai', route: 'nilai.index', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M12 21a9 9 0 110-18 9 9 0 010 18z' },
    {
        name: 'Prakerin',
        icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        children: [
            { name: 'Validasi Jurnal', route: 'validasi.jurnal.index', icon: 'M9 12l2 2 4-4m6-4a9 9 0 11-18 0 9 9 0 0118 0z' },
            { name: 'Laporan Presensi', route: 'laporan.prakerin.index', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
         
        ],
    },
       { name: 'Bank Soal', route: 'ujian.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Pengaturan Akun', route: 'profile.edit', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

const siswaMenuItems = [
    { name: 'Dashboard', route: 'dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Jadwal Saya', route: 'jadwal.siswa', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Pembayaran SPP', route: 'pembayaran.index', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Ujian', route: 'ujian.siswa.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Jurnal Prakerin', route: 'jurnal-harian.index', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Presensi Prakerin', route: 'presensi.prakerin.index', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { name: 'Pengaturan Akun', route: 'profile.edit', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];


export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    let menuItems;
    if (auth.user.role === 'admin') {
        menuItems = adminMenuItems;
    } else if (auth.user.role === 'guru') {
        menuItems = guruMenuItems;
    } else {
        menuItems = siswaMenuItems;
    }

    // Gunakan foto_url dari auth, atau fallback ke ui-avatars
    const userPhoto = auth.user.foto_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=random`;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-center h-20 border-b">
                    <Link href="/" className="flex items-center space-x-3">
                        <ApplicationLogo className="block h-10 w-auto fill-current text-indigo-600" />
                        <span className="text-2xl font-bold text-gray-800">SekolahKu</span>
                    </Link>
                </div>
                <nav className="mt-6 flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        item.children ? (
                            <SidebarDropdown key={item.name} name={item.name} icon={item.icon}>
                                {item.children}
                            </SidebarDropdown>
                        ) : (
                            <SidebarNavLink key={item.name} href={route(item.route)} active={route().current(item.route)}>
                                <Icon path={item.icon} className="w-5 h-5" />
                                <span className="ml-4">{item.name}</span>
                            </SidebarNavLink>
                        )
                    ))}
                </nav>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                <header className="flex items-center justify-between h-20 px-6 bg-white border-b">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
                        <Icon path="M4 6h16M4 12h16M4 18h16" className="w-6 h-6" />
                    </button>
                    <div className="flex items-center">
                        {header && <h1 className="text-2xl font-semibold text-gray-800">{header}</h1>}
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button className="flex items-center space-x-2 focus:outline-none">
                                <img className="h-10 w-10 rounded-full object-cover" src={userPhoto} alt={auth.user.name} />
                                <div className="hidden md:block text-left">
                                    <div className="font-semibold text-sm text-gray-800">{auth.user.name}</div>
                                    <div className="text-xs text-gray-500 capitalize">{auth.user.role}</div>
                                </div>
                            </button>
                        </div>
                         <Link href={route('logout')} method="post" as="button" className="p-2 rounded-full hover:bg-gray-200 focus:outline-none">
                            <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-6 h-6 text-gray-500" />
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
            
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"></div>}
        </div>
    );
}
