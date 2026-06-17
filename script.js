/**
 * Fungsi untuk mengubah angka menjadi format teks terbilang (Bahasa Indonesia)
 */
function terbilang(angka) {
    const bilangan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    let hasil = "";
    
    if (angka < 12) {
        hasil = bilangan[angka];
    } else if (angka < 20) {
        hasil = terbilang(angka - 10) + " Belas";
    } else if (angka < 100) {
        hasil = terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
    } else if (angka < 200) {
        hasil = " Seratus " + terbilang(angka - 100);
    } else if (angka < 1000) {
        hasil = terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
    } else if (angka < 2000) {
        hasil = " Seribu " + terbilang(angka - 1000);
    } else if (angka < 1000000) {
        hasil = terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
    } else if (angka < 1000000000) {
        hasil = terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
    }
    return hasil.trim();
}

/**
 * Fungsi utama untuk menggenerate kwitansi dan mengunduhnya sebagai JPG
 */
function generateReceipt() {
    // 1. Ambil data dari input form
    const nama = document.getElementById('input-nama').value || "-";
    const alamat = document.getElementById('input-alamat')?.value || "-";
    const nominal = document.getElementById('input-nominal').value || 0;
    const jenis = document.getElementById('input-jenis')?.value;
    const keterangan = document.getElementById('input-keterangan').value || "-";
    const penerima = document.getElementById('input-penerima').value || "________________";

    // 3. Update konten pada elemen Template Kwitansi
    document.getElementById('res-nama').innerText = nama;
    if (document.getElementById('res-alamat')) document.getElementById('res-alamat').innerText = alamat;
    document.getElementById('res-nominal').innerText = parseInt(nominal).toLocaleString('id-ID');
    if (document.getElementById('res-jenis')) document.getElementById('res-jenis').innerText = jenis;
    document.getElementById('res-keterangan').innerText = keterangan;
    document.getElementById('res-terbilang').innerText = (nominal > 0) ? terbilang(nominal) + " Rupiah" : "-";
    
    const elDoa = document.getElementById('res-doa');
    if (elDoa) {
        elDoa.innerText = `“Semoga Allah memberikan pahala atas apa yang Bapak/Ibu ${nama} berikan, dan semoga Allah memberkahi harta yang tersisa serta menjadikannya sebagai pembersih bagi jiwa.”`;
    }

    document.getElementById('res-penerima').innerText = penerima;
    updateDate(); // Memastikan tanggal tetap terbaru saat generate

    // 4. Proses konversi elemen HTML menjadi Gambar menggunakan html2canvas
    const receiptElement = document.getElementById('receipt-canvas');
    
    // Ambil judul untuk nama file (Kwitansi atau Nota)
    const docTitle = document.querySelector('.receipt-title').innerText;
    
    html2canvas(receiptElement, {
        scale: 2, // Meningkatkan resolusi agar gambar tidak pecah
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff"
    }).then(canvas => {
        // Mengubah canvas menjadi URL gambar format JPEG
        const image = canvas.toDataURL("image/jpeg", 0.9);
        
        // Membuat elemen link download sementara
        const link = document.createElement('a');
        link.download = `${docTitle.replace(/\s+/g, '_')}-${nama.replace(/\s+/g, '_')}.jpg`;
        link.href = image;
        link.click();
    });
}

/**
 * Fungsi untuk mendapatkan dan menampilkan tanggal realtime
 */
function updateDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const hariIni = new Date().toLocaleDateString('id-ID', options);
    document.getElementById('res-tanggal').innerText = "Tegal, " + hariIni;
}

// Menambahkan event listener pada tombol saat DOM sudah siap
document.addEventListener('DOMContentLoaded', () => {
    updateDate(); // Set tanggal otomatis saat halaman dibuka
    const btnCreate = document.getElementById('btn-create');
    btnCreate.addEventListener('click', generateReceipt);
});
