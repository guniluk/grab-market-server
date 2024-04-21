const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'uploads/') },
    filename: function (req, file, cb) { cb(null, file.originalname); }
  })
});
const port = 8080;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/banners', (req, res) => {
  models.Banner.findAll(
    {
      limit: 2
    }
  ).then((result) => {
    console.log(`BANNER: ${result}`);
    res.send({
      banners: result
    });
  }).catch((error) => {
    console.error(error);
    res.status(500).send("banner 에러 발생");
  });
});



app.get("/products", (req, res) => {
  // const query = req.query;
  // console.log('QUERY: ', query);
  models.Product.findAll(
    {
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "price", "seller", "imageUrl", "createdAt", "soldout"]
    }
  ).then((result) => {
    console.log(`PRODUCTS: ${result}`);
    res.send({
      products: result
    });
  }).catch((error) => {
    console.error(error);
    res.status(400).send("에러 발생");
  });
});

//   res.send({
//     "products": [{
//       "id": 1,
//       "name": "농구공 1호",
//       "price": 50000,
//       "seller": ["./images/icons/avatar.png", "영하"],
//       "imgUrl": "./images/products/basketball1.jpeg"
//     }, {
//       "id": 2,
//       "name": "덤벨 2호",
//       "price": 130000,
//       "seller": ["./images/icons/camera.png", "현희"],
//       "imgUrl": "./images/products/dumbell2.jpeg"
//     }, {
//       "id": 3,
//       "name": "키보드 3호",
//       "price": 125000,
//       "seller": ["./images/icons/logo.png", "건일욱"],
//       "imgUrl": "./images/products/keyboard1.jpg"
//     }]
//   });

app.post('/products', (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send(`모든 필드를 작성하시오`);
  };
  models.Product.create({
    name: name,
    description: description,
    price: price,
    seller: seller,
    imageUrl: imageUrl
  }).then((result) => {
    console.log(`상품생성결과: ${result}`);
    res.send({
      result,
    });
  }).catch((error) => {
    console.error(error);
    res.status(400).send("상품 업로드에 문제가 발생!");
  });
});

app.get("/products/:id", (req, res) => {
  const params = req.params;
  const { id } = params;
  // res.send(`id는 ${params.id}입니다.`);
  models.Product.findOne({ where: { id: params.id } }).then((result) => {
    console.log(`PRODUCTS: ${result}`);
    res.send(result);
  }).catch((error) => {
    console.error(error);
    res.status(400).send("상세 상품검색 시 에러 발생");
  });
});

app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path
  });
});

app.post('/purchase/:id', (req, res) => {
  const { id } = req.params;
  models.Product.update(
    { soldout: 1 }, { where: { id: id } }
  ).then((result) => {
    res.send({ result: true })
  }).catch((error) => {
    console.error(error);
    res.status(500).send("에러 발생");
  });
})


app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize.sync().then(() => {
    console.log("DB연결 성공!");
  }).catch((error) => {
    console.error("Error: " + error);
    console.log("DB연결 실패!");
    process.exit(); //process 종료
  });
});