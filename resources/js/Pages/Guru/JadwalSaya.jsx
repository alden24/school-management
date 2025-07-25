import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';

// Komponen untuk satu sel jadwal di dalam grid
const JadwalCell = ({ jadwal }) => {
    if (!jadwal) {
        return <div className="h-full bg-gray-100 border-gray-200 border"></div>;
    }
    // Menambahkan warna berbeda berdasarkan mata pelajaran untuk visualisasi
    const colors = ['bg-blue-100 border-blue-300', 'bg-green-100 border-green-300', 'bg-yellow-100 border-yellow-300', 'bg-purple-100 border-purple-300'];
    const colorClass = colors[jadwal.mata_pelajaran.id % colors.length];

    return (
        <div className={`h-full ${colorClass} border p-2 rounded-md shadow-sm flex flex-col justify-center`}>
            <p className="text-xs font-bold text-gray-800">{jadwal.mata_pelajaran.nama_mapel}</p>
            <p className="text-xs text-gray-600">{jadwal.kelas.nama_kelas}</p>
            <p className="text-xs text-gray-500 mt-1">{jadwal.jam_mulai.substring(0, 5)} - {jadwal.jam_selesai.substring(0, 5)}</p>
        </div>
    );
};

export default function JadwalSaya({ auth, jadwalPerHari }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Definisikan slot waktu standar untuk SMK
    const timeSlots = [
        { jam: 1, mulai: '07:00', selesai: '07:45' },
        { jam: 2, mulai: '07:45', selesai: '08:30' },
        { jam: 3, mulai: '08:30', selesai: '09:15' },
        { jam: 4, mulai: '09:15', selesai: '10:00' },
        { jam: 'Istirahat', mulai: '10:00', selesai: '10:20' },
        { jam: 5, mulai: '10:20', selesai: '11:05' },
        { jam: 6, mulai: '11:05', selesai: '11:50' },
        { jam: 'Istirahat', mulai: '11:50', selesai: '12:20' },
        { jam: 7, mulai: '12:20', selesai: '13:05' },
        { jam: 8, mulai: '13:05', selesai: '13:50' },
        { jam: 9, mulai: '13:50', selesai: '14:35' },
        { jam: 10, mulai: '14:35', selesai: '15:20' },
    ];

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const currentDayName = currentTime.toLocaleDateString('id-ID', { weekday: 'long' });
    const currentTimeString = currentTime.toTimeString().substring(0, 5);

    return (
        <AuthenticatedLayout header="Jadwal Mengajar Saya">
            <Head title="Jadwal Mengajar" />
            <div className="py-12">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-md rounded-lg">
                        <div className="overflow-x-auto">
                            <div className="grid" style={{ gridTemplateColumns: '80px repeat(12, minmax(100px, 1fr))' }}>
                                {/* Header Jam */}
                                <div className="sticky top-0 z-10"></div>
                                {timeSlots.map((slot, index) => (
                                    <div key={index} className={`p-2 text-center border-b border-r ${slot.jam === 'Istirahat' ? 'bg-gray-200' : 'bg-gray-100'}`}>
                                        <p className="font-bold text-sm">{slot.jam}</p>
                                        <p className="text-xs text-gray-600">{slot.mulai} - {slot.selesai}</p>
                                    </div>
                                ))}

                                {/* Baris Jadwal per Hari */}
                                {days.map(day => (
                                    <Fragment key={day}>
                                        <div className={`p-2 text-center font-bold border-r flex items-center justify-center ${day === currentDayName ? 'bg-indigo-100' : ''}`}>{day}</div>
                                        {(() => {
                                            const renderedCells = [];
                                            let occupiedSlots = 0;

                                            timeSlots.forEach((slot, index) => {
                                                if (occupiedSlots > 0) {
                                                    occupiedSlots--;
                                                    return;
                                                }

                                                if (slot.jam === 'Istirahat') {
                                                    renderedCells.push(<div key={`rest-${index}`} className="bg-gray-200 border-r"></div>);
                                                    return;
                                                }

                                                const jadwal = (jadwalPerHari[day] || []).find(j => j.jam_mulai.substring(0, 5) === slot.mulai);
                                                
                                                if (jadwal) {
                                                    const startIndex = index;
                                                    // PERBAIKAN: Cari index jam selesai yang paling mendekati
                                                    const endIndex = timeSlots.findIndex(s => s.selesai === jadwal.jam_selesai.substring(0, 5));
                                                    const colSpan = (endIndex !== -1 && endIndex >= startIndex) ? (endIndex - startIndex + 1) : 1;
                                                    
                                                    occupiedSlots = colSpan - 1;

                                                    const isCurrentSlot = day === currentDayName && currentTimeString >= jadwal.jam_mulai.substring(0, 5) && currentTimeString < jadwal.jam_selesai.substring(0, 5);
                                                    
                                                    renderedCells.push(
                                                        <div key={`jadwal-${index}`} className={`p-1 h-24 border-b border-r ${isCurrentSlot ? 'bg-blue-100' : ''}`} style={{ gridColumn: `span ${colSpan}` }}>
                                                            <JadwalCell jadwal={jadwal} />
                                                        </div>
                                                    );
                                                } else {
                                                    const isCurrentSlot = day === currentDayName && currentTimeString >= slot.mulai && currentTimeString < slot.selesai;
                                                    renderedCells.push(
                                                        <div key={`empty-${index}`} className={`p-1 h-24 border-b border-r ${isCurrentSlot ? 'bg-blue-100' : ''}`}>
                                                            <JadwalCell jadwal={null} />
                                                        </div>
                                                    );
                                                }
                                            });
                                            return renderedCells;
                                        })()}
                                    </Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
