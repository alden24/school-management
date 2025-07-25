import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, jadwals, selectedJadwal, students, tanggal }) {
    const { flash = {} } = usePage().props;
    const [selectedJadwalId, setSelectedJadwalId] = useState(selectedJadwal?.id || '');

    const { data, setData, post, processing, errors } = useForm({
        jadwal_id: selectedJadwal?.id || '',
        tanggal: tanggal,
        absensi: [],
    });

    // Update form data saat daftar siswa berubah
    useEffect(() => {
        const initialAbsensi = students.map(student => ({
            siswa_id: student.id,
            status: 'Hadir', // Default status
            keterangan: '',
        }));
        setData('absensi', initialAbsensi);
    }, [students]);

    const handleJadwalChange = (e) => {
        const jadwalId = e.target.value;
        setSelectedJadwalId(jadwalId);
        if (jadwalId) {
            router.get(route('absensi.index'), { jadwal_id: jadwalId }, { preserveState: true });
        }
    };

    const handleStatusChange = (index, status) => {
        const newAbsensi = [...data.absensi];
        newAbsensi[index].status = status;
        setData('absensi', newAbsensi);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('absensi.store'));
    };

    return (
        <AuthenticatedLayout header="Pengambilan Absensi">
            <Head title="Absensi" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="mb-6">
                            <InputLabel htmlFor="jadwal" value="Pilih Jadwal Mengajar Hari Ini" />
                            <select
                                id="jadwal"
                                value={selectedJadwalId}
                                onChange={handleJadwalChange}
                                className="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">-- Pilih Kelas & Mata Pelajaran --</option>
                                {jadwals.map(jadwal => (
                                    <option key={jadwal.id} value={jadwal.id}>
                                        {jadwal.kelas.nama_kelas} - {jadwal.mata_pelajaran.nama_mapel} ({jadwal.jam_mulai.substring(0,5)} - {jadwal.jam_selesai.substring(0,5)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedJadwal && students.length > 0 && (
                            <form onSubmit={submit}>
                                <h3 className="text-lg font-semibold mb-4">Daftar Siswa Kelas {selectedJadwal.kelas.nama_kelas}</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status Kehadiran</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.map((student, index) => (
                                                <tr key={student.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{student.nama_lengkap}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex justify-center items-center space-x-4">
                                                            {['Hadir', 'Izin', 'Sakit', 'Alfa'].map(status => (
                                                                <label key={status} className="flex items-center space-x-2">
                                                                    <input
                                                                        type="radio"
                                                                        name={`status_${student.id}`}
                                                                        value={status}
                                                                        checked={data.absensi[index]?.status === status}
                                                                        onChange={() => handleStatusChange(index, status)}
                                                                        className="form-radio h-4 w-4 text-indigo-600"
                                                                    />
                                                                    <span>{status}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>Simpan Absensi</PrimaryButton>
                                </div>
                            </form>
                        )}
                         {selectedJadwal && students.length === 0 && (
                             <p className="text-gray-500">Tidak ada siswa di kelas ini.</p>
                         )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
