const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// POST /todo/1?_method=PUT → PUT /todo/1 로 처리
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// 메모리 저장 (서버 재시작 시 초기화)
let todos = [
  { id: 1, text: '아침 운동하기' },
  { id: 2, text: '이메일 확인하기' },
  { id: 3, text: '장보기' },
];
let nextId = 4;

// 1. 목록 조회 (GET /todo)
app.get('/todo', (req, res) => {
  res.json(todos);
});

// 2. 할 일 추가 (POST /todo)
app.post('/todo', (req, res) => {
  const text = (req.body.text || '').trim();
  if (text) {
    todos.push({ id: nextId++, text });
  }
  
  // 프론트엔드 비동기 요청 또는 일반 폼 제출 대응
  if (req.xhr || req.headers.accept?.includes('json')) {
    res.json(todos);
  } else {
    res.redirect('/');
  }
});

// 3. 할 일 수정 (PUT /todo/:id)
app.put('/todo/:id', (req, res) => {
  const id = Number(req.params.id);
  const newText = (req.body.text || '').trim();

  const todo = todos.find(t => t.id === id);
  if (todo && newText) {
    todo.text = newText;
  }

  if (req.xhr || req.headers.accept?.includes('json')) {
    res.json(todos);
  } else {
    res.redirect('/');
  }
});

// 4. 할 일 삭제 (DELETE /todo/:id)
app.delete('/todo/:id', (req, res) => {
  const id = Number(req.params.id);
  todos = todos.filter(t => t.id !== id);

  if (req.xhr || req.headers.accept?.includes('json')) {
    res.json(todos);
  } else {
    res.redirect('/');
  }
});

app.listen(3413, () => {
  console.log(`http://localhost:${3143}`);
});