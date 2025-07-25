<!DOCTYPE html>
<html>
<head>
    <title>Surat Pengantar Prakerin</title>
    <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; }
        .kop-surat { text-align: center; border-bottom: 3px solid black; padding-bottom: 15px; }
        .kop-surat h1, .kop-surat h2, .kop-surat p { margin: 0; }
        .isi-surat { margin-top: 30px; }
        .tabel-data { margin-top: 20px; margin-left: 40px; }
        .tabel-data td { padding: 2px 0; }
        .penutup { margin-top: 40px; }
        .ttd { margin-top: 80px; text-align: right; }
        .tabel-siswa { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .tabel-siswa th, .tabel-siswa td { border: 1px solid black; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="kop-surat">
        <h1>PEMERINTAH KOTA TANGERANG</h1>
        <h2>SEKOLAH MENENGAH KEJURUAN NEGERI X</h2>
    </div>

    <div class="isi-surat">
        <p>Yth. Bapak/Ibu Pimpinan <strong>{{ $dudi->nama_perusahaan }}</strong></p>
        <p>Dengan hormat, kami mengajukan permohonan agar siswa-siswi kami berikut ini dapat melaksanakan Praktik Kerja Industri (Prakerin) di perusahaan yang Bapak/Ibu pimpin:</p>

        <table class="tabel-siswa">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Siswa</th>
                    <th>NISN</th>
                    <th>Kelas</th>
                </tr>
            </thead>
            <tbody>
                @foreach($penempatans as $index => $p)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $p->siswa->nama_lengkap }}</td>
                    <td>{{ $p->siswa->nisn }}</td>
                    <td>{{ $p->siswa->kelas->nama_kelas }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <p>Pelaksanaan Prakerin direncanakan akan dimulai pada tanggal <strong>{{ \Carbon\Carbon::parse($penempatans->first()->tanggal_mulai)->format('d F Y') }}</strong>.</p>
        <p>Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.</p>
    </div>

    <div class="penutup">
        <p>Hormat kami,</p>
        <p>Kepala Sekolah SMK Negeri X</p>
        <div class="ttd">
            <p><strong>(Nama Kepala Sekolah)</strong></p>
            <p>NIP. ......................</p>
        </div>
    </div>
</body>
</html>
