/* ==========================================================================
   1. DATA MENU (PENGGANTI DATABASE)
   ========================================================================== */
// Seluruh data produk disimpan dalam bentuk Array of Objects.
// Anak SMK/SMA dapat dengan mudah menambah, mengubah, atau menghapus menu di sini.
const menuData = [
    {
        id: 1,
        nama: "Kopi Susu Gula Aren",
        kategori: "minuman",
        harga: 18000,
        deskripsi: "Espresso dengan fresh milk dan manisnya gula aren asli.",
        gambar: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 2,
        nama: "Manual Brew V60",
        kategori: "minuman",
        harga: 22000,
        deskripsi: "Kopi hitam seduh manual dengan pilihan biji kopi Nusantara.",
        gambar: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 3,
        nama: "Matcha Latte",
        kategori: "minuman",
        harga: 20000,
        deskripsi: "Teh hijau khas Jepang berpadu dengan susu creamy yang lembut.",
        gambar: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 4,
        nama: "Nasi Goreng K спеціаl Kawan",
        kategori: "makanan",
        harga: 25000,
        deskripsi: "Nasi goreng rempah dengan suwiran ayam, telur mata sapi, dan kerupuk.",
        gambar: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 5,
        nama: "Mie Goreng Rempah",
        kategori: "makanan",
        harga: 20000,
        deskripsi: "Mie goreng dengan bumbu rahasia kafe, sayuran segar, dan bakso.",
        gambar: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 6,
        nama: "Croissant Butter",
        kategori: "dessert",
        harga: 15000,
        deskripsi: "Roti pastry khas Prancis yang renyah di luar dan lembut di dalam.",
        gambar: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: 7,
        nama: "Pandan Toast Bread",
        kategori: "dessert",
        harga: 16000,
        deskripsi: "Roti bakar tebal dengan selai srikaya pandan homemade yang wangi.",
        gambar: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=300&q=80"
    }
];

// Variabel untuk menyimpan status kategori aktif dan keranjang belanja
let kategoriAktif = 'semua';
let keranjang = JSON.parse(localStorage.getItem('keranjangKafe')) || [];

/* ==========================================================================
   2. FUNGSI RENDER / MENAMPILKAN MENU KE HTML
   ========================================================================== */
function tampilkanMenu(dataPilihan) {
    const container = document.getElementById('menuContainer');
    container.innerHTML = ''; // Kosongkan kontainer sebelum diisi ulang

    // Jika data kosong (tidak ditemukan)
    if (dataPilihan.length === 0) {
        container.innerHTML = `<p class="no-menu-text">Maaf, menu yang kamu cari tidak ditemukan.</p>`;
        return;
    }

    // Melakukan perulangan (looping) untuk setiap item menu
    dataPilihan.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('menu-card');

        card.innerHTML = `
            <img src="${item.gambar}" alt="${item.nama}" class="menu-img">
            <div class="menu-info">
                <h3 class="menu-title">${item.nama}</h3>
                <p class="menu-desc">${item.deskripsi}</p>
                <div class="menu-price">Rp ${item.harga.toLocaleString('id-ID')}</div>
            </div>
            <button class="btn-add" onclick="tambahKeKeranjang(${item.id})">+ Pilihn</button>
        `;

        container.appendChild(card);
    });
}

/* ==========================================================================
   3. FUNGSI PENCARIAN & FILTER KATEGORI
   ========================================================================== */
// Fungsi untuk memfilter berdasarkan tombol kategori (Semua, Makanan, Minuman, Dessert)
function filterKategori(kategori) {
    kategoriAktif = kategori;

    // Mengubah kelas tombol aktif agar warnanya berubah
    const tombolList = document.querySelectorAll('.btn-category');
    tombolList.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    jalankanFilterDanPencarian();
}

// Fungsi untuk menyaring menu berdasarkan ketikan di kolom pencarian
function filterMenu() {
    jalankanFilterDanPencarian();
}

// Gabungan logika filter kategori dan kata kunci pencarian
function jalankanFilterDanPencarian() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();

    const hasilFilter = menuData.filter(item => {
        const sesuaiKategori = (kategoriAktif === 'semua') || (item.kategori === kategoriAktif);
        const sesuaiKeyword = item.nama.toLowerCase().includes(keyword) || item.deskripsi.toLowerCase().includes(keyword);
        return sesuaiKategori && sesuaiKeyword;
    });

    tampilkanMenu(hasilFilter);
}

