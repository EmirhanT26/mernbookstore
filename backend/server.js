import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // CORS ekledik (Frontend bağlanabilsin)
import { connectDB } from './config/db.js';
import Book from './models/book.model.js';  
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB(); // MongoDB'ye bağlan

const app = express();
app.use(express.json());
app.use(cors()); // CORS Middleware ekleyerek frontend'in erişmesini sağladık

// 📌 Kitapları GET ile çek
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.error("Kitapları çekerken hata:", error.message);
        res.status(500).json({ success: false, message: "Sunucu hatası" });
    }
});

// 📌 Yeni kitap ekleme (POST)
app.post("/api/books", async (req, res) => {
    const { name, author, genre, price, image } = req.body;
    if (!name || !author || !genre || !price || !image) {
        return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }

    try {
        const newBook = new Book({ name, author, genre, price, image });
        await newBook.save();
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        console.error("Kitap eklenirken hata:", error.message);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// 📌 Kitap güncelleme (PUT)
app.put("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    const { name, author, genre, price, image } = req.body;
    if (!name || !author || !genre || !price || !image) {
        return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(id, { name, author, genre, price, image }, { new: true });
        if (!updatedBook) {
            return res.status(404).json({ message: "Kitap bulunamadı" });
        }
        res.status(200).json({ success: true, data: updatedBook });
    } catch (error) {
        console.error("Kitap güncellenirken hata:", error.message);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// 📌 Kitap silme (DELETE)
app.delete("/api/books/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({ message: "Kitap bulunamadı" });
        }
        res.status(200).json({ success: true, message: "Kitap başarıyla silindi" });
    } catch (error) {
        console.error("Kitap silinirken hata:", error.message);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// 📌 __dirname için ayarlama (Render için gerekli)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Frontend klasörünü Render için sun (Statik Dosyalar)
app.use(express.static(path.join(__dirname, '../frontend')));

// 📌 Ana sayfayı frontend'e yönlendir
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// 📌 PORT Ayarı (Render için GEREKLİ)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server started on PORT: ${PORT}`);
});
