// server.js
const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');

// AWS SES 설정
AWS.config.update({
  region: 'us-east-1', // SES 리전 설정 (다른 리전 사용 시 변경)
  accessKeyId: 'your_aws_access_key_id',  // AWS Access Key
  secretAccessKey: 'your_aws_secret_access_key', // AWS Secret Key
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

const app = express();
const port = 3000;

// JSON 형태로 요청 본문을 파싱하기 위해 body-parser 미들웨어 사용
app.use(bodyParser.json());

// 이메일 전송 API
app.post('/api/send-email', async (req, res) => {
  const { name, email, category, company, phone, qna } = req.body;

  // 이메일 내용 구성
  const emailParams = {
    Source: 'contact@defineip.kr', // 검증된 발신자 이메일 주소
    Destination: {
      ToAddresses: ['ip@defineip.kr'], // 수신자 이메일 주소
    },
    Message: {
      Subject: {
        Data: '[DEFINE] 웹사이트 문의 도착',
      },
      Body: {
        Text: {
          Data: `
            [문의 분야]: ${category}
            [이름]: ${name}
            [회사]: ${company}
            [전화번호]: ${phone}
            [이메일]: ${email}
            [문의 내용]: ${qna}
          `,
        },
      },
    },
  };

  // SES를 통해 이메일 전송
  try {
    const data = await ses.sendEmail(emailParams).promise();
    console.log("Email sent successfully", data);
    res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
  } catch (error) {
    console.error("Error sending email", error);
    res.status(500).json({ message: '이메일 전송 실패' });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
