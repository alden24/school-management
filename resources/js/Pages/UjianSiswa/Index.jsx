import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const UjianCard = ({ ujian }) => {
    const now = new Date();
    const waktuMulai = new Date(ujian.waktu_mulai);
    const waktuSelesai = new Date(ujian.waktu_selesai);

    const isAvailable = now >= waktuMulai && now <= waktuSelesai;
    // Ambil status pengerjaan dari properti baru
    const isCompleted = ujian.is_completed;
    
    return (
        <div className={`p-6 bg-white rounded-lg shadow-md border-l-4 
            ${isCompleted ? 'border-blue-500' : (isAvailable ? 'border-green-500' : 'border-gray-300')}`
        }>
            <h3 className="text-lg font-bold text-gray-800">{ujian.judul}</h3>
            <p className="text-sm text-gray-600 mt-1">{ujian.jadwal_pelajaran?.mata_pelajaran?.nama_mapel || 'N/A'}</p>
            <p className="text-xs text-gray-500">Oleh: {ujian.jadwal_pelajaran?.guru?.nama_lengkap || 'N/A'}</p>
            
            <div className="mt-4 text-xs text-gray-500">
                <p>Mulai: {waktuMulai.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                <p>Selesai: {waktuSelesai.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
            
            <div className="mt-6">
                {isCompleted ? (
                    <button className="w-full text-center block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                        Sudah Dikerjakan
                    </button>
                ) : isAvailable ? (
                    <Link href={route('ujian.siswa.show', ujian.id)} className="w-full text-center block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
                        Mulai Kerjakan
                    </Link>
                ) : (
                    <button className="w-full text-center block bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
                        {now < waktuMulai ? 'Belum Dimulai' : 'Sudah Berakhir'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default function Index({ auth, ujians }) {
    return (
        <AuthenticatedLayout header="Daftar Ujian">
            <Head title="Ujian" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ujians.length > 0 ? (
                            ujians.map(ujian => <UjianCard key={ujian.id} ujian={ujian} />)
                        ) : (
                            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
                                <p className="text-gray-500">Tidak ada ujian yang tersedia saat ini.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
