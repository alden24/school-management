import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import axios from 'axios';

export default function Index({ auth, pembayarans, midtransClientKey }) {
    const { flash = {} } = usePage().props;
    const [loadingPayment, setLoadingPayment] = useState(null);

    // Muat script Midtrans Snap.js saat komponen dimuat
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js"; // Ganti ke URL production jika sudah live
        script.setAttribute('data-client-key', midtransClientKey);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [midtransClientKey]);

    const handlePay = (pembayaran) => {
        setLoadingPayment(pembayaran.id);
        
        // 1. Minta Snap Token dari backend Laravel Anda
        axios.post(route('pembayaran.create'), { pembayaran_id: pembayaran.id })
            .then(response => {
                // 2. Jika token berhasil didapat, buka pop-up pembayaran Midtrans
                window.snap.pay(response.data.snap_token, {
                    onSuccess: function(result){
                        alert("Pembayaran berhasil!");
                        console.log(result);
                        window.location.reload(); // Muat ulang halaman untuk update status
                    },
                    onPending: function(result){
                        alert("Menunggu pembayaran Anda!");
                        console.log(result);
                        window.location.reload();
                    },
                    onError: function(result){
                        alert("Pembayaran gagal!");
                        console.error(result);
                        setLoadingPayment(null); // Hentikan loading jika error
                    },
                    onClose: function(){
                        // Dipanggil jika pelanggan menutup pop-up tanpa menyelesaikan pembayaran
                        setLoadingPayment(null);
                    }
                });
            })
            .catch(error => {
                console.error('Error getting snap token:', error);
                alert('Gagal memulai pembayaran. Silakan coba lagi.');
                setLoadingPayment(null);
            });
    };

    // Fungsi untuk memberikan warna pada status pembayaran
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'lunas':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'belum lunas':
            case 'gagal':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout header="Pembayaran SPP">
            <Head title="Pembayaran SPP" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {flash.message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert"><p>{flash.message}</p></div>}
                    
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 space-y-4">
                            <h2 className="text-xl font-bold">Tagihan Anda</h2>
                            {pembayarans.length > 0 ? (
                                pembayarans.map(p => (
                                    <div key={p.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div>
                                            <p className="font-semibold">SPP Bulan {p.periode_bulan} {p.periode_tahun}</p>
                                            <p className="text-lg font-bold">Rp {new Intl.NumberFormat('id-ID').format(p.jumlah_bayar)}</p>
                                            <p className="text-sm mt-1">Status: 
                                                <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(p.status)}`}>
                                                    {p.status}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            {p.status.toLowerCase() !== 'lunas' && (
                                                <PrimaryButton onClick={() => handlePay(p)} disabled={loadingPayment === p.id}>
                                                    {loadingPayment === p.id ? 'Memproses...' : 'Bayar Sekarang'}
                                                </PrimaryButton>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">Tidak ada tagihan untuk saat ini.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
