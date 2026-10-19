const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // 프론트엔드 fetch 요청(JSON)을 받기 위해 필요합니다.
// POST /todos/1?_method=PUT → PUT /todos/1 로 처리
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 저장 (서버 재시작 시 초기화)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

// 1. 목록 조회 (참고 사이트가 요청하는 경로: /todos)
app.get('/todos', (req, res) => {
  res.json(todos);
});

// 2. 항목 추가 (경로: /todos)
app.post('/todos', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) {
    todos.push({ id: nextId++, text });
  }
  // 프론트엔드가 JSON을 기대하는지 리다이렉트를 기대하는지에 따라 응답 처리
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json(todos);
  } else {
    res.redirect('/');
  }
});

// 3. 수정 처리 (경로: /todos/:id)[cite: 1, 2]
app.put('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const newText = (req.body.text || '').trim();

  const todo = todos.find(t => t.id === id);
  if (todo && newText) {
    todo.text = newText;
  }
  
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json(todos);
  } else {
    res.redirect('/');
  }
});

// 4. 삭제 처리 (경로: /todos/:id)[cite: 1, 2]
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json(todos);
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
