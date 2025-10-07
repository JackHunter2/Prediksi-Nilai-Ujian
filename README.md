# Aplikasi Prediksi Nilai Ujian

Aplikasi web Flask untuk prediksi nilai ujian berdasarkan jam belajar menggunakan model regresi linear.

## Fitur

- 🎯 **Prediksi Akurat**: Menggunakan model regresi linear yang telah dilatih
- 🎨 **UI Modern**: Interface yang responsif dan menarik dengan Bootstrap 5
- ✅ **Validasi Input**: Validasi yang robust untuk input pengguna
- 📱 **Responsive Design**: Tampilan optimal di desktop dan mobile
- 🚀 **Real-time Prediction**: Hasil prediksi langsung ditampilkan
- 🛡️ **Error Handling**: Penanganan error yang komprehensif

## Teknologi yang Digunakan

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Machine Learning**: scikit-learn, joblib
- **Icons**: Font Awesome 6

## Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd Regresion
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Jalankan aplikasi**
   ```bash
   python app.py
   ```

4. **Buka browser**
   ```
   http://localhost:5000
   ```

## Struktur Proyek

```
Regresion/
├── app.py                 # Aplikasi Flask utama
├── linear_model.pkl      # Model machine learning
├── student_scores.xls    # Dataset training
├── train.ipynb          # Notebook untuk training model
├── requirements.txt     # Dependencies Python
├── README.md           # Dokumentasi
├── static/             # File statis
│   ├── css/
│   │   └── style.css   # Custom CSS
│   └── js/
│       └── script.js   # Custom JavaScript
└── templates/          # Template HTML
    ├── index.html      # Halaman utama
    ├── 404.html        # Halaman error 404
    └── 500.html        # Halaman error 500
```

## Cara Penggunaan

1. Buka aplikasi di browser
2. Masukkan jumlah jam belajar per hari (0.1 - 24.0)
3. Klik tombol "Prediksi Nilai"
4. Lihat hasil prediksi yang ditampilkan

## Validasi Input

- Jam belajar harus berupa angka positif
- Rentang yang diperbolehkan: 0.1 - 24.0 jam
- Input akan divalidasi secara real-time

## Model Machine Learning

Aplikasi menggunakan model regresi linear sederhana yang dilatih dengan data:
- **Variabel Independen (X)**: Jam belajar per hari
- **Variabel Dependen (Y)**: Nilai ujian

## Environment Variables

- `FLASK_DEBUG`: Set ke `True` untuk mode debug (default: True)
- `PORT`: Port untuk menjalankan aplikasi (default: 5000)

## Error Handling

Aplikasi memiliki penanganan error yang komprehensif:
- Validasi input yang robust
- Error handling untuk model yang tidak tersedia
- Halaman error khusus (404, 500)
- Logging untuk debugging

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## Kontak

- Email: your.email@example.com
- Project Link: [https://github.com/yourusername/Regresion](https://github.com/yourusername/Regresion)