/* ==========================================================================
   4. MANAJEMEN KERANJANG BELANJA
   ========================================================================== */
// Menambahkan item ke keranjang
function tambahKeKeranjang(idMenu) {
    const produk = menuData.find(item => item.id === idMenu);
    
    // Cek apakah produk sudah ada di dalam keranjang
    const indexAda = keranjang.findIndex(item => item.id === idMenu);

    if (indexAda !== -1) {
        // Jika sudah ada, tambahkan jumlahnya (qty)
        keranjang[indexAda].qty += 1;
    } else {
        // Jika belum ada, masukkan sebagai item baru dengan qty = 1
        keranjang.push({
            id: produk.id,
            nama: produk.nama,
            harga: produk.harga,
            qty: 1
        });
    }

    simpanDanPerbaruiKeranjang();
}

// Mengubah jumlah (qty) item di keranjang
function ubahQty(idMenu, aksi) {
    const index = keranjang.findIndex(item => item.id === idMenu);

    if (index !== -1) {
        if (aksi === 'tambah') {
            keranjang[index].qty += 1;
        } else if (aksi === 'kurang') {
            keranjang[index].qty -= 1;
            // Jika jumlahnya 0, hapus dari keranjang
            if (keranjang[index].qty <= 0) {
                keranjang.splice(index, 1);
            }
        }
    }

    simpanDanPerbaruiKeranjang();
}

// Simpan ke localStorage agar data tidak hilang saat halaman direfresh
function simpanDanPerbaruiKeranjang() {
    localStorage.setItem('keranjangKafe', JSON.stringify(keranjang));
    tampilkanKeranjang();
}

// Menampilkan daftar item keranjang ke layar HTML
function tampilkanKeranjang() {
    const containerCart = document.getElementById('cartItems');
    const totalHargaElement = document.getElementById('totalHarga');
    
    containerCart.innerHTML = '';

    if (keranjang.length === 0) {
        containerCart.innerHTML = `<p class="empty-cart-text">Belum ada menu yang dipilih.</p>`;
        totalHargaElement.innerText = 'Rp 0';
        return;
    }

    let totalKeseluruhan = 0;

    keranjang.forEach(item => {
        let subtotal = item.harga * item.qty;
        totalKeseluruhan += subtotal;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <span>${item.nama} (x${item.qty})</span>
            <div class="cart-item-controls">
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
                <button class="btn-qty" onclick="ubahQty(${item.id}, 'kurang')">-</button>
                <button class="btn-qty" onclick="ubahQty(${item.id}, 'tambah')">+</button>
            </div>
        `;

        containerCart.appendChild(cartItemDiv);
    });

    totalHargaElement.innerText = `Rp ${totalKeseluruhan.toLocaleString('id-ID')}`;
}

/* ==========================================================================
   5. FITUR CHECKOUT (TUNJUKKAN KE KASIR)
   ========================================================================== */
function tunjunjukkanKeKasir() {
    if (keranjang.length === 0) {
        alert('Silakan pilih minimal satu menu terlebih dahulu!');
        return;
    }

    let rincianPesanan = "--- RINCIAN PESANAN KAFE ---\n";
    let total = 0;

    keranjang.forEach(item => {
        let subtotal = item.harga * item.qty;
        total += subtotal;
        rincianPesanan += `- ${item.nama} x${item.qty} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    rincianPesanan += `\nTOTAL ESTIMASI: Rp ${total.toLocaleString('id-ID')}\n`;
    rincianPesanan += "\nTunjukkan layar ini ke kasir untuk memproses pesanan Anda!";

    alert(rincianPesanan);
}

/* ==========================================================================
   6. INISIALISASI SAAT HALAMAN PERTAMA KALI DIBUKA
   ========================================================================== */
// Menjalankan fungsi render menu dan keranjang saat file selesai dimuat browser
document.addEventListener('DOMContentLoaded', () => {
    tampilkanMenu(menuData);
    tampilkanKeranjang();
});
