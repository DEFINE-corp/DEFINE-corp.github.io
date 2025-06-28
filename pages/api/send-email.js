// AWS SDK 불러오기
const AWS = require('aws-sdk');

// 환경 변수에서 AWS 액세스 키와 시크릿 키를 가져옵니다.
const ses = new AWS.SES({
  region: 'ap-northeast-2',  // SES가 사용하는 AWS 리전
  accessKeyId: process.env.AKIAUH43KNEYIO3JWRTN,  // AWS Access Key
  secretAccessKey: process.env.L5WB9/hZTTTz1HVPnuiiN67qru4rPxIASC1bgVRt,  // AWS Secret Key
});

export default async (req, res) => {
  // ✅ CORS 설정
  res.setHeader('Access-Control-Allow-Origin', 'https://www.defineip.kr');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ 사전 요청 처리 (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // 브라우저 사전 요청에 대한 응답
  }

  if (req.method === 'POST') {
    const { name, email, category, company, phone, qna } = req.body;

    const emailParams = {
      Source: 'ip@defineip.kr',
      Destination: {
        ToAddresses: ['ip@defineip.kr'],
      },
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
      console.log("Email sent successfully", data);
      res.status(200).json({ message: '이메일이 성공적으로 전송되었습니다.' });
    } catch (error) {
      console.error("Error sending email", error);
      res.status(500).json({ message: '이메일 전송 실패' });
    }
  } else {
    res.status(405).json({ message: '허용되지 않은 요청' });
  }
};