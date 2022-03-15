
// http://localhost:5000/cloudfunctions-3517c/us-central1/helloWorld

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// //
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
// Expressの読み込み
const express = require("express");
const requestPromise = require("request-promise-native");
const cors = require('cors');

const app = express();

const getDataFromApi = async (keyword) => {
    // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
    const requestUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid={APIキー}&lang=ja&units=metric";
        const result = await requestPromise(`${requestUrl}${keyword}`);
        return result;   
};

app.get("/hello", (req, res) => {
  // レスポンスの設定
  res.send("Hello Express!");
});

app.get("/user/:userId", (req, res) => {
    const users = [
        { id: 1, name: "ジョナサン" },
        { id: 2, name: "ジョセフ" },
        { id: 3, name: "承太郎" },
        { id: 4, name: "仗助" },
        { id: 5, name: "ジョルノ" },
    ];
    const targetUser = users.find(
        (user) => user.id === Number(req.params.userId)
    );
    res.send(targetUser);
});

// エンドポイント追加
app.get("/weather", cors(), async (req, res) => {
    // APIリクエストの関数を実行
    const response = await getDataFromApi(req.params.keyword);
    res.send(response);
});

// 出力
const api = functions.region('asia-northeast1').https.onRequest(app);
module.exports = { api };

