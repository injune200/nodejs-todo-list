import express from "express";
import connect from "./schemas/index.js";
import todosRouter from "./routes/todos.router.js";
import erroHandlerMiddleware from "./middlewres/erro-handler.middleware.js";

const app = express(); //express 변수
const PORT = 3000; //포트 번호 변수

connect(); //db연결

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./assets")); //assets의 폴더의 파일들을 사용 하겠다. 예시로 localhost:3000/robots.txt를 입력하면 그 텍스트 파일이 보여진다.

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

app.use("/api", [router, todosRouter]);

app.use(erroHandlerMiddleware); //에러 처리 미들웨어를 등록한다.

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
