// AWS SDK 불러오기
const AWS = require('aws-sdk');

// 환경 변수에서 AWS 액세스 키와 시크릿 키를 가져옵니다.
const ses = new AWS.SES({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.defineip.kr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { name, email, category, company, phone, qna } = req.body;

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

    try {
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