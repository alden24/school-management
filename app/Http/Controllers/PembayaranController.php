<?php

namespace App\Http\Controllers;

use App\Models\PembayaranSPP;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Midtrans\Config;
use Midtrans\Snap;
use Midtrans\Notification;

class PembayaranController extends Controller
{
    public function __construct()
    {
        // Set konfigurasi Midtrans
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        // Jika yang login adalah admin
        if ($user->role === 'admin') {
            $query = Siswa::with('kelas')->where('status', 'Aktif');

            if ($request->has('search')) {
                $query->where('nama_lengkap', 'like', '%' . $request->search . '%')
                      ->orWhere('nisn', 'like', '%' . $request->search . '%');
            }

            return Inertia::render('Pembayaran/AdminIndex', [
                'siswas' => $query->paginate(10),
                'filters' => $request->only(['search']),
            ]);
        }

        // Jika yang login adalah siswa
        $siswa = $user->siswa;
        $pembayarans = PembayaranSPP::where('siswa_id', $siswa->id)->latest()->get();

        return Inertia::render('Pembayaran/Index', [
            'pembayarans' => $pembayarans,
            'midtransClientKey' => config('midtrans.client_key'),
        ]);
    }

    public function createTransaction(Request $request)
    {
        $request->validate([
            'pembayaran_id' => 'required|exists:pembayaran_spps,id',
        ]);

        $pembayaran = PembayaranSPP::findOrFail($request->pembayaran_id);
        $user = Auth::user();

        // Buat transaksi di Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => $pembayaran->order_id,
                // PERBAIKAN: Konversi jumlah bayar menjadi integer
                'gross_amount' => (int) $pembayaran->jumlah_bayar,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
        ];

        try {
            \Log::info('MIDTRANS CONFIG', [
                'server_key' => config('midtrans.server_key'),
                'is_production' => config('midtrans.is_production'),
            ]);
            \Log::info([
                'order_id' => $pembayaran->order_id,
                'gross_amount' => (int) $pembayaran->jumlah_bayar,
                'user_name' => $user->name,
                'user_email' => $user->email,
            ]);
            $snapToken = Snap::getSnapToken($params);
            $pembayaran->snap_token = $snapToken;
            $pembayaran->save();

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function notificationHandler(Request $request)
    {
        $notif = new Notification();

        $transaction = $notif->transaction_status;
        $type = $notif->payment_type;
        $order_id = $notif->order_id;
        $fraud = $notif->fraud_status;

        $pembayaran = PembayaranSPP::where('order_id', $order_id)->first();

        if ($transaction == 'capture' || $transaction == 'settlement') {
            $pembayaran->status = 'Lunas';
        } else if ($transaction == 'pending') {
            $pembayaran->status = 'Pending';
        } else if ($transaction == 'deny' || $transaction == 'expire' || $transaction == 'cancel') {
            $pembayaran->status = 'Gagal';
        }

        $pembayaran->payment_type = $type;
        $pembayaran->save();

        return response()->json(['message' => 'Notifikasi berhasil diproses.']);
    }
    public function show(Siswa $siswa)
{
    // Muat semua riwayat pembayaran untuk siswa ini
    $siswa->load('pembayaranSpps');

    return Inertia::render('Pembayaran/Show', [
        'siswa' => $siswa,
    ]);
}

// Tambahkan method storeTagihan()
    public function storeTagihan(Request $request)
    {
        $validated = $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'periode_bulan' => 'required|integer|min:1|max:12',
            'periode_tahun' => 'required|integer|min:2020',
            'jumlah_bayar' => 'required|numeric|min:1000',
        ]);

        // Cek apakah tagihan untuk periode ini sudah ada
        $existingTagihan = PembayaranSPP::where('siswa_id', $validated['siswa_id'])
            ->where('periode_bulan', $validated['periode_bulan'])
            ->where('periode_tahun', $validated['periode_tahun'])
            ->exists();

        if ($existingTagihan) {
            return redirect()->back()->withErrors(['error' => 'Tagihan untuk periode ini sudah ada.']);
        }

        PembayaranSPP::create([
            'siswa_id' => $validated['siswa_id'],
            'jumlah_bayar' => $validated['jumlah_bayar'],
            'periode_bulan' => $validated['periode_bulan'],
            'periode_tahun' => $validated['periode_tahun'],
            'order_id' => 'SPP-' . $validated['siswa_id'] . '-' . time(),
            'status' => 'Belum Lunas', // Status awal tagihan
        ]);

        return redirect()->back()->with('message', 'Tagihan SPP berhasil dibuat.');
    }

    public function storeBulkTagihan(Request $request)
{
    $validated = $request->validate([
        'periode_bulan' => 'required|integer|min:1|max:12',
        'periode_tahun' => 'required|integer|min:2020',
        'jumlah_bayar' => 'required|numeric|min:1000',
    ]);

    // Ambil semua siswa yang masih aktif
    $siswasAktif = Siswa::where('status', 'Aktif')->get();
    $tagihanBaruCount = 0;

    DB::transaction(function () use ($siswasAktif, $validated, &$tagihanBaruCount) {
        foreach ($siswasAktif as $siswa) {
            // Cek apakah tagihan untuk periode ini sudah ada untuk siswa ini
            $existingTagihan = PembayaranSPP::where('siswa_id', $siswa->id)
                ->where('periode_bulan', $validated['periode_bulan'])
                ->where('periode_tahun', $validated['periode_tahun'])
                ->exists();

            // Jika belum ada, buat tagihan baru
            if (!$existingTagihan) {
                PembayaranSPP::create([
                    'siswa_id' => $siswa->id,
                    'jumlah_bayar' => $validated['jumlah_bayar'],
                    'periode_bulan' => $validated['periode_bulan'],
                    'periode_tahun' => $validated['periode_tahun'],
                    'order_id' => 'SPP-' . $siswa->id . '-' . time() . rand(10, 99),
                    'status' => 'Belum Lunas',
                ]);
                $tagihanBaruCount++;
            }
        }
    });

    return redirect()->route('pembayaran.index')->with('message', $tagihanBaruCount . ' tagihan SPP baru berhasil dibuat.');
}
}
