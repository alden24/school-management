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
    </style>
</head>
<body>
    <div class="kop-surat">
        <h1>PEMERINTAH KOTA TANGERANG</h1>
        <h2>DINAS PENDIDIKAN</h2>
        <h2>SEKOLAH MENENGAH KEJURUAN NEGERI X</h2>
        <p>Jl. Alamat Sekolah No. 123, Kota Tangerang, Banten</p>
    </div>

    <div class="isi-surat">
        <p>Nomor: .../SMK-X/VII/2025</p>
        <p>Lampiran: -</p>
        <p>Perihal: Permohonan Praktik Kerja Industri (Prakerin)</p>
        <br>
        <p>Yth.</p>
        <p>Bapak/Ibu Pimpinan</p>
        <p><strong>{{ $prakerin->dudi->nama_perusahaan }}</strong></p>
        <p>di Tempat</p>
        <br>
        <p>Dengan hormat,</p>
        <p style="text-align: justify;">
            Dalam rangka memenuhi program kurikulum Sekolah Menengah Kejuruan (SMK) dan untuk memberikan pengalaman kerja nyata kepada siswa-siswi kami, dengan ini kami mengajukan permohonan agar siswa kami dapat melaksanakan Praktik Kerja Industri (Prakerin) di perusahaan yang Bapak/Ibu pimpin.
        </p>
        <p>Adapun siswa yang kami ajukan adalah sebagai berikut:</p>
        <table class="tabel-data">
            <tr>
                <td>Nama</td>
                <td>: {{ $prakerin->siswa->nama_lengkap }}</td>
            </tr>
            <tr>
                <td>NISN</td>
                <td>: {{ $prakerin->siswa->nisn }}</td>
            </tr>
            <tr>
                <td>Kelas</td>
                <td>: {{ $prakerin->siswa->kelas->nama_kelas }}</td>
            </tr>
            <tr>
                <td>Kejuruan</td>
                <td>: {{ $prakerin->siswa->kelas->kejuruan->nama_kejuruan }}</td>
            </tr>
        </table>
        <p>
            Pelaksanaan Prakerin direncanakan akan dimulai pada tanggal <strong>{{ \Carbon\Carbon::parse($prakerin->tanggal_mulai)->format('d F Y') }}</strong> sampai dengan <strong>{{ \Carbon\Carbon::parse($prakerin->tanggal_selesai)->format('d F Y') }}</strong>.
        </p>
        <p>
            Demikian surat permohonan ini kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.
        </p>
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
