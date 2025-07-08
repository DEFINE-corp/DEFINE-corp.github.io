// AWS SDK 불러오기
const AWS = require('aws-sdk');
const fetch = require('node-fetch');

// 환경 변수에서 AWS 액세스 키와 시크릿 키를 가져옵니다.
const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

const requestCounts = {};

export default async function handler(req, res) {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // 클라이언트 IP 추출

  // Rate Limiting (5분에 1번 요청만 허용)
  const currentTime = Date.now();
  const windowTime = 5 * 60 * 1000; // 5분
  const limit = 1; // 최대 요청 횟수 (5분에 1번)

  if (!requestCounts[clientIP]) {
    requestCounts[clientIP] = { count: 0, timestamp: currentTime };
  }

  // 요청 시간과 요청 카운트 체크
  if (currentTime - requestCounts[clientIP].timestamp < windowTime) {
    if (requestCounts[clientIP].count >= limit) {
      return res.status(429).json({ message: '요청 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.' });
    }
  } else {
    // 시간 초과 후 카운트 리셋
    requestCounts[clientIP] = { count: 0, timestamp: currentTime };
  }

  // 요청 카운트 증가
  requestCounts[clientIP].count++;

  res.setHeader('Access-Control-Allow-Origin', 'https://www.defineip.kr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email, category, company, phone, qna } = req.body;

    const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    try {
      // Google reCAPTCHA 검증 요청
      const recaptchaResponse = await fetch(recaptchaVerificationUrl, {
        method: 'POST',
      });
      const recaptchaResult = await recaptchaResponse.json();

      // reCAPTCHA 검증 실패 시
      if (!recaptchaResult.success) {
        return res.status(400).json({ message: 'reCAPTCHA 검증에 실패했습니다. 다시 시도해 주세요.' });
      }

      const emailParams = {
        Source: 'ip@defineip.kr',
        Destination: { ToAddresses: ['ip@defineip.kr'] },
        Message: {
          Subject: { Data: '[DEFINE] 웹사이트 문의 도착' },
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
        ReplyToAddresses: [email],
      };

      const data = await ses.sendEmail(emailParams).promise();
      console.log('Email sent:', data);
      return res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ message: '이메일 전송 실패' });
    }
  }

  return res.status(405).json({ message: '허용되지 않은 요청입니다.' });
}