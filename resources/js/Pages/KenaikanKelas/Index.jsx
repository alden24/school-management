import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Checkbox from '@/Components/Checkbox';

export default function Index({ auth, kelases, students, kelasAsalId }) {
    const { flash = {} } = usePage().props;
    const [selectedKelasAsal, setSelectedKelasAsal] = useState(kelasAsalId || '');

    const { data, setData, post, processing, errors } = useForm({
        kelas_asal_id: kelasAsalId || '',
        kelas_tujuan_id: '',
        siswa_ids: [],
    });

    useEffect(() => {
        // Reset siswa_ids setiap kali daftar siswa berubah
        setData('siswa_ids', []);
    }, [students]);

    const handleKelasAsalChange = (e) => {
        const kelasId = e.target.value;
        setSelectedKelasAsal(kelasId);
        setData('kelas_asal_id', kelasId);
        router.get(route('kenaikan-kelas.index'), { kelas_asal_id: kelasId }, { preserveState: true, preserveScroll: true });
    };

    const handleSiswaCheck = (e, siswaId) => {
        if (e.target.checked) {
            setData('siswa_ids', [...data.siswa_ids, siswaId]);
        } else {
            setData('siswa_ids', data.siswa_ids.filter(id => id !== siswaId));
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allSiswaIds = students.map(s => s.id);
            setData('siswa_ids', allSiswaIds);
        } else {
            setData('siswa_ids', []);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.siswa_ids.length === 0) {
            alert('Pilih setidaknya satu siswa untuk diproses.');
            return;
        }
        if (!data.kelas_tujuan_id) {
            alert('Pilih kelas tujuan terlebih dahulu.');
            return;
        }
        post(route('kenaikan-kelas.store'));
    };

    return (
        <AuthenticatedLayout header="Proses Kenaikan Kelas">
            <Head title="Kenaikan Kelas" />
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <InputLabel htmlFor="kelas_asal" value="Pilih Kelas Asal" />
                                <select id="kelas_asal" value={selectedKelasAsal} onChange={handleKelasAsalChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelases.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="kelas_tujuan" value="Pindahkan Ke Kelas Tujuan" />
                                <select id="kelas_tujuan" value={data.kelas_tujuan_id} onChange={(e) => setData('kelas_tujuan_id', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                                    <option value="">-- Pilih Kelas --</option>
                                    {kelases.map(k => <option key={k.id} value={k.id}>{k.nama_kelas}</option>)}
                                </select>
                            </div>
                        </div>

                        {students.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Daftar Siswa</h3>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-4 text-left">
                                                    <Checkbox onChange={handleSelectAll} checked={students.length > 0 && data.siswa_ids.length === students.length} />
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NISN</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {students.map(siswa => (
                                                <tr key={siswa.id}>
                                                    <td className="p-4">
                                                        <Checkbox onChange={(e) => handleSiswaCheck(e, siswa.id)} checked={data.siswa_ids.includes(siswa.id)} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{siswa.nama_lengkap}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">{siswa.nisn}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <PrimaryButton disabled={processing}>Proses Kenaikan Kelas</PrimaryButton>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
