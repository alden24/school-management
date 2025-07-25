import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, jadwals, selectedJadwal, students, existingNilai, activeSemester }) {
    const { flash = {} } = usePage().props;
    const [selectedJadwalId, setSelectedJadwalId] = useState(selectedJadwal?.id || '');

    const { data, setData, post, processing, errors } = useForm({
        jadwal_id: selectedJadwal?.id || '',
        semester_id: activeSemester?.id || '',
        nilai: [],
    });

    // Update form data saat daftar siswa atau nilai yang ada berubah
    useEffect(() => {
        const initialNilai = students.map(student => ({
            siswa_id: student.id,
            nama_lengkap: student.nama_lengkap,
            nilai_tugas: existingNilai[student.id]?.nilai_tugas || '',
            nilai_uts: existingNilai[student.id]?.nilai_uts || '',
            nilai_uas: existingNilai[student.id]?.nilai_uas || '',
        }));
        setData('nilai', initialNilai);
    }, [students, existingNilai]);

    const handleJadwalChange = (e) => {
        const jadwalId = e.target.value;
        setSelectedJadwalId(jadwalId);
        if (jadwalId) {
            router.get(route('nilai.index'), { jadwal_id: jadwalId }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleNilaiChange = (index, field, value) => {
        const newNilai = [...data.nilai];
        newNilai[index][field] = value;
        setData('nilai', newNilai);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('nilai.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Input Data Nilai">
            <Head title="Input Nilai" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                <div className="bg-white overflow-hidden shadow-md sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <div className="mb-6">
                            <InputLabel htmlFor="jadwal" value="Pilih Jadwal Mengajar Anda" />
                            <select
                                id="jadwal"
                                value={selectedJadwalId}
                                onChange={handleJadwalChange}
                                className="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">-- Pilih Kelas & Mata Pelajaran --</option>
                                {jadwals.map(jadwal => (
                                    <option key={jadwal.id} value={jadwal.id}>
                                        {jadwal.kelas.nama_kelas} - {jadwal.mata_pelajaran.nama_mapel}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedJadwal && students.length > 0 && (
                            <form onSubmit={submit}>
                                <h3 className="text-lg font-semibold mb-4">Daftar Siswa Kelas {selectedJadwal.kelas.nama_kelas}</h3>
                                <p className="text-sm text-gray-600 mb-4">Semester Aktif: <strong>{activeSemester.nama}</strong></p>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai Tugas</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai UTS</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Nilai UAS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.nilai.map((item, index) => (
                                                <tr key={item.siswa_id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">{item.nama_lengkap}</td>
                                                    <td className="px-6 py-4"><TextInput type="number" value={item.nilai_tugas} onChange={(e) => handleNilaiChange(index, 'nilai_tugas', e.target.value)} className="w-24 mx-auto text-center" /></td>
                                                    <td className="px-6 py-4"><TextInput type="number" value={item.nilai_uts} onChange={(e) => handleNilaiChange(index, 'nilai_uts', e.target.value)} className="w-24 mx-auto text-center" /></td>
                                                    <td className="px-6 py-4"><TextInput type="number" value={item.nilai_uas} onChange={(e) => handleNilaiChange(index, 'nilai_uas', e.target.value)} className="w-24 mx-auto text-center" /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>Simpan Nilai</PrimaryButton>
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
