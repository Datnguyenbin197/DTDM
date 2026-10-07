const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo"); 
const { engine } = require("express-handlebars");
const { BookRead, BookWrite } = require("./db");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));

const MSSV = "23IT050";
const HO_TEN = "Nguyễn Quốc Đạt";
const PREFIX = MSSV.slice(-3);
const VAT_RATE = parseInt(MSSV.slice(-1)) + 4;

app.engine("hbs", engine({ extname: ".hbs", defaultLayout: false }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.URI_WRITE,
      dbName: "DB_23IT050",
      collectionName: "sessions",
    }),
  })
);

app.get("/", async (req, res) => {
  try {
    const books = await BookRead.find().lean();
    res.render("home", {
      books,
      HO_TEN,
      MSSV,
      VAT_RATE,
      PREFIX,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi máy chủ khi đọc dữ liệu");
  }
});

app.post("/add", async (req, res) => {
  const { maSP, tenSach, giaGoc } = req.body;

  if (!maSP.startsWith(PREFIX)) {
    return res
      .status(400)
      .send(
        `<h2>TỪ CHỐI XỬ LÝ</h2><p>Mã sản phẩm phải bắt đầu bằng <b>${PREFIX}</b></p><a href="/">Quay lại</a>`
      );
  }

  const giaSauThue = parseFloat(giaGoc) * (1 + VAT_RATE / 100);

  try {
    const newBook = new BookWrite({
      maSP,
      tenSach,
      giaGoc,
      giaSauThue,
    });
    await newBook.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Lỗi máy chủ khi ghi dữ liệu");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Hệ thống khởi chạy thành công tại: http://localhost:${PORT}`);
});
