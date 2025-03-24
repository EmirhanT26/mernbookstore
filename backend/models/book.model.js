import mongoose from 'mongoose';

// Kitap şemasını tanımlıyoruz
const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Kitap adı
    author: { type: String, required: true },  // Yazar adı
    genre: { type: String, required: true },  // Kitap türü
    price: { type: Number, required: true },  // Kitap fiyatı
    image: { type: String, required: true }   // Kitap resmi (resmin URL'si)
});

// Kitap modelini oluşturuyoruz
const Book = mongoose.model('Book', bookSchema);

export default Book;
