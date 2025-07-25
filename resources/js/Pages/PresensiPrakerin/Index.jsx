import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router, useForm as useInertiaForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

// Komponen Ikon
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// Komponen Jam Real-time
const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);
    return <p className="text-4xl font-mono font-bold my-4">{time.toLocaleTimeString('id-ID')}</p>;
};

export default function Index({ auth, prakerinAktif, presensiHariIni }) {
    const { flash = {}, errors } = usePage().props;
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isKeteranganModalOpen, setIsKeteranganModalOpen] = useState(false);
    const [keteranganType, setKeteranganType] = useState('');
    const [fotoFile, setFotoFile] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [presensiType, setPresensiType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const keteranganForm = useInertiaForm({
        prakerin_id: prakerinAktif?.id,
        status: '',
        keterangan: '',
        bukti_keterangan: null,
    });

    const openKeteranganModal = (type) => {
        setKeteranganType(type);
        keteranganForm.setData('status', type);
        setIsKeteranganModalOpen(true);
    };

    const submitKeterangan = (e) => {
        e.preventDefault();
        keteranganForm.post(route('presensi.prakerin.keterangan'), {
            onSuccess: () => {
                setIsKeteranganModalOpen(false);
                keteranganForm.reset();
            },
        });
    };

    const startCamera = (type) => {
        setPresensiType(type);
        setIsCameraOpen(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
                setStatusMessage("Gagal mengakses kamera. Pastikan Anda memberikan izin.");
            });
    };

    const takePicture = () => {
        setStatusMessage("Mengambil gambar...");
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setFotoPreview(canvas.toDataURL('image/jpeg'));
        
        canvas.toBlob(blob => {
            setFotoFile(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
        }, 'image/jpeg');

        closeCameraStream();
    };

    const closeCameraStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleSubmit = () => {
        if (!fotoFile) {
            alert("Silakan ambil foto selfie terlebih dahulu.");
            return;
        }

        setLoading(true);
        setStatusMessage("Mendapatkan lokasi GPS Anda...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const routeName = presensiType === 'masuk' ? 'presensi.prakerin.masuk' : 'presensi.prakerin.pulang';
                
                const dataToPost = {
                    prakerin_id: prakerinAktif.id,
                    presensi_id: presensiHariIni?.id,
                    foto: fotoFile,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                router.post(route(routeName), dataToPost, {
                    onSuccess: () => {
                        setIsCameraOpen(false);
                        setFotoPreview(null);
                        setFotoFile(null);
                    },
                    onError: (pageErrors) => {
                        if (pageErrors.location) {
                            setStatusMessage(pageErrors.location);
                        }
                    },
                    onFinish: () => setLoading(false),
                });
            },
            (error) => {
                console.error("Error getting location: ", error);
                setStatusMessage("Gagal mendapatkan lokasi. Pastikan GPS aktif dan Anda memberikan izin.");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const closeModal = () => {
        setIsCameraOpen(false);
        setFotoPreview(null);
        setFotoFile(null);
        closeCameraStream();
    };

    if (!prakerinAktif) {
        return (
            <AuthenticatedLayout header="Presensi Prakerin">
                <Head title="Presensi Prakerin" />
                <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8"><div className="bg-white p-6 rounded-lg shadow-sm text-center"><p className="text-gray-500">Anda tidak sedang dalam periode Prakerin aktif.</p></div></div></div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header="Presensi Prakerin">
            <Head title="Presensi Prakerin" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    {errors.error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert"><p>{errors.error}</p></div>}
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                        <RealTimeClock />

                        <div className="mt-6 space-y-4">
                            {/* Jika sudah ada rekam presensi */}
                            {presensiHariIni ? (
                                <>
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <p className="font-semibold text-green-800">Kehadiran Hari Ini:</p>
                                        <p className="text-lg font-bold text-green-800">
                                            {presensiHariIni.status ? `Status: ${presensiHariIni.status}` : `Masuk: ${presensiHariIni.waktu_masuk}${presensiHariIni.waktu_pulang ? ` | Pulang: ${presensiHariIni.waktu_pulang}` : ''}`}
                                        </p>
                                    </div>
                                    {/* Tombol Absen Pulang */}
                                    {presensiHariIni.waktu_masuk && !presensiHariIni.waktu_pulang && (
                                        <DangerButton onClick={() => startCamera('pulang')} className="w-full justify-center py-4 text-lg">
                                            <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" className="w-6 h-6 mr-2" />
                                            Absen Pulang
                                        </DangerButton>
                                    )}
                                </>
                            ) : (
                                <>
                                    {/* Tombol Absen Masuk */}
                                    <PrimaryButton onClick={() => startCamera('masuk')} className="w-full justify-center py-4 text-lg">
                                        <Icon path="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" className="w-6 h-6 mr-2" />
                                        Absen Masuk
                                    </PrimaryButton>
                                    {/* Tombol Izin/Sakit */}
                                    <div className="flex gap-4">
                                        <SecondaryButton onClick={() => openKeteranganModal('Izin')} className="w-full justify-center py-3">Ajukan Izin</SecondaryButton>
                                        <SecondaryButton onClick={() => openKeteranganModal('Sakit')} className="w-full justify-center py-3">Ajukan Sakit</SecondaryButton>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isCameraOpen} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Ambil Foto Selfie</h2>
                    <div className="mt-4 bg-black rounded-lg overflow-hidden">
                        {fotoPreview ? (
                            <img src={fotoPreview} alt="Selfie Preview" className="w-full h-auto" />
                        ) : (
                            <video ref={videoRef} autoPlay className="w-full h-auto"></video>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    {errors.location && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center font-semibold">
                            {errors.location}
                        </div>
                    )}
                    <div className="mt-4 text-center text-sm text-gray-600">{statusMessage}</div>
                    <div className="mt-6 flex justify-between">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        {fotoPreview ? (
                            <PrimaryButton onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Memproses...' : 'Kirim Presensi'}
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton onClick={takePicture}>Ambil Gambar</PrimaryButton>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal show={isKeteranganModalOpen} onClose={() => setIsKeteranganModalOpen(false)}>
                <form onSubmit={submitKeterangan} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">Form Pengajuan {keteranganForm.data.status}</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Silakan isi keterangan atau lampiran bukti jika diperlukan.
                    </p>
                    <div className="mt-6">
                        <InputLabel htmlFor="keterangan" value="Keterangan" />
                        <TextInput id="keterangan" value={keteranganForm.data.keterangan} onChange={(e) => keteranganForm.setData('keterangan', e.target.value)} className="mt-1 block w-full" required />
                        <InputError message={keteranganForm.errors.keterangan} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="bukti_keterangan" value="Unggah Bukti (Surat Dokter, dll)" />
                        <input type="file" id="bukti_keterangan" onChange={(e) => keteranganForm.setData('bukti_keterangan', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        <InputError message={keteranganForm.errors.bukti_keterangan} className="mt-2" />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton type="button" onClick={() => setIsKeteranganModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3" disabled={keteranganForm.processing}>Kirim</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
