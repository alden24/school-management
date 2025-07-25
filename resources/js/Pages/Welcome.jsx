import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

// Komponen Ikon
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// Data untuk Slideshow
const slides = [
    {
        image: 'https://placehold.co/1200x600/3B82F6/FFFFFF?text=Kegiatan+Belajar+Mengajar',
        title: 'Pendidikan Berkualitas',
        subtitle: 'Menciptakan lingkungan belajar yang inovatif dan mendukung.'
    },
    {
        image: 'https://placehold.co/1200x600/10B981/FFFFFF?text=Praktik+Laboratorium',
        title: 'Fasilitas Modern',
        subtitle: 'Laboratorium lengkap untuk menunjang praktik kejuruan.'
    },
    {
        image: 'https://placehold.co/1200x600/F59E0B/FFFFFF?text=Ekstrakurikuler',
        title: 'Pengembangan Diri',
        subtitle: 'Beragam kegiatan ekstrakurikuler untuk menyalurkan bakat dan minat.'
    }
];

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Logika untuk slideshow otomatis
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Selamat Datang di SMK Yuppentek 2" />
            <div className="bg-gray-50 text-gray-800">
                {/* Header & Navigasi */}
                <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-md z-50">
                    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <ApplicationLogo className="h-10 w-auto text-indigo-600" />
                            <span className="text-xl font-bold">SMK Yuppentek 2</span>
                        </div>
                        <nav className="hidden md:flex space-x-8">
                            <a href="#beranda" className="hover:text-indigo-600">Beranda</a>
                            <a href="#profil" className="hover:text-indigo-600">Profil</a>
                            <a href="#kejuruan" className="hover:text-indigo-600">Kejuruan</a>
                            {/* PERBAIKAN: Menggunakan Link Inertia ke halaman login */}
                            <Link href={route('login')} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">Login</Link>
                        </nav>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <Icon path="M4 6h16M4 12h16m-7 6h7" />
                            </button>
                        </div>
                    </div>
                    {isMenuOpen && (
                        <nav className="md:hidden bg-white py-4">
                            <a href="#beranda" className="block text-center py-2 hover:bg-gray-100">Beranda</a>
                            <a href="#profil" className="block text-center py-2 hover:bg-gray-100">Profil</a>
                            <a href="#kejuruan" className="block text-center py-2 hover:bg-gray-100">Kejuruan</a>
                            <Link href={route('login')} className="block text-center py-2 bg-indigo-500 text-white mt-2 mx-4 rounded-md">Login</Link>
                        </nav>
                    )}
                </header>

                {/* Hero Section dengan Slideshow */}
                <section id="beranda" className="relative h-screen w-full overflow-hidden">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="text-center text-white p-4">
                                    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">{slide.title}</h1>
                                    <p className="mt-4 text-lg md:text-xl drop-shadow-lg">{slide.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Bagian Profil Sekolah */}
                <section id="profil" className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold mb-2">Profil SMK Yuppentek 2 Tangerang</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            SMK Yuppentek 2 Tangerang berkomitmen untuk menghasilkan lulusan yang kompeten, berkarakter, dan siap menghadapi tantangan dunia industri. Dengan dukungan fasilitas modern dan tenaga pengajar profesional, kami mempersiapkan generasi unggul untuk masa depan.
                        </p>
                    </div>
                </section>

                {/* Bagian Kejuruan */}
                <section id="kejuruan" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">Program Keahlian</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <Icon path="M10 20l4-16m4 4l-4 16M5 12h14" className="mx-auto h-12 w-12 text-indigo-500" />
                                <h3 className="text-xl font-bold mt-4">Teknik Komputer & Jaringan</h3>
                                <p className="text-gray-600 mt-2">Mempelajari perakitan, instalasi, dan perbaikan komputer serta jaringan.</p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <Icon path="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 01.517 3.86l.477 2.387a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l-.477-2.387a2 2 0 00-.547-1.806z" className="mx-auto h-12 w-12 text-indigo-500" />
                                <h3 className="text-xl font-bold mt-4">Rekayasa Perangkat Lunak</h3>
                                <p className="text-gray-600 mt-2">Fokus pada desain, pengembangan, dan pengujian aplikasi perangkat lunak.</p>
                            </div>
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <Icon path="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="mx-auto h-12 w-12 text-indigo-500" />
                                <h3 className="text-xl font-bold mt-4">Akuntansi & Keuangan</h3>
                                <p className="text-gray-600 mt-2">Membekali siswa dengan keahlian dalam bidang akuntansi dan manajemen keuangan.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Bagian Login Dihapus dari sini */}

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className="container mx-auto px-6 text-center">
                        <p>&copy; {new Date().getFullYear()} SMK Yuppentek 2 Tangerang. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
