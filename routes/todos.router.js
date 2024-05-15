import express from "express";
import Todo from "../schemas/todo.schemas.js";
import joi from "joi";

const router = express.Router();

const createdTodoSchema = joi.object({
  value: joi.string().min(1).max(50).required(),
});

//할일 등록 api
router.post("/todos", async (req, res, next) => {
  try {
    const validation = await createdTodoSchema.validateAsync(req.body); //입력값 변수에 저장
    const { value } = validation;

    if (!value) {
      return res
        .status(400)
        .json({ errorMessage: "해야할 일{value} 데이터가 존재하지 않습니다." });
    }

    const todoMaxOrder = await Todo.findOne().sort("-order").exec(); // 해당하는 마지막 order 데이터를 조회한다.

    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    const todo = new Todo({ value, order }); //객체 만든거
    await todo.save(); // 데이터 베이스 저장

    return res.status(201).json({ todo: todo }); // json 형태로 돌려주기
  } catch (error) {
    //catch 를 사용함으로서 에러가 나도 서버가 종료 되지 않는다.
    next(error);
  }
});

router.get("/todos", async (req, res, next) => {
  //해야할 일 목록 조회
  const todos = await Todo.find().sort("-order").exec();

  return res.status(200).json({ todos });
});

router.patch("/todos/:todoId", async (req, res, next) => {
  // 순서 변경 // 완료 // 해제
  const { todoId } = req.params;
  const { order, done, value } = req.body;

  const currentTodo = await Todo.findById(todoId).exec();

  if (!currentTodo) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 입니다." });
  }
  //순서 변경
  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save();
    }
    currentTodo.order = order;
  }
  //완료 확인
  if (done !== undefined) {
    currentTodo.doneAt = done ? new Date() : null;
  }
  //내용 변경
  if (value) {
    currentTodo.value = value;
  }

  await currentTodo.save();

  return res.status(200).json({});
});

router.delete("/todos/:todoId", async (req, res, next) => {
  const { todoId } = req.params;

  const todo = await Todo.findById(todoId).exec(); //todoId값에 해당하는 목록 불러오기

  if (!todo) {
    return res
      .status(404)
      .json({ errorMessage: "존재하지 않는 해야할 일 정보입니다." });
  }

  await Todo.deleteOne({ _id: todoId });

  return res.status(200).json({});
});

export default router;
