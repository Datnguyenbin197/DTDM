const mongoose = require("mongoose");
require("dotenv").config();

const readConnection = mongoose.createConnection(process.env.URI_READ);
readConnection.on("connected", () =>
  console.log(" Đã kết nối luồng Đọc (Reader)")
);
readConnection.on("error", (err) =>
  console.error(" Lỗi kết nối luồng Đọc:", err)
);

const writeConnection = mongoose.createConnection(process.env.URI_WRITE);
writeConnection.on("connected", () =>
  console.log(" Đã kết nối luồng Ghi (Writer)")
);
writeConnection.on("error", (err) =>
  console.error(" Lỗi kết nối luồng Ghi:", err)
);

const bookSchema = new mongoose.Schema({
  maSP: { type: String, required: true },
  tenSach: { type: String, required: true },
  giaGoc: { type: Number, required: true },
  giaSauThue: { type: Number, required: true },
});

const BookRead = readConnection.model("Book", bookSchema);

const BookWrite = writeConnection.model("Book", bookSchema);

module.exports = { BookRead, BookWrite };
