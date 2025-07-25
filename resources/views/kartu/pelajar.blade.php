<!DOCTYPE html>
<html>
<head>
    <title>Kartu Pelajar - {{ $siswa->nama_lengkap }}</title>
    <style>
        @page { margin: 0; }
        body { font-family: 'Arial', sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .card-container {
            width: 336px; /* 8.9 cm */
            height: 204px; /* 5.4 cm */
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }
        .card-header {
            background-color: #005A9E; /* Biru */
            color: white;
            padding: 10px 15px;
        }
        .card-header h1 {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            text-transform: uppercase;
        }
        .card-subheader {
            background-color: #FFC72C; /* Kuning */
            color: #333;
            padding: 2px 15px;
            font-size: 8px;
            font-weight: bold;
        }
        .card-content {
            padding: 15px;
            display: flex;
            flex-grow: 1;
        }
        .pas-foto {
            width: 85px;
            height: 113px;
            object-fit: cover;
            border: 3px solid #E5E7EB;
            border-radius: 8px;
        }
        .biodata {
            margin-left: 15px;
            font-size: 9px;
            flex-grow: 1;
        }
        .biodata table {
            width: 100%;
        }
        .biodata td {
            padding: 2px 0;
            vertical-align: top;
        }
        .biodata .label {
            width: 30%;
            font-weight: 600;
            color: #555;
        }
        .card-footer {
            background-color: #005A9E;
            color: white;
            padding: 5px 15px;
            text-align: center;
            font-size: 9px;
            font-weight: bold;
        }
        .ttd-area {
            position: absolute;
            right: 15px;
            bottom: 30px; /* Disesuaikan agar tidak tumpang tindih dengan footer */
            text-align: center;
            font-size: 9px;
        }
    </style>
</head>
<body>
    <div class="card-container">
        <div class="card-header">
            <h1>KARTU PELAJAR</h1>
        </div>
        <div class="card-subheader">
            TAHUN AJARAN 2024/2025
        </div>
        <div class="card-content">
            {{-- PERBAIKAN: Gunakan path absolut ke file foto --}}
            <img src="{{ storage_path('app/public/' . $siswa->foto) }}" alt="Pas Foto" class="pas-foto">
            <div class="biodata">
                <table>
                    <tr>
                        <td class="label">Nama</td>
                        <td>: {{ $siswa->nama_lengkap }}</td>
                    </tr>
                    <tr>
                        <td class="label">NISN</td>
                        <td>: {{ $siswa->nisn }}</td>
                    </tr>
                    <tr>
                        <td class="label">NIS</td>
                        <td>: {{ $siswa->nis }}</td>
                    </tr>
                    <tr>
                        <td class="label">TTL</td>
                        <td>: {{ $siswa->tempat_lahir }}, {{ \Carbon\Carbon::parse($siswa->tanggal_lahir)->format('d-m-Y') }}</td>
                    </tr>
                    <tr>
                        <td class="label">Alamat</td>
                        <td>: {{ $siswa->alamat }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="card-footer">
            SMK YUPPENTEK 2 TANGERANG
        </div>
    </div>
</body>
</html>
