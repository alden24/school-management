<!DOCTYPE html>
<html>
<head>
    <title>Laporan Presensi Guru</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 10pt; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { margin: 0; }
        .header p { margin: 0; font-size: 12pt; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Presensi Guru & Tendik</h1>
        <p>Periode: {{ \Carbon\Carbon::parse($startDate)->format('d F Y') }} s/d {{ \Carbon\Carbon::parse($endDate)->format('d F Y') }}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Nama</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Waktu Masuk</th>
                <th>Waktu Pulang</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @if(count($presensis) > 0)
                @foreach($presensis as $presensi)
                <tr>
                    <td>{{ $presensi->guru->nama_lengkap }}</td>
                    <td>{{ \Carbon\Carbon::parse($presensi->tanggal)->format('d-m-Y') }}</td>
                    <td>{{ $presensi->status }}</td>
                    <td>{{ $presensi->waktu_masuk ? \Carbon\Carbon::parse($presensi->waktu_masuk)->format('H:i') : '-' }}</td>
                    <td>{{ $presensi->waktu_pulang ? \Carbon\Carbon::parse($presensi->waktu_pulang)->format('H:i') : '-' }}</td>
                    <td>
                        @if($presensi->status === 'Hadir')
                            Masuk: {{ $presensi->status_lokasi_masuk }} <br>
                            Pulang: {{ $presensi->status_lokasi_pulang }}
                        @else
                            {{ $presensi->keterangan }}
                        @endif
                    </td>
                </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="6" style="text-align: center;">Tidak ada data presensi pada periode ini.</td>
                </tr>
            @endif
        </tbody>
    </table>
</body>
</html>
