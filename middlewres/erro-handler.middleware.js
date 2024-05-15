export default (err, req, res, next) => {
  console.error(err);
  if (eroor.name == -"ValidationError") {
    return res.status(400).json({ errorMessage: error.message }); //유효성 검사에서 에러가 났을 때
  }

  return res
    .status(500)
    .json({ errorMessage: "서버에서 에러가 발생했습니다." }); // 서버에
};
