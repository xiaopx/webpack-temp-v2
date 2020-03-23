import "../sass/common.scss";

if (process.env.NODE_ENV === 'production'){
  console.log('你正在线上环境');
} else {
  console.log('你正在使用开发环境');
}

