import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Book from './models/book.model.js';  // Kitap modelini ekliyoruz
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(express.json());

// Kitapları getiren endpoint
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        console.log("Error in Fetching books, ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Kitap eklemek için endpoint
app.post("/api/books", async (req, res) => {
    const { name, author, genre, price, image } = req.body;

    if (!name || !author || !genre || !price || !image) {
        return res.status(400).json({ message: "Lütfen tüm alanları doldurun." });
    }

    const newBook = new Book({ name, author, genre, price, image });

    try {
        await newBook.save();
        res.status(201).json({ success: true, data: newBook });
    } catch (error) {
        console.error("Kitap oluşturulurken hata:", error.message);
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

// Kitap güncellemek için endpoint
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

// Kitap silme endpoint'i
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


// __dirname'i çözümlemek için fileURLToPath ve import.meta.url kullanıyoruz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Frontend klasörünü statik olarak sunmak
app.use(express.static(path.join(__dirname, '../frontend')));

// Ana sayfa isteğine (/) yanıt olarak index.html dosyasını sunuyoruz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:5000");
});
