<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrangTua; // <-- Tambahkan ini
use Inertia\Inertia; //

class OrangTuaController extends Controller
{
    public function index()
    {
        // Ambil semua data guru, urutkan dari yang terbaru
        $orangtuas = OrangTua::latest()->get();

        // Render komponen React 'Guru/Index.jsx' dan kirim data 'gurus'
        return Inertia::render('OrangTua/Index', [
            'orangtuas' => $orangtuas
        ]);
    }

    public function create()
    {
        return Inertia::render('OrangTua/Create');
    }

    public function store(Request $request)
    {
        // 1. Validasi data yang masuk
    $validated = $request->validate([
        'nama_lengkap' => 'required|string|max:255',
        'kontak' => 'required|string|max:20',
        'pekerjaan' => 'required|string|max:255',
    ]);
    OrangTua::create($validated);

    // 3. Arahkan kembali ke halaman index dengan pesan sukses
    return redirect()->route('orangtua.index')->with('message', 'Data orang tua berhasil ditambahkan.');
    }

}
