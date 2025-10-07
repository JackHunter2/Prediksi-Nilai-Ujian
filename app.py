from flask import Flask, render_template, request, flash, redirect, url_for
import joblib
import numpy as np
import os
import logging
from werkzeug.exceptions import BadRequest

# Konfigurasi logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Ganti dengan secret key yang aman

# Load model dengan error handling
try:
    if os.path.exists("linear_model.pkl"):
        model = joblib.load("linear_model.pkl")
        logger.info("Model berhasil dimuat")
    else:
        logger.error("File model tidak ditemukan")
        model = None
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    model = None

def validate_input(hours_str):
    """
    Validasi input jam belajar
    """
    try:
        hours = float(hours_str)
        if hours < 0:
            return False, "Jam belajar tidak boleh negatif"
        if hours > 24:
            return False, "Jam belajar tidak boleh lebih dari 24 jam"
        if hours == 0:
            return False, "Jam belajar harus lebih dari 0"
        return True, hours
    except ValueError:
        return False, "Masukkan angka yang valid"
    except Exception as e:
        return False, f"Error validasi: {str(e)}"

@app.route("/", methods=["GET", "POST"])
def index():
    """
    Route utama untuk prediksi nilai ujian
    """
    result = None
    error = None
    
    if request.method == "POST":
        try:
            # Cek apakah model tersedia
            if model is None:
                error = "Model tidak tersedia. Silakan hubungi administrator."
                return render_template("index.html", result=result, error=error)
            
            # Ambil input dari form
            hours_str = request.form.get("hours", "").strip()
            
            if not hours_str:
                error = "Silakan masukkan jumlah jam belajar"
                return render_template("index.html", result=result, error=error)
            
            # Validasi input
            is_valid, validated_hours = validate_input(hours_str)
            
            if not is_valid:
                error = validated_hours  # validated_hours berisi pesan error
                return render_template("index.html", result=result, error=error)
            
            # Lakukan prediksi
            try:
                # Pastikan input dalam format yang benar untuk model
                input_data = np.array([[validated_hours]])
                prediction = model.predict(input_data)[0]
                
                # Format hasil prediksi
                if prediction < 0:
                    prediction = 0  # Nilai tidak boleh negatif
                elif prediction > 100:
                    prediction = 100  # Nilai maksimal 100
                
                result = f"Estimasi Nilai: {prediction:.2f}"
                logger.info(f"Prediksi berhasil: {validated_hours} jam -> {prediction:.2f}")
                
            except Exception as e:
                logger.error(f"Error dalam prediksi: {str(e)}")
                error = "Terjadi kesalahan dalam proses prediksi. Silakan coba lagi."
                
        except BadRequest:
            error = "Data yang dikirim tidak valid"
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            error = "Terjadi kesalahan yang tidak terduga. Silakan coba lagi."
    
    return render_template("index.html", result=result, error=error)

@app.route("/about")
def about():
    """
    Halaman tentang aplikasi
    """
    return render_template("about.html")

@app.errorhandler(404)
def not_found(error):
    """
    Handler untuk halaman tidak ditemukan
    """
    return render_template("404.html"), 404

@app.errorhandler(500)
def internal_error(error):
    """
    Handler untuk error internal server
    """
    logger.error(f"Internal server error: {str(error)}")
    return render_template("500.html"), 500

@app.errorhandler(413)
def too_large(error):
    """
    Handler untuk file/data terlalu besar
    """
    return render_template("413.html"), 413

if __name__ == "__main__":
    # Konfigurasi untuk production
    debug_mode = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    port = int(os.environ.get('PORT', 5000))
    
    logger.info(f"Starting Flask app in {'debug' if debug_mode else 'production'} mode")
    logger.info(f"Model status: {'Loaded' if model is not None else 'Not available'}")
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)
